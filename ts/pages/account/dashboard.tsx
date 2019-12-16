import { BigNumber, hexUtils, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { format } from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { CallToAction } from 'ts/components/call_to_action';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading } from 'ts/components/text';
import { InfoTooltip } from 'ts/components/ui/info_tooltip';
import { StatFigure } from 'ts/components/ui/stat_figure';
import { AccountActivitySummary } from 'ts/pages/account/account_activity_summary';
import { AccountApplyModal } from 'ts/pages/account/account_apply_modal';
import { AccountDetail } from 'ts/pages/account/account_detail';
import { AccountFigure } from 'ts/pages/account/account_figure';
import { AccountStakeOverview } from 'ts/pages/account/account_stake_overview';
import { AccountVote } from 'ts/pages/account/account_vote';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import {
    AccountReady,
    Epoch,
    PoolWithHistoricalStats,
    PoolWithStats,
    StakingAPIDelegatorResponse,
    VoteHistory,
    WebsitePaths,
} from 'ts/types';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

import { useAPIClient } from 'ts/hooks/use_api_client';
import { useStake } from 'ts/hooks/use_stake';

export interface AccountProps {}

interface PoolWithUserStake extends PoolWithHistoricalStats {
    userStake: {
        poolId: string;
        currentEpochZrxStaked: number;
        nextEpochZrxStaked: number;
    };
}

interface AvailableZrxBalanceProps {
    account?: AccountReady;
    delegatorData?: StakingAPIDelegatorResponse;
}

const AvailableZrxBalance = ({ account, delegatorData }: AvailableZrxBalanceProps) => {
    let availableBalance: BigNumber = new BigNumber(0);
    if (account && account.zrxBalanceBaseUnitAmount) {
        availableBalance = account.zrxBalanceBaseUnitAmount;
    }

    if (delegatorData) {
        const depositedBalance = new BigNumber(delegatorData.forCurrentEpoch.zrxDeposited).shiftedBy(
            constants.DECIMAL_PLACES_ZRX,
        );
        availableBalance = availableBalance.plus(depositedBalance);
    }

    return <span>{`${utils.getFormattedAmount(availableBalance, constants.DECIMAL_PLACES_ZRX)} ZRX`}</span>;
};

const getFormattedAmount = (amount: number, currency: string) =>
    `${utils.getFormattedUnitAmount(new BigNumber(amount))} ${currency}`;

interface DelegatorDataProps {
    delegatorData?: StakingAPIDelegatorResponse;
}

const StakedZrxBalance = ({ delegatorData }: DelegatorDataProps) => {
    let balance = new BigNumber(0);

    if (delegatorData) {
        balance = new BigNumber(delegatorData.forCurrentEpoch.zrxStaked);
    }

    return <span>{`${utils.getFormattedUnitAmount(balance)} ZRX`}</span>;
};

interface PoolToRewardsMap {
    [key: string]: BigNumber;
}
interface PoolReward {
    poolId: string;
    rewardsInEth: BigNumber;
}

interface PoolWithStatsMap {
    [key: string]: PoolWithStats;
}

