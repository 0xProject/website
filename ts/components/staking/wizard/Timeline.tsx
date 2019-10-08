import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface TimelineItem {
    date: string;
    fromNow: string;
    title: string;
    description: string;
    isActive: boolean;
}

interface TimelineProps {
    items: TimelineItem[];
    activeItemIndex: number;
    header: string;
    description: string;
}

interface TimelineContentProps {
    isActive: boolean;
}

const TimelineItem = styled.li`
    display: flex;
`;

const TimelineDate = styled.div`
    font-size: 17px;
    font-weight: 300;
    flex: 0 0 90px;
    & > span {
        margin-bottom: 10px;
        display: block;
        &:last-child {
            color: ${colors.textDarkSecondary};
        }
    }
`;

const TimelineContent = styled.div<TimelineContentProps>`
    border-left: 1px solid #e6e6e6;
    padding: 0 40px 60px;
    position: relative;

    h3 {
        font-size: 20px;
        margin-bottom: 15px;
    }

    p {
        font-size: 17px;
        font-weight: 300;
        color: ${colors.textDarkSecondary};
        line-height: 1.35;
    }

    ${TimelineItem}:last-child & {
        padding-bottom: 0;
    }

    &:before {
        content: '';
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: ${props => (props.isActive ? colors.black : '#E6E6E6')};
        top: 0;
        left: -8px;
    }
`;

const TimelineHeader = styled.h1`
    font-size: 50px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 15px;
`;

const TimelineDescription = styled.h2`
    font-size: 18px;
    font-weight: 300;
    color: ${colors.textDarkSecondary};
    line-height: 1.44;
    margin-bottom: 60px;
    max-width: 340px;
`;

export const Timeline: React.FC<TimelineProps> = props => {
    const { items, activeItemIndex, header } = props;
    return (
        <>
            <TimelineHeader>{header}</TimelineHeader>
            <TimelineDescription>{props.description}</TimelineDescription>
            <ol>
                {items.map((item, index) => {
                    const { date, fromNow, title, description } = item;
                    const isActive = activeItemIndex === index;
                    return (
                        <TimelineItem key={date}>
                            <TimelineDate>
                                <span>{fromNow}</span>
                                <span>{date}</span>
                            </TimelineDate>
                            <TimelineContent isActive={isActive}>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </ol>
        </>
    );
};
