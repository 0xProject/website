import { logUtils } from '@0x/utils';
import { format } from 'date-fns';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, RouteChildrenProps, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { DashboardHero } from 'ts/components/staking/dashboard_hero';
import { HistoryChart } from 'ts/components/staking/history_chart';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { useAPIClient } from 'ts/hooks/use_api_client';

// import { colors } from 'ts/style/colors';

import { State } from 'ts/redux/reducer';
import { PoolWithHistoricalStats, WebsitePaths } from 'ts/types';
import { formatEther, formatZrx } from 'ts/utils/format_number';
import { utils } from 'ts/utils/utils';

export interface ActionProps {
    children: React.ReactNode;
    title: string;
    figure: string;
}

export interface StakingPoolProps extends RouteChildrenProps {
    websiteUrl: string;
    isVerified: boolean;
}

const Container = styled.div`
    max-width: 1152px;
    margin: 0 auto;
    padding: 0 20px;
`;

const Heading = styled.h2`
    font-size: var(--defaultHeading);
    line-height: 1.35;
    margin-bottom: 20px;
`;

const GraphHeading = styled(Heading)`
    margin-bottom: 60px;
    display: none;
    @media (min-width: 768px) {
        display: block;
    }
`;
/*
const TradingPairContainer = styled.div`
    display: inline-block;
    width: 330px;
`;

const ActionsWrapper = styled.div`
    padding: 20px;
    margin-top: 0;
    @media (min-width: 768px) {
        padding: 60px 30px;
        background-color: ${colors.backgroundLightGrey};
        margin: 30px 30px 70px;
    }
`;

const ActionsInner = styled.div`
    max-width: 1152px;
    margin: 0 auto;
`;

const ActionHeading = styled.h2`
    font-size: 28px;
    margin-bottom: 14px;
    @media (min-width: 768px) {
        margin-bottom: 30px;
        font-size: 34px;
    }
`;

const ActionContainer = styled.div`
    padding: 20px;
    margin-bottom: 16px;
    background-color: ${colors.backgroundLightGrey};
    display: flex;
    flex-direction: column;
    @media (min-width: 768px) {
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        background-color: ${colors.white};
        flex: 1;
        margin-right: 30px;
        margin-bottom: 0;
        &:last-child {
            margin-right: 0;
        }
    }
`;

const Actions = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const ActionText = styled.div`
    line-height: 1.35;
    margin-bottom: 18px;
    @media (min-width: 768px) {
        margin-bottom: 0;
    }
    h3 {
        font-size: 20px;
        @media (min-width: 991px) {
            font-size: 28px;
        }
        //@media (min-width: 768px) {
            //font-size: 24px;
        //}
        //@media (min-width: 991px) {
            //font-size: 28px;
        //}
    }
    span {
        color: #999999;
        font-size: 16px;
        margin-bottom: 10px;
        display: block;
        @media (min-width: 768px) {
            font-size: 17px;
        }
    }
`;

const ActionButton = styled.div`
    background-color: ${colors.white};
    flex: 1;
    @media (min-width: 768px) {
        flex: 0 0 180px;
    }
`;

const Action: React.FC<ActionProps> = ({ children, title, figure }) => {
    return (
        <ActionContainer>
            <ActionText>
                <span>{title}</span>
                <h3>{figure}</h3>
            </ActionText>
            <ActionButton>{children}</ActionButton>
        </ActionContainer>
    );
};

const tradingPairs = [
    {
        id: '29n5c290cn0cc2943cn239',
        price: '1,200',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        price: '1,200',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
];
*/
export const StakingPool: React.FC<StakingPoolProps & RouteChildrenProps> = props => {
    const { poolId } = useParams();

    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);
    const [stakingPool, setStakingPool] = useState<PoolWithHistoricalStats | undefined>(undefined);

    useEffect(() => {
        apiClient
            .getStakingPoolByIdAsync(poolId)
            .then(res => setStakingPool(res.stakingPool))
            .catch(e => logUtils.warn(e));
    }, [poolId, setStakingPool, apiClient]);

    // Ensure poolId exists else redirect back to home page
    if (!poolId) {
        return <Redirect to={WebsitePaths.Staking} />;
    }

    if (!stakingPool) {
        return null;
    }

    const currentEpoch = stakingPool.currentEpochStats;

    // Only allow epochs that have finished into historical data
    const historicalEpochs = stakingPool.epochRewards.filter(x => !!x.epochEndTimestamp);

    return (
        <StakingPageLayout isHome={true} title="Staking pool">
            <DashboardHero
                title={utils.getPoolDisplayName(stakingPool)}
                websiteUrl={stakingPool.metaData.websiteUrl}
                poolId={stakingPool.poolId}
                operatorAddress={stakingPool.operatorAddress}
                isVerified={stakingPool.metaData.isVerified}
                estimatedStake={currentEpoch.approximateStakeRatio * 100}
                rewardsShared={(1 - currentEpoch.operatorShare) * 100}
                iconUrl={stakingPool.metaData.logoUrl}
                tabs={[
                    {
                        title: 'Current Epoch',
                        metrics: [
                            // todo(johnrjj) Cutting volume for MVP
                            // {
                            //     title: 'Total Volume',
                            //     number: '1.23M USD',
                            // },
                            {
                                title: 'ZRX Staked',
                                number: `${formatZrx(currentEpoch.zrxStaked).minimized}`,
                            },
                            {
                                title: 'Fees Generated',
                                // 4 decimals looks better here to keep it from wrapping
                                number: `${
                                    formatEther(currentEpoch.totalProtocolFeesGeneratedInEth, {
                                        decimals: 4,
                                        decimalsRounded: 4,
                                    }).minimized
                                } ETH`,
                            },
                            {
                                title: 'Rewards Shared',
                                // No good way to show rewards shared of an epoch in progress (currentEpoch) right now.
                                // Defaulting to dash ('-') for now
                                number: `${
                                    formatEther('0', {
                                        zeroStyled: true,
                                    }).formatted
                                } ETH`,
                            },
                        ],
                    },
                    {
                        title: 'All Time',
                        metrics: [
                            {
                                title: 'ZRX Staked',
                                number: `${formatZrx(currentEpoch.zrxStaked).minimized}`,
                            },
                            {
                                title: 'Fees Generated',
                                number: `${
                                    // Use totalRewardsPaidInEth instead of protocolFeesGeneratedInEth because
                                    // totalRewardsPaidInEth is protocolFeesGeneratedInEth (and subsidies)
                                    formatEther(stakingPool.allTimeStats.totalRewardsPaidInEth, {
                                        decimalsRounded: 4,
                                        decimals: 4,
                                    }).formatted
                                } ETH`,
                            },
                            {
                                title: 'Rewards Shared',
                                number: `${
                                    formatEther(stakingPool.allTimeStats.membersRewardsPaidInEth, {
                                        decimals: 4,
                                        decimalsRounded: 4,
                                    }).formatted
                                } ETH`,
                            },
                        ],
                    },
                ]}
            />
            {/* TODO(johnrjj) Copy from account page when finished */}
            {/* <ActionsWrapper>
                <ActionsInner>
                    <ActionHeading>Your Stake</ActionHeading>
                    <Actions>
                        <Action title="Staked ZRX" figure="281,345 ZRX">
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
                        </Action>
                        <Action title="Staked ZRX" figure="281,345 ZRX">
                            <Button
                                to="/"
                                color={colors.white}
                                fontSize="17px"
                                fontWeight="300"
                                padding="15px 35px"
                                isFullWidth={true}
                            >
                                View History
                            </Button>
                        </Action>
                    </Actions>
                </ActionsInner>
            </ActionsWrapper> */}
            <Container>
                <GraphHeading>Historical Details</GraphHeading>
                <HistoryChart
                    fees={historicalEpochs.map(e => e.totalRewardsPaidInEth)}
                    rewards={historicalEpochs.map(e => e.membersRewardsPaidInEth)}
                    epochs={historicalEpochs.map(() => 3)} // magic number
                    labels={historicalEpochs.map(e => format(new Date(e.epochEndTimestamp), 'd MMM'))}
                />
                {/* TODO(johnrjj) Trading pairs after launch */}
                {/* <Heading>Trading Pairs</Heading>
                <div>
                    {tradingPairs.map(({ price, currency, firstCurrency, secondCurrency, id, url }) => {
                        return (
                            <TradingPairContainer key={id}>
                                <TradingPair
                                    key={id}
                                    id={id}
                                    url={url}
                                    price={price}
                                    currency={currency}
                                    firstCurrency={firstCurrency}
                                    secondCurrency={secondCurrency}
                                />
                            </TradingPairContainer>
                        );
                    })}
                </div> */}
            </Container>
        </StakingPageLayout>
    );
};
