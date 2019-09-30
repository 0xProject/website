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
        & + & {
            margin-top: 20px;
        }
    }
`;

export const AccountVote: React.StatelessComponent<AccountVoteProps> = ({
    vote,
    title = 'StaticCallAssetProxy',
    zeipId = '00',
    summary = 'Test summary',
}) => {
 return (
    <Wrap>
        <Heading>
            {title} (ZEIP-{zeipId})
        </Heading>

        <Paragraph>
            {summary}
        </Paragraph>
    </Wrap>
 );
};
