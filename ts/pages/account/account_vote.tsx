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

const Status = styled.div<StatusProps>`
    font-size: 20px;
    color: ${props => props.color};
    text-transform: capitalize;
    margin-bottom: 12px;
    display: flex;
    align-items: center;

    svg {
        margin-right: 8px;
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
         <Status color={vote === 'yes' ? colors.brandLight : '#E71D36'}>
             {vote === 'yes' ? (
                <svg width={14} viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 1L6 12L1 7" stroke={colors.brandLight} strokeWidth="1.4" />
                </svg>
                ) : (
                <svg width={14} viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.50551 6.99961L0 12.5051L0.989949 13.4951L6.49546 7.98956L12.001 13.4951L12.9909 12.5051L7.48541 6.99961L12.99 1.49508L12 0.505127L6.49546 6.00966L0.990926 0.505127L0.0009767 1.49508L5.50551 6.99961Z"
                        fill="#E71D36"
                    />
                </svg> 
             )}

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
