import { findUser, log, newUser, respondCustom, writeUser } from '../utils';
import { findStation, getNsData } from '../ns/utils';
import { composeDeparturesMsg, composeSettingsMsg, composeUpdateDefaultMsg } from '../slack/blocks';

export default async (payload) => {
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