export const Account: React.FC<AccountProps> = () => {
    const providerState = useSelector((state: State) => state.providerState);
    const networkId = useSelector((state: State) => state.networkId);
    const account = providerState.account as AccountReady;
    // NOTE: not yet implemented but left in for future reference
    const voteHistory: VoteHistory[] = [];

    const [isApplyModalOpen, toggleApplyModal] = React.useState(false);
    const [isFetchingDelegatorData, setIsFetchingDelegatorData] = React.useState<boolean>(false);
    const [delegatorData, setDelegatorData] = React.useState<StakingAPIDelegatorResponse | undefined>(undefined);
    const [poolWithStatsMap, setPoolWithStatsMap] = React.useState<PoolWithStatsMap | undefined>(undefined);
    const [availableRewardsMap, setAvailableRewardsMap] = React.useState<PoolToRewardsMap | undefined>(undefined);
    const [totalAvailableRewards, setTotalAvailableRewards] = React.useState<BigNumber>(new BigNumber(0));
    const [nextEpochStats, setNextEpochStats] = React.useState<Epoch | undefined>(undefined);
    const [pendingUnstakePools, setPendingUnstakePools] = React.useState<PoolWithUserStake[]>([]);

    const apiClient = useAPIClient(networkId);
    const { stakingContract, unstake } = useStake(networkId, providerState);

    const hasDataLoaded = () => Boolean(delegatorData && poolWithStatsMap && availableRewardsMap);

    React.useEffect(() => {
        const fetchDelegatorData = async () => {
            const [delegatorResponse, poolsResponse, epochsResponse] = await Promise.all([
                apiClient.getDelegatorAsync(account.address),
                apiClient.getStakingPoolsAsync(),
                apiClient.getStakingEpochsAsync(),
            ]);

            const _poolWithStatsMap = poolsResponse.stakingPools.reduce<PoolWithStatsMap>((memo, pool) => {
                memo[pool.poolId] = pool;
                return memo;
            }, {});

            setDelegatorData(delegatorResponse);
            setPoolWithStatsMap(_poolWithStatsMap);
            setNextEpochStats(epochsResponse.nextEpoch);
        };

        if (!account.address || isFetchingDelegatorData) {
            return;
        }

        setIsFetchingDelegatorData(true);
        fetchDelegatorData()
            .then(() => {
                setIsFetchingDelegatorData(false);
            })
            .catch((err: Error) => {
                setDelegatorData(undefined);
                setIsFetchingDelegatorData(false);
                logUtils.warn(err);
            });
    }, [account.address, apiClient.networkId]);

    React.useEffect(() => {
        const fetchAvailableRewards = async () => {
            const poolsWithAllTimeRewards = delegatorData.allTime.poolData.filter(
                poolData => poolData.rewardsInEth > 0,
            );
            const poolRewards: PoolReward[] = await Promise.all(
                poolsWithAllTimeRewards.map(async poolData => {
                    const paddedHexPoolId = hexUtils.leftPad(hexUtils.toHex(poolData.poolId));

                    const availableRewardInEth = await stakingContract
                        .computeRewardBalanceOfDelegator(paddedHexPoolId, account.address)
                        .callAsync();

                    // TODO(kimpers): There is some typing issue here, circle back later to remove the BigNumber conversion
                    return {
                        poolId: poolData.poolId,
                        rewardsInEth: Web3Wrapper.toUnitAmount(
                            new BigNumber(availableRewardInEth.toString()),
                            constants.DECIMAL_PLACES_ETH,
                        ),
                    };
                }),
            );

            const _availableRewardsMap: PoolToRewardsMap = poolRewards.reduce<PoolToRewardsMap>(
                (memo: PoolToRewardsMap, poolReward: PoolReward) => {
                    memo[poolReward.poolId] = poolReward.rewardsInEth;

                    return memo;
                },
                {},
            );

            const _totalAvailableRewards = poolRewards.reduce(
                (memo: BigNumber, poolReward: PoolReward) => memo.plus(poolReward.rewardsInEth),
                new BigNumber(0),
            );

            setAvailableRewardsMap(_availableRewardsMap);
            setTotalAvailableRewards(_totalAvailableRewards);
        };

        const fetchPendingActivityData = async () => {
            // pools being staked with now but not next epoch are pending unstake
            // TODO(kimpers): handle partial unstake
            const poolDataNextEpochMap = delegatorData.forNextEpoch.poolData.reduce<{ [key: string]: number }>(
                (memo, poolData) => {
                    memo[poolData.poolId] = poolData.zrxStaked;
                    return memo;
                },
                {},
            );

            const poolDataStaked = delegatorData.forCurrentEpoch.poolData.map(pool => ({
                poolId: pool.poolId,
                currentEpochZrxStaked: pool.zrxStaked,
                nextEpochZrxStaked: poolDataNextEpochMap[pool.poolId] || 0,
            }));

            // TODO(kimpers): handle pending stake as well
            const poolsWithPendingUnstake = poolDataStaked.filter(
                pool => pool.currentEpochZrxStaked > pool.nextEpochZrxStaked,
            );

            const _pendingUnstakePools = await Promise.all<PoolWithUserStake>(
                poolsWithPendingUnstake.map(async poolData => {
                    const poolResponse = await apiClient.getStakingPoolAsync(poolData.poolId);

                    return {
                        ...poolResponse.stakingPool,
                        userStake: poolData,
                    };
                }),
            );

            setPendingUnstakePools(_pendingUnstakePools);
        };

        if (!stakingContract || !delegatorData || !account.address) {
            return;
        }

        fetchAvailableRewards().catch((err: Error) => {
            setTotalAvailableRewards(new BigNumber(0));
            logUtils.warn(err);
        });

        fetchPendingActivityData().catch((err: Error) => {
            // TODO: unset values
            logUtils.warn(err);
        });
    }, [stakingContract, delegatorData, account.address]);

    return (
        <StakingPageLayout title="0x Staking | Account">
            <HeaderWrapper>
                <Inner>
                    {account && account.address && <AccountDetail userEthAddress={account.address} />}

                    <Figures>
                        <AccountFigure
                            label="Available balance"
                            headerComponent={() => (
                                <InfoTooltip id="available-balance">
                                    This is the amount available for delegation starting in the next Epoch
                                </InfoTooltip>
                            )}
                        >
                            <AvailableZrxBalance account={account} delegatorData={delegatorData} />
                        </AccountFigure>

                        <AccountFigure
                            label="Staked balance"
                            headerComponent={() => (
                                <InfoTooltip id="staked-balance">
                                    This is the amount currently delegated to a pool
                                </InfoTooltip>
                            )}
                        >
                            <StakedZrxBalance delegatorData={delegatorData} />
                        </AccountFigure>

                        <AccountFigure
                            label="Rewards"
                            headerComponent={() => {
                                if (totalAvailableRewards.gt(0)) {
                                    return (
                                        <Button
                                            isWithArrow={true}
                                            isTransparent={true}
                                            fontSize="17px"
                                            color={colors.brandLight}
                                        >
                                            Withdraw
                                        </Button>
                                    );
                                }

                                return null;
                            }}
                        >
                            <span>{`${utils.getFormattedUnitAmount(totalAvailableRewards)} ETH`}</span>
                        </AccountFigure>
                    </Figures>
                </Inner>
            </HeaderWrapper>

            {pendingUnstakePools.length > 0 && (
                <SectionWrapper>
                    <SectionHeader>
                        <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                            Pending
                        </Heading>
                        {/* TODO(kimpers): Add this back when we have implemented the activity page
                                <Button
                                    color={colors.brandDark}
                                    isWithArrow={true}
                                    isTransparent={true}
                                    to={WebsitePaths.AccountActivity}
                                >
                                    Show all activity
                                </Button>
                            */}
                    </SectionHeader>
                    {pendingUnstakePools.map((pool, index) => (
                        <AccountActivitySummary
                            key={`account-acctivity-summary-${index}`}
                            title={`${getFormattedAmount(
                                pool.userStake.currentEpochZrxStaked - pool.userStake.nextEpochZrxStaked,
                                'ZRX',
                            )} will be removed from ${pool.metaData.name || `Pool ${pool.poolId}`}`}
                            subtitle="Your tokens will need to be manually withdrawn once they are removed"
                            avatarSrc={pool.metaData.logoUrl || undefined}
                            icon="clock"
                        >
                            <StatFigure
                                label="Withdraw date"
                                value={format(new Date(nextEpochStats.epochStart.timestamp), 'd/M/yy')}
                            />
                        </AccountActivitySummary>
                    ))}
                </SectionWrapper>
            )}

            {/* TODO add loadin animations or display partially loaded data */}
            {hasDataLoaded() && (
                <SectionWrapper>
                    <SectionHeader>
                        <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                            Your staking pools
                        </Heading>

                        <Button
                            color={colors.brandDark}
                            isWithArrow={true}
                            isTransparent={true}
                            onClick={() => toggleApplyModal(true)}
                        >
                            Apply to create a staking pool
                        </Button>
                    </SectionHeader>

                    {delegatorData.forCurrentEpoch.poolData.length === 0 ? (
                        <CallToAction
                            icon="revenue"
                            title="You haven't staked ZRX"
                            description="Start staking your ZRX and getting interest."
                            actions={[
                                {
                                    label: 'Start staking',
                                    url: WebsitePaths.StakingWizard,
                                    isSameTarget: true,
                                },
                            ]}
                        />
                    ) : (
                        _.map(delegatorData.forCurrentEpoch.poolData, (delegatorPoolStats, index) => {
                            const poolId = delegatorPoolStats.poolId;
                            const pool = poolWithStatsMap[poolId];
                            // TODO: refresh data from api or hide in client?

                            if (!pool) {
                                return null;
                            }

                            const availablePoolRewards =
                                (availableRewardsMap[poolId] && availableRewardsMap[poolId]) || new BigNumber(0);

                            const userData = {
                                rewardsReceivedFormatted: utils.getFormattedUnitAmount(availablePoolRewards),
                                zrxStakedFormatted: utils.getFormattedUnitAmount(
                                    new BigNumber(delegatorPoolStats.zrxStaked),
                                ),
                            };

                            return (
                                <AccountStakeOverview
                                    key={`stake-${pool.poolId}`}
                                    name={pool.metaData.name || pool.operatorAddress}
                                    websiteUrl={pool.metaData.websiteUrl}
                                    logoUrl={pool.metaData.logoUrl}
                                    stakeRatio={pool.nextEpochStats.approximateStakeRatio}
                                    rewardsSharedRatio={1 - pool.nextEpochStats.operatorShare}
                                    feesGenerated={getFormattedAmount(pool.sevenDayProtocolFeesGeneratedInEth, 'ETH')}
                                    userData={userData}
                                    nextEpochApproximateStart={new Date(nextEpochStats.epochStart.timestamp)}
                                    isVerified={pool.metaData.isVerified}
                                    onRemoveStake={() => {
                                        unstake([{ poolId, zrxAmount: delegatorPoolStats.zrxStaked }]);
                                    }}
                                />
                            );
                        })
                    )}
                </SectionWrapper>
            )}

            {voteHistory.length > 0 && (
                <SectionWrapper>
                    <SectionHeader>
                        <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                            Your voting history
                        </Heading>
                    </SectionHeader>

                    <Grid>
                        {_.map(voteHistory, (item, index) => {
                            return (
                                <AccountVote
                                    key={`vote-history-${index}`}
                                    title={item.title}
                                    zeipId={item.zeip}
                                    summary={item.summary}
                                    vote={item.vote}
                                />
                            );
                        })}
                    </Grid>
                </SectionWrapper>
            )}

            <AccountApplyModal isOpen={isApplyModalOpen} onDismiss={() => toggleApplyModal(false)} />
        </StakingPageLayout>
    );
};

const HeaderWrapper = styled.div`
    width: 100%;
    max-width: 1500px;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 60px;

    @media (min-width: 768px) {
        padding: 30px;
        text-align: left;
    }
`;

const Inner = styled.div`
    @media (min-width: 1200px) {
        display: flex;
        justify-content: space-between;
    }

    @media (min-width: 768px) {
        padding: 60px;
        background-color: ${colors.backgroundLightGrey};
    }
`;

const Figures = styled.div`
    @media (max-width: 1200px) {
        padding-top: 24px;
    }

    @media (min-width: 768px) {
        display: flex;
    }
`;

const SectionWrapper = styled.div`
    width: calc(100% - 40px);
    max-width: 1152px;
    margin: 0 auto;

    & + & {
        margin-top: 90px;
    }
`;

const SectionHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    @media (max-width: 768px) {
        h3 {
            font-size: 28px;
        }

        a,
        button {
            display: none;
        }
    }
`;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;
// tslint:disable:max-file-line-count
