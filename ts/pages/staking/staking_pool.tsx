import { BigNumber, logUtils } from '@0x/utils';
import { format } from 'date-fns';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, RouteChildrenProps, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { DashboardHero } from 'ts/components/staking/dashboard_hero';
import { HistoryChart } from 'ts/components/staking/history_chart';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { InfoTooltip } from 'ts/components/ui/info_tooltip';

import { useAPIClient } from 'ts/hooks/use_api_client';

import { State } from 'ts/redux/reducer';
import { PoolEpochRewards, PoolWithHistoricalStats, WebsitePaths } from 'ts/types';
import { errorReporter } from 'ts/utils/error_reporter';
import { formatEther, formatZrx, formatPercent } from 'ts/utils/format_number';
import { stakingUtils } from 'ts/utils/staking_utils';

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

const TooltipLabel = styled.span`
    font-weight: 600;
`;

export const StakingPool: React.FC<StakingPoolProps & RouteChildrenProps> = (props) => {
    const { poolId } = useParams();

    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);
    const [stakingPool, setStakingPool] = useState<PoolWithHistoricalStats | undefined>(undefined);
    const [epochRewards, setEpochRewards] = useState<PoolEpochRewards[] | undefined>(undefined);
    const [stakingPoolAPY, setStakingPoolAPY] = useState<number | undefined>(undefined);

    useEffect(() => {
        const calcAverageEpochApy = (numEpochs: number, rewards: PoolEpochRewards[]) => {
            const rewardsToAverage =
                rewards.length > numEpochs ? rewards.slice(Math.max(rewards.length - numEpochs, 0)) : rewards;

            const historicalAPYs = rewardsToAverage.map((reward) => {
                return reward.apy;
            });
            const average = (arr: number[]) => arr.reduce((sum, el) => sum + el, 0) / arr.length;
            setStakingPoolAPY(average(historicalAPYs));
        };
        apiClient
            .getStakingPoolByIdAsync(poolId)
            .then((res) => {
                setStakingPool(res.stakingPool);
                apiClient
                    .getStakingPoolRewardsAsync(poolId)
                    .then((resRewards) => {
                        // fix this, shouldnt be unnecessarily nested
                        setEpochRewards(resRewards.stakingPoolRewards.epochRewards);
                        calcAverageEpochApy(7, resRewards.stakingPoolRewards.epochRewards);
                    })
                    .catch((err: Error) => {
                        logUtils.warn(err);
                        errorReporter.report(err);
                    });
            })
            .catch((err: Error) => {
                logUtils.warn(err);
                errorReporter.report(err);
            });
    }, [poolId, setStakingPool, apiClient]);

    // Ensure poolId exists else redirect back to home page
    if (!poolId) {
        return <Redirect to={WebsitePaths.Staking} />;
    }

    if (!stakingPool) {
        return null;
    }

    const currentEpoch = stakingPool.currentEpochStats;
    const nextEpoch = stakingPool.nextEpochStats;

    // Reminder: stake change can be negative
    const zrxStakeChangeBetweenEpochs = new BigNumber(nextEpoch.zrxStaked || 0)
        .minus(new BigNumber(currentEpoch.zrxStaked || 0))
        .toNumber();

    // Only allow epochs that have finished into historical data
    const historicalEpochs = epochRewards
        ? epochRewards
              .filter((x) => !!x.epochEndTimestamp)
              .sort((a, b) => {
                  return a.epochId - b.epochId;
              })
        : null;

    const fullyStakedZrx = nextEpoch.zrxStaked / (nextEpoch.approximateStakeRatio || 1);
    const zrxToStaked = Math.max(fullyStakedZrx - nextEpoch.zrxStaked, 0);

    return (
        <StakingPageLayout isHome={true} title="Staking pool">
            <DashboardHero
                title={stakingUtils.getPoolDisplayName(stakingPool)}
                websiteUrl={stakingPool.metaData.websiteUrl}
                poolId={stakingPool.poolId}
                operatorAddress={stakingPool.operatorAddress}
                isVerified={stakingPool.metaData.isVerified}
                estimatedStake={nextEpoch.approximateStakeRatio * 100}
                zrxToStaked={zrxToStaked}
                rewardsShared={(1 - nextEpoch.operatorShare) * 100}
                iconUrl={stakingPool.metaData.logoUrl}
                networkId={networkId}
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
                                title: 'APY (last 7 epochs)',
                                number: `${formatPercent(stakingPoolAPY * 100 || 0).minimized}%`,
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
                                title: 'ZRX Staked',
                                number: `${formatZrx(nextEpoch.zrxStaked).minimized}`,
                                headerComponent: () => (
                                    <InfoTooltip id="next-epoch-staked-balance">
                                        <div>
                                            <div>
                                                <TooltipLabel>Current Epoch:</TooltipLabel>{' '}
                                                {
                                                    formatZrx(currentEpoch.zrxStaked, {
                                                        decimals: 2,
                                                        decimalsRounded: 2,
                                                        roundDown: true,
                                                    }).full
                                                }
                                            </div>
                                            <div>
                                                <TooltipLabel>Pending Epoch:</TooltipLabel>{' '}
                                                {
                                                    formatZrx(zrxStakeChangeBetweenEpochs, {
                                                        decimals: 2,
                                                        decimalsRounded: 2,
                                                        roundDown: true,
                                                        positiveSign: zrxStakeChangeBetweenEpochs >= 0,
                                                    }).full
                                                }
                                            </div>
                                        </div>
                                    </InfoTooltip>
                                ),
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
                                    formatEther(stakingPool.allTimeStats.protocolFeesGeneratedInEth, {
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
                            {
                                title: 'Number of trades',
                                number: stakingPool.allTimeStats.numberOfFills,
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
                {historicalEpochs && (
                    <HistoryChart
                        totalRewards={historicalEpochs.map((e) => e.totalRewardsPaidInEth)}
                        memberRewards={historicalEpochs.map((e) => e.membersRewardsPaidInEth)}
                        epochs={historicalEpochs.map((e) => e.epochId)}
                        labels={historicalEpochs.map((e) => format(new Date(e.epochEndTimestamp), 'd MMM'))}
                    />
                )}
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
