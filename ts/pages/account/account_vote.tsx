import * as React from 'react';
import styled from 'styled-components';

import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';

// WIP: non-required for testing
export interface AccountVoteProps {
    vote?: string;
    title?: string;
    zeipId?: number;
    summary?: string;
}

interface StatusProps {
    color: string;
}

const Wrap = styled.div`
    padding: 30px;
    background-color: ${colors.backgroundLightGrey};

    @media (min-width: 768px) {
        width: calc(50% - 10px);

        &:nth-child(n + 3) {
            margin-top: 20px;
        }
    }

    @media (max-width: 768px) {
        width: 100%;

        & + & {
            margin-top: 20px;
        }
    }
`;

const Status = styled.p<StatusProps>`
    font-size: 20px;
    color: ${props => props.color};
    text-transform: capitalize;
    margin-bottom: 12px;
`;

export const AccountVote: React.StatelessComponent<AccountVoteProps> = ({
    vote,
    title = 'StaticCallAssetProxy',
    zeipId = '00',
    summary = 'Test summary',
}) => {
 return (
    <Wrap>
        <Status color={vote === 'yes' ? '#00AE99' : '#E71D36'}>
            Voted {vote}
        </Status>

        <Heading
            marginBottom="15px"
        >
            {title} (ZEIP-{zeipId})
        </Heading>

        <Paragraph isNoMargin={true}>
            {summary}
        </Paragraph>
    </Wrap>
 );
};
