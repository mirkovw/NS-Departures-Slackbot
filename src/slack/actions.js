import config from 'config';
import { findStation } from '../ns/utils';
import { writeUser, log, respondCustom } from '../utils';
import { composeUpdateDefaultConfirmMsg, composeNotificationsModal, composeSettingsMsg } from '../slack/blocks';

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

