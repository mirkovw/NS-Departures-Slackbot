import config from 'config';
import { findUser, log, newUser, respondCustom, writeUser } from '../utils';
import { findStation, getNsData } from '../ns/utils';
import {
    composeDeparturesMsg,
    composeNotificationsModal,
    composeSettingsMsg,
    composeUpdateDefaultConfirmMsg,
    composeUpdateDefaultMsg,
} from './blocks';

export const handleCommand = async (payload) => {
    let msg;
    let msgUpdate;
    const user = await findUser(payload.user_id) !== undefined ? await findUser(payload.user_id) : await writeUser(newUser(payload));
    if (payload.command === '/ns') {
        const isSettings = payload.text.toLocaleLowerCase() === 'settings' || (payload.text === '' && user.station === 'NONE');

        if (isSettings) {
            log.info(`${user.userName} request settings`);
            msg = await composeSettingsMsg(user); // send settings page
        } else {
            const station = payload.text !== '' ? findStation(payload.text) : findStation(user.station);
            log.info(`${user.userName} REQUEST DEPARTURES FOR ${station.label.toUpperCase()}`);
            const departures = await getNsData(station);
            msg = await composeDeparturesMsg(user, station, departures);

            if (station.label !== user.station) {
                msgUpdate = composeUpdateDefaultMsg(user, station);
            }
        }

        await respondCustom(payload.response_url, { response_type: isSettings ? 'ephemeral' : 'in_channel', blocks: msg.blocks });
        if (msgUpdate) await respondCustom(payload.response_url, { response_type: 'ephemeral', blocks: msgUpdate.blocks });
        return true;
    }
    return false;
};

export const updateDefaultStation = async (payload, userParam) => {
    const user = userParam;
    const station = findStation(payload.actions[0].value);
    user.station = station.label; // update default station in user object
    await writeUser(user); // write user object to json

    log.info(`UPDATED DEFAULT STATION TO ${station.label.toUpperCase()}`);

    return respondCustom(payload.response_url, {
        replace_original: true,
        blocks: composeUpdateDefaultConfirmMsg(station).blocks,
    });
};


export const updateNotifications = async (payload, userParam) => {
    let user = userParam;
    user.updateSettings.channelId = payload.container.channel_id;
    user.updateSettings.ts = payload.container.message_ts;
    user.updateSettings.responseUrl = payload.response_url;
    user = await writeUser(user);
    log.info(`UPDATE NOTIFICATIONS FOR ${user.userName}`);

    const view = composeNotificationsModal(user);

    return respondCustom('https://slack.com/api/views.open', {
        trigger_id: payload.trigger_id,
        view,
    }, {
        headers: { Authorization: `Bearer ${config.get('slack.botToken')}` },
    });
};


export const handleViewSubmission = async (payload, userParam) => {
    let user = userParam;
    const { values } = payload.view.state;
    user.notifications.enabled = true;
    user.notifications.days = [];
    for (let i = 0; i < values.days_select.days_select_value.selected_options.length; i += 1) {
        user.notifications.days.push(values.days_select.days_select_value.selected_options[i].value);
    }
    user.notifications.time.hour = values.hour_select.hour_select_value.selected_option.value;
    user.notifications.time.minute = values.minute_select.minute_select_value.selected_option.value;
    user = await writeUser(user);

    const blocks = await composeSettingsMsg(user);

    log.info(`NOTIFICATIONS UPDATED FOR ${user.userName}`);

    return respondCustom(user.updateSettings.responseUrl, {
        replace_original: true,
        blocks: blocks.blocks,
    });
};

export const clearNotifications = async (payload, userParam) => {
    let user = userParam;
    user.notifications.enabled = false;
    user = await writeUser(user);

    const blocks = await composeSettingsMsg(user);

    log.info(`NOTIFICATIONS OFF FOR ${user.userName}`);

    return respondCustom(payload.response_url, {
        replace_original: true,
        blocks: blocks.blocks,
    });
};

export const sendNotification = async (user) => {
    log.info(`Sending notification to ${user.userName}`);
    const station = findStation(user.station);
    const departures = await getNsData(station);
    const msg = await composeDeparturesMsg(user, station, departures);

    try {
        await respondCustom('https://slack.com/api/chat.postMessage', {
            channel: user.userId,
            text: 'Your daily NS Departures notification is ready to view.',
            blocks: msg.blocks,
        }, {
            headers: { Authorization: `Bearer ${config.get('slack.botToken')}` },
        });
    } catch (err) {
        log.error(err);
    }
};
