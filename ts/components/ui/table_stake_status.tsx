import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface StakeStatus {
    title: string;
    subtitle: string;
}

interface StatusColors {
    [key: string]: string;
}

interface StatusTextProps {
    status: string;
}

export const StakeStatus: React.StatelessComponent<StakeStatus> = ({
    subtitle,
    title,
}) => {
    return (
        <>
            <StatusText status={title}>
                {title}
            </StatusText>

            <StatusId>
                {subtitle}
            </StatusId>
        </>
    );
};

const statusColors: StatusColors = {
    processed: 'green',
    locked: 'red',
    processing: 'black',
};

const StatusText = styled.strong<StatusTextProps>`
    margin-bottom: 10px;
    display: block;
    text-transform: capitalize;
    color: ${props => statusColors[props.status]};
`;

const StatusId = styled.span`
    font-size: 17px;
    color: ${colors.textDarkSecondary};
`;
