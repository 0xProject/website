import { BigNumber, logUtils } from '@0x/utils';
import { format } from 'date-fns';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, RouteChildrenProps, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Loading } from 'ts/components/portal/loading';
import { DashboardHero } from 'ts/components/staking/dashboard_hero';
import { HistoryChart } from 'ts/components/staking/history_chart';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { StakingCalculator } from 'ts/components/staking/staking_calculator';
import { InfoTooltip } from 'ts/components/ui/info_tooltip';

import { useAPIClient } from 'ts/hooks/use_api_client';

import { colors } from 'ts/style/colors';

import { State } from 'ts/redux/reducer';
import { EpochPoolStats, PoolEpochRewards, PoolWithHistoricalStats, WebsitePaths } from 'ts/types';
import { analytics } from 'ts/utils/analytics';
import { errorReporter } from 'ts/utils/error_reporter';
import { formatEther, formatPercent, formatZrx } from 'ts/utils/format_number';
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

const LoadingContainer = styled.div`
    padding: 100px 0;
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

const StakingCalculatorCTA = styled.div`
    padding: 2rem;
    border: 1px solid ${colors.textDarkSecondary};
    text-align: center;
    margin-bottom: 60px;
`;

const StakingCalculatorLink = styled.a`
    color: ${colors.brandLight};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

export const StakingPool: React.FC<StakingPoolProps & RouteChildrenProps> = (props) => {
    const { poolId } = useParams();

    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);
    const [stakingPool, setStakingPool] = useState<PoolWithHistoricalStats | undefined>(undefined);
    const [epochRewards, setEpochRewards] = useState<PoolEpochRewards[] | undefined>(undefined);
    const [stakingPoolAPY3Epochs, setStakingPoolAPY3Epochs] = useState<number | undefined>(undefined);
    const [stakingPoolAPY12Epochs, setStakingPoolAPY12Epochs] = useState<number | undefined>(undefined);

    const [hasStakingCalculator, setShowStakingCalculator] = useState(false);

    useEffect(() => {
        const calcShortTermAndLongTermAPY = (rewards: PoolEpochRewards[]) => {
            const average = (arr: number[]) => arr.reduce((sum, el) => sum + el, 0) / arr.length;

            const epochRewardAPYs = rewards.map((reward) => {
                return reward.apy;
            });
            const rewardsToAverageShortTerm =
                epochRewardAPYs.length > 3 ? epochRewardAPYs.slice(Math.max(rewards.length - 3, 0)) : epochRewardAPYs;

            const rewardsToAverageLongTerm =
                epochRewardAPYs.length > 12 ? epochRewardAPYs.slice(Math.max(rewards.length - 12, 0)) : epochRewardAPYs;

            setStakingPoolAPY3Epochs(average(rewardsToAverageShortTerm));
            setStakingPoolAPY12Epochs(average(rewardsToAverageLongTerm));
        };
        apiClient
            .getStakingPoolByIdAsync(poolId)
            .then((res) => {
                setStakingPool(res.stakingPool);
            })
            .catch((err: Error) => {
                logUtils.warn(err);
                errorReporter.report(err);
            });
        apiClient
            .getStakingPoolRewardsAsync(poolId)
            .then((resRewards) => {
                setEpochRewards(resRewards.stakingPoolRewards.epochRewards);
                calcShortTermAndLongTermAPY(resRewards.stakingPoolRewards.epochRewards);
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

    let currentEpoch: EpochPoolStats = null;
    let nextEpoch = null;
    let historicalEpochs = null;
    let zrxStakeChangeBetweenEpochs: number = null;
    let zrxToStaked = null;

    if (stakingPool) {
        currentEpoch = stakingPool.currentEpochStats;
        nextEpoch = stakingPool.nextEpochStats;

        // Reminder: stake change can be negative
        zrxStakeChangeBetweenEpochs = new BigNumber(nextEpoch.zrxStaked || 0)
            .minus(new BigNumber(currentEpoch.zrxStaked || 0))
            .toNumber();

        // Only allow epochs that have finished into historical data
        historicalEpochs = epochRewards
            ? epochRewards
                  .filter((x) => !!x.epochEndTimestamp)
                  .sort((a, b) => {
                      return a.epochId - b.epochId;
                  })
            : null;

        const fullyStakedZrx = nextEpoch.zrxStaked / (nextEpoch.approximateStakeRatio || 1);
        zrxToStaked = Math.max(fullyStakedZrx - nextEpoch.zrxStaked, 0);
    }

    return (
        <StakingPageLayout isHome={true} title="Staking pool">
            {stakingPool && hasStakingCalculator && (
                <StakingCalculator
                    defaultPoolId={stakingPool.poolId}
                    onClose={() => {
                        setShowStakingCalculator(false);
                    }}
                />
            )}
            {stakingPool && (
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
                                    title: 'APR (last 3 epochs)',
                                    number: `${formatPercent(stakingPoolAPY3Epochs * 100 || 0).minimized}%`,
                                },
                                {
                                    title: 'Fees Generated',
                                    // 4 decimals looks better here to keep it from wrapping
                                    number: `${
                                        formatEther(currentEpoch.totalProtocolFeesGeneratedInEth, {
                                            decimals: 2,
                                            decimalsRounded: 2,
                                        }).minimized
                                    } ETH`,
                                },
                                {
                                    title: 'ZRX Staked',
                                    number: `${formatZrx(nextEpoch.zrxStaked, { bigUnitPostfix: true }).formatted}`,
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
                                    title: 'APR (last 12 epochs)',
                                    number: `${formatPercent(stakingPoolAPY12Epochs * 100 || 0).minimized}%`,
                                },
                                {
                                    title: 'Fees Generated',
                                    number: `${
                                        formatEther(stakingPool.allTimeStats.protocolFeesGeneratedInEth, {
                                            decimalsRounded: 2,
                                            decimals: 2,
                                        }).formatted
                                    } ETH`,
                                },
                                {
                                    title: 'ZRX Staked',
                                    number: `${formatZrx(nextEpoch.zrxStaked, { bigUnitPostfix: true }).formatted}`,
                                },
                                {
                                    title: 'Rewards Shared',
                                    number: `${
                                        formatEther(stakingPool.allTimeStats.membersRewardsPaidInEth, {
                                            decimals: 2,
                                            decimalsRounded: 2,
                                        }).formatted
                                    } ETH`,
                                },
                            ],
                        },
                    ]}
                />
            )}
            {!stakingPool && (
                <LoadingContainer>
                    <Loading isLoading={true} content={null} />
                </LoadingContainer>
            )}
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
            {historicalEpochs && (
                <Container>
                    <StakingCalculatorCTA>
                        Calculate your potential rewards with the{' '}
                        <StakingCalculatorLink
                            onClick={() => {
                                analytics.track('Activate Staking Calculator');
                                setShowStakingCalculator(true);
                            }}
                        >
                            Staking Calculator
                        </StakingCalculatorLink>
                    </StakingCalculatorCTA>
                    <GraphHeading>Historical Details</GraphHeading>
                    <HistoryChart
                        totalRewards={historicalEpochs.map((e) => e.totalRewardsPaidInEth)}
                        memberRewards={historicalEpochs.map((e) => e.membersRewardsPaidInEth)}
                        epochs={historicalEpochs.map((e) => e.epochId)}
                        labels={historicalEpochs.map((e) => format(new Date(e.epochEndTimestamp), 'd MMM'))}
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
            )}
        </StakingPageLayout>
    );
};
