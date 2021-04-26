import * as _ from 'lodash';
import * as moment from 'moment-timezone';

import * as React from 'react';

import { Paragraph } from 'ts/components/text';

interface Props {
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface TimeStructure {
    year?: number;
    month?: number;
    week?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    [key: string]: number;
}

const now = moment();

export const Countdown: React.StatelessComponent<Props> = ({ startDate, endDate }) => {
    const startTime = startDate.local();
    const endTime = endDate.local();
    const isUpcoming = now.isBefore(startTime);
    const isOver = endTime.isBefore(now);
    let voteTextPrefix;
    if (isUpcoming) {
        voteTextPrefix = 'Voting starts: ';
    } else if (isOver) {
        voteTextPrefix = 'Voting ended: ';
    } else {
        voteTextPrefix = 'Voting ends: ';
    }
    const timeToDisplay = isUpcoming ? startTime : endTime;
    const timeText = isUpcoming ? ` • ${getRelativeTime(timeToDisplay)}` : ``;
    const voteText = `${voteTextPrefix} ${timeToDisplay.format('L LT')} ${moment()
        .tz(moment.tz.guess())
        .format('z')} ${timeText}`;

    // TODO convert to container component
    return (
        <div>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <Paragraph>{voteText} </Paragraph>
            </div>
        </div>
    );
};

function getRelativeTime(time: moment.Moment): string {
    const diff = moment().diff(time);
    const duration = moment.duration(diff);

    return millisToDaysHoursMinutes(duration.asMilliseconds());
}

function millisToDaysHoursMinutes(futureDateMs: number): string {
    let delta = Math.abs(futureDateMs - now.milliseconds()) / 1000;
    const result: TimeStructure = {};
    const structure: TimeStructure = {
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    _.keys(structure).forEach((key: string) => {
        result[key] = Math.floor(delta / structure[key]);
        delta -= result[key] * structure[key];
    });

    return `${result.day} days ${result.hour} hours ${result.minute} mins`;
}
