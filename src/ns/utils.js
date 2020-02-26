import config from 'config';
import axios from 'axios';
import stations from './stations';
import { log } from '../utils';

const levenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // increment along the first column of each row
    for (let i = 0; i <= b.length; i += 1) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (let j = 0; j <= a.length; j += 1) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i += 1) {
        for (let j = 1; j <= a.length; j += 1) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1,
                    ),
                ); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};

export const getNsData = async (station) => {
    try {
        const apiDataResult = await axios.get(config.get('nsApiUrl'), { params: { station: station.tpa }, headers: { 'Ocp-Apim-Subscription-Key': config.get('ns.apiKey') } });
        return apiDataResult.data.payload.departures;
    } catch (error) {
        log.error(error);
        return false;
    }
};

const findSmallestDiff = (acc, loc) => (acc.diff < loc.diff ? acc : loc);

export const findStation = (str) => {
    const resultsArr = [];

    for (let i = 0; i < stations.length; i += 1) {
        const currentDifference = levenshteinDistance(str.toLowerCase(), stations[i].label.toLowerCase());
        resultsArr.push({
            diff: currentDifference,
            location: i,
            label: stations[i].label,
            uicCode: stations[i].uicCode,
            tpa: stations[i].tpa,
        });
    }

    return resultsArr.reduce(findSmallestDiff);

    // return reduction;
    // return resultsArr.reduce((acc, loc) => (acc.diff < loc.diff ? acc : loc));
};
