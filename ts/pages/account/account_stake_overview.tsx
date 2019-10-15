import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Heading } from 'ts/components/text';
import { PanelHeader } from 'ts/components/ui/panel_header';
import { StatFigure } from 'ts/components/ui/stat_figure';
import { colors } from 'ts/style/colors';

interface UserData {
    amount: string | number;
    rewards: string | number;
}

interface StakeOverviewProps {
    title: string;
    subtitle: string;
    avatarSrc?: string;
    rewards: string;
    fees: string;
    staked: string;
    userData: UserData;
    timeRemaining: string;
}

export const AccountStakeOverview: React.StatelessComponent<StakeOverviewProps> = ({
    title,
    subtitle,
    avatarSrc,
    rewards,
    fees,
    staked,
    userData,
    timeRemaining,
}) => {
    return (
        <Wrap>
            <Flex>
                <PanelHeader
                    title={title}
                    subtitle={subtitle}
                    avatarSrc={avatarSrc}
                    isResponsiveAvatar={true}
                />

                <Stats>
                    <StatFigure
                        label="Fees Generated"
                        value={fees}
                    />
                    <StatFigure
                        label="Rewards Shared"
                        value={rewards}
                    />
                    <StatFigure
                        label="Staked"
                        value={staked}
                    />
                </Stats>
            </Flex>

            <Flex>
                <Action>
                    <InlineStats>
                        <div>
                            <Heading
                                size={14}
                                marginBottom="12px"
                            >
                                Your stake
                            </Heading>

                            {userData.amount} ZRX
                        </div>
                    </InlineStats>

                    <Button
                        to="/"
                        color={colors.red}
                        borderColor={colors.border}
                        bgColor={colors.white}
                        fontSize="17px"
                        fontWeight="300"
                        isNoBorder={true}
                        padding="15px 35px"
                    >
                        Remove
                    </Button>
                </Action>

                <Action>
                    <InlineStats>
                        <div>
                            <Heading
                                size={14}
                                marginBottom="12px"
                            >
                                Your rewards
                            </Heading>

                            {userData.rewards} ETH
                        </div>

                        <div>
                            <Heading
                                size={14}
                                marginBottom="12px"
                            >
                                Next epoch
                            </Heading>

                            {timeRemaining}
                        </div>
                    </InlineStats>

                    <Button
                        to="/account/history"
                        color={colors.white}
                        fontSize="17px"
                        fontWeight="300"
                        padding="15px 35px"
                    >
                        View History
                    </Button>
                </Action>
            </Flex>

            <MobileActions>
                <Button
                    to="/account/history"
                    color={colors.white}
                    fontSize="17px"
                    fontWeight="300"
                    padding="15px 35px"
                    isFullWidth={true}
                >
                    View History
                </Button>

                <Button
                    to="/"
                    color={colors.red}
                    borderColor="#D5D5D5"
                    bgColor={colors.white}
                    isTransparent={true}
                    fontSize="17px"
                    fontWeight="300"
                    isNoBorder={true}
                    padding="15px 35px"
                    isFullWidth={true}
                >
                    Remove
                </Button>
            </MobileActions>
        </Wrap>
    );
};

const Wrap = styled.div`
    & + & {
        margin-top: 20px;
    }

    @media (min-width: 768px) {
        padding: 0 20px;
        border: 1px solid ${colors.border};
    }

    @media (max-width: 768px) {
        padding: 20px;
        background: ${colors.backgroundLightGrey};
    }
`;

const FlexBase = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Flex = styled(FlexBase)`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 768px) {
        padding: 20px 0;

        & + & {
            border-top: 1px solid ${colors.border};
        }
    }
`;

const Stats = styled(Flex)`
    @media (max-width: 768px) {
        display: none;
    }
`;

const Action = styled(FlexBase)`
    width: calc(50% - 10px);
    background-color: ${colors.backgroundLightGrey};

    > div {
        font-size: 18px;
        flex-shrink: 0;
    }

    @media (min-width: 768px) {
        padding: 20px;
    }

    @media (max-width: 768px) {
        margin: 20px 0;

        & + & {
            border-left: 1px solid ${colors.border};
            padding-left: 30px;
        }

        button, a {
            display: none;
        }
    }
`;

const InlineStats = styled(FlexBase)`
    padding-right: 30px;

    div + div {
        margin-left: 45px;
    }

    @media (max-width: 768px) {
        div:nth-child(2) {
            display: none;
        }
    }
`;

const MobileActions = styled.div`
    button {
        display: block;
        width: 100%;
    }

    a + button,
    a + a {
        margin-top: 16px;
    }

    @media (min-width: 768px) {
        display: none;
    }
`;
