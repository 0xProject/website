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
    rewards: string;
    fees: string;
    staked: string;
    userData: UserData;
    timeRemaining: string;
}

export const AccountStakeOverview: React.StatelessComponent<StakeOverviewProps> = ({
    title,
    subtitle,
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
                />

                <Flex>
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
                </Flex>
            </Flex>

            <Flex>
                <Action>
                    <div>
                        <Heading
                            size={14}
                            marginBottom="12px"
                        >
                            Your stake
                        </Heading>

                        {userData.amount} ZRX
                    </div>

                    <Button color="red" bgColor="#fff" borderColor={colors.border}>
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

                    <Button color="#fff">
                        View history
                    </Button>
                </Action>
            </Flex>
        </Wrap>
    );
};

const Wrap = styled.div`
    padding: 0 20px;
    border: 1px solid ${colors.border};

    & + & {
        margin-top: 20px;
    }
`;

const FlexBase = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Flex = styled(FlexBase)`
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & + & {
        border-top: 1px solid ${colors.border};
    }
`;

const Action = styled(FlexBase)`
    width: calc(50% - 10px);
    background-color: ${colors.backgroundLightGrey};
    padding: 20px;

    > div {
        font-size: 18px;
    }
`;

const InlineStats = styled(FlexBase)`
    div + div {
        margin-left: 45px;
    }
`;
