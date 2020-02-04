import { BigNumber, hexUtils, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { format } from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { CallToAction } from 'ts/components/call_to_action';
import { ChangePoolDialog } from 'ts/components/staking/change_pool_dialog';
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
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import {
    AccountReady,
    Epoch,
    PoolWithStats,
    StakeStatus,
    StakingAPIDelegatorResponse,
    VoteHistory,
    WebsitePaths,
} from 'ts/types';
import { constants } from 'ts/utils/constants';
import { stakingUtils } from 'ts/utils/staking_utils';
import { utils } from 'ts/utils/utils';

import { useAPIClient } from 'ts/hooks/use_api_client';
import { useStake } from 'ts/hooks/use_stake';
import { errorReporter } from 'ts/utils/error_reporter';
import { formatEther, formatZrx } from 'ts/utils/format_number';

export interface AccountProps {}

interface DelegatorDataProps {
    delegatorData?: StakingAPIDelegatorResponse;
}

const StakedZrxBalance = ({ delegatorData }: DelegatorDataProps) => {
    let balance = new BigNumber(0);

    if (delegatorData) {
        balance = new BigNumber(delegatorData.forCurrentEpoch.zrxStaked);
    }

    return <span>{`${formatZrx(balance).minimized} ZRX`}</span>;
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

interface PoolToDelegatorStakeMap {
    [key: string]: number;
}

enum PendingActionType {
    Stake = 'STAKE',
    Unstake = 'UNSTAKE',
}

interface PendingAction {
    type: PendingActionType;
    poolId: string;
    amount: number;
}

// TODO(johnrjj) - After going to a pool that has been staked in, hitting the 'Remove' button,
// and running the transaction, the balances do not update, even after a good amount of time (30min+ etc)
// Is there a way we can query web3 directly?? (tl;dr 'Pending' removes are flaky/not sure if they are working)
export const Account: React.FC<AccountProps> = () => {
    const providerState = useSelector((state: State) => state.providerState);
    const networkId = useSelector((state: State) => state.networkId);
    const dispatch = useDispatch();

    const onOpenConnectWalletDialog = React.useCallback(() => {
        const dispatcher = new Dispatcher(dispatch);
        dispatcher.updateIsConnectWalletDialogOpen(true);
    }, [dispatch]);

    const account = providerState.account as AccountReady;
    // NOTE: not yet implemented but left in for future reference
    const voteHistory: VoteHistory[] = [];

    const [isApplyModalOpen, toggleApplyModal] = React.useState(false);
    const [changePoolDetails, setChangePoolDetails] = React.useState<{ poolId: string; zrxAmount: number } | undefined>(
        undefined,
    );
    const [isFetchingDelegatorData, setIsFetchingDelegatorData] = React.useState<boolean>(false);
    const [delegatorData, setDelegatorData] = React.useState<StakingAPIDelegatorResponse | undefined>(undefined);
    const [poolWithStatsMap, setPoolWithStatsMap] = React.useState<PoolWithStatsMap | undefined>(undefined);
    const [stakingPools, setStakingPools] = React.useState<PoolWithStats[]>(undefined);
    const [availableRewardsMap, setAvailableRewardsMap] = React.useState<PoolToRewardsMap | undefined>(undefined);
    const [totalAvailableRewards, setTotalAvailableRewards] = React.useState<BigNumber>(new BigNumber(0));
    const [nextEpochStats, setNextEpochStats] = React.useState<Epoch | undefined>(undefined);
    const [undelegatedBalanceBaseUnits, setUndelegatedBalanceBaseUnits] = React.useState<BigNumber>(new BigNumber(0));
    const [currentEpochStakeMap, setCurrentEpochStakeMap] = React.useState<PoolToDelegatorStakeMap>({});
    const [nextEpochStakeMap, setNextEpochStakeMap] = React.useState<PoolToDelegatorStakeMap>({});

    const [pendingActions, setPendingActions] = React.useState<PendingAction[]>([]);
    const [pendingUnstakePoolSet, setPendingUnstakePoolSet] = React.useState<Set<string>>(new Set());

    const apiClient = useAPIClient(networkId);
    const { stakingContract, unstake, withdrawStake, withdrawRewards, moveStake } = useStake(networkId, providerState);

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

            const _currentEpochStakeMap = delegatorResponse.forCurrentEpoch.poolData.reduce<{ [key: string]: number }>(
                (memo, poolData) => {
                    memo[poolData.poolId] = poolData.zrxStaked || 0;
                    return memo;
                },
                {},
            );
            const _nextEpochStakeMap = delegatorResponse.forNextEpoch.poolData.reduce<{ [key: string]: number }>(
                (memo, poolData) => {
                    memo[poolData.poolId] = poolData.zrxStaked || 0;
                    return memo;
                },
                {},
            );

            setDelegatorData(delegatorResponse);
            setStakingPools(poolsResponse.stakingPools);
            setPoolWithStatsMap(_poolWithStatsMap);
            setNextEpochStats(epochsResponse.nextEpoch);
            setCurrentEpochStakeMap(_currentEpochStakeMap);
            setNextEpochStakeMap(_nextEpochStakeMap);
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
                errorReporter.report(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account.address, apiClient]); // add isFetchingDelegatorData to dependency arr to turn on polling

    React.useEffect(() => {
        const fetchAvailableRewards = async () => {
            const poolsWithAllTimeRewards = delegatorData.allTime.poolData.filter(
                poolData => poolData.rewardsInEth > 0,
            );

            const undelegatedBalancesBaseUnits = await stakingContract
                .getOwnerStakeByStatus(account.address, StakeStatus.Undelegated)
                .callAsync();

            const undelegatedInBothEpochsBaseUnits = undelegatedBalancesBaseUnits.currentEpochBalance.gt(
                undelegatedBalancesBaseUnits.nextEpochBalance,
            )
                ? undelegatedBalancesBaseUnits.nextEpochBalance
                : undelegatedBalancesBaseUnits.currentEpochBalance;

            setUndelegatedBalanceBaseUnits(undelegatedInBothEpochsBaseUnits);

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

        if (!delegatorData || !account.address) {
            return;
        }

        fetchAvailableRewards().catch((err: Error) => {
            setTotalAvailableRewards(new BigNumber(0));
            logUtils.warn(err);
            errorReporter.report(err);
        });
    }, [delegatorData, account.address, stakingContract]);

    React.useEffect(() => {
        const poolsWithActivity = _.uniq([...Object.keys(currentEpochStakeMap), ...Object.keys(nextEpochStakeMap)]);
        const _pendingActions: PendingAction[] = poolsWithActivity.reduce((memo, poolId) => {
            const currentEpochStake = currentEpochStakeMap[poolId] || 0;
            const nextEpochStake = nextEpochStakeMap[poolId] || 0;
            const amount = Math.abs(currentEpochStake - nextEpochStake);

            if (currentEpochStake < nextEpochStake) {
                memo.push({
                    type: PendingActionType.Stake,
                    poolId,
                    amount,
                });
            } else if (currentEpochStake > nextEpochStake) {
                memo.push({
                    type: PendingActionType.Unstake,
                    poolId,
                    amount,
                });
            }

            return memo;
        }, []);

        setPendingActions(_pendingActions);
        setPendingUnstakePoolSet(
            new Set(_pendingActions.filter(action => action.type === PendingActionType.Unstake).map(p => p.poolId)),
        );
    }, [currentEpochStakeMap, nextEpochStakeMap, delegatorData]);

    const accountLoaded = account && account.address;

    if (!accountLoaded) {
        return (
            <StakingPageLayout title="0x Staking | Account">
                <SectionWrapper>
                    <Heading />
                    <CallToAction
                        icon="wallet"
                        title="Connect your wallet"
                        description="Connect your wallet to see your account."
                        actions={[
                            {
                                label: 'Connect your wallet',
                                onClick: onOpenConnectWalletDialog,
                            },
                        ]}
                    />
                </SectionWrapper>
            </StakingPageLayout>
        );
    }

    return (
        <StakingPageLayout title="0x Staking | Account">
            <HeaderWrapper>
                <Inner>
                    {account && account.address && <AccountDetail userEthAddress={account.address} />}
                    <Figures>
                        <AccountFigure
                            label="Available"
                            headerComponent={() => (
                                <>
                                    <InfoTooltip id="available-balance">
                                        This is the amount available for withdrawal
                                    </InfoTooltip>
                                    {undelegatedBalanceBaseUnits.gt(0) && (
                                        <Button
                                            isWithArrow={true}
                                            isTransparent={true}
                                            fontSize="17px"
                                            color={colors.brandLight}
                                            onClick={() => {
                                                withdrawStake(undelegatedBalanceBaseUnits, () => {
                                                    // On successful TX optimistically update UI
                                                    // to avoid having to make slow RPC calls to recompute
                                                    setUndelegatedBalanceBaseUnits(new BigNumber(0));
                                                });
                                            }}
                                        >
                                            Withdraw
                                        </Button>
                                    )}
                                </>
                            )}
                        >
                            {formatZrx(undelegatedBalanceBaseUnits, { fromBaseUnits: true }).minimized} ZRX
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
                                            onClick={() => {
                                                const poolsWithRewards = Object.keys(availableRewardsMap).map(poolId =>
                                                    utils.toPaddedHex(poolId),
                                                );

                                                withdrawRewards(poolsWithRewards, () => {
                                                    setAvailableRewardsMap({});
                                                    setTotalAvailableRewards(new BigNumber(0));
                                                });
                                            }}
                                        >
                                            Withdraw
                                        </Button>
                                    );
                                }
                                return null;
                            }}
                        >
                            <span>{`${formatEther(totalAvailableRewards).minimized} ETH`}</span>
                        </AccountFigure>
                    </Figures>
                </Inner>
            </HeaderWrapper>

            {pendingActions.length > 0 && (
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
                    {pendingActions.map(({ poolId, amount, type }, index) => {
                        const pool = poolWithStatsMap[poolId];

                        let title: string;
                        let subtitle: string;
                        let statLabel: string;
                        if (type === PendingActionType.Unstake) {
                            title = `${
                                formatZrx(amount).minimized
                            } ZRX will be removed from ${stakingUtils.getPoolDisplayName(pool)}`;

                            subtitle = 'Your tokens will need to be manually withdrawn once they are removed';
                            statLabel = 'Withdraw date';
                        } else {
                            title = `${
                                formatZrx(amount).minimized
                            } ZRX will be staked with ${stakingUtils.getPoolDisplayName(
                                pool,
                            )} in ${stakingUtils.getTimeToEpochDate(new Date(nextEpochStats.epochStart.timestamp))}`;

                            subtitle = 'Your tokens will be automatically staked when the new epoch starts';
                            statLabel = 'Staking starts';
                        }

                        return (
                            <AccountActivitySummary
                                key={`account-activity-summary-${index}`}
                                title={title}
                                subtitle={subtitle}
                                avatarSrc={pool.metaData.logoUrl}
                                icon="clock"
                                poolId={poolId}
                                address={pool.operatorAddress}
                            >
                                <StatFigure
                                    label={statLabel}
                                    value={format(new Date(nextEpochStats.epochStart.timestamp), 'M/d/yy')}
                                />
                            </AccountActivitySummary>
                        );
                    })}
                </SectionWrapper>
            )}

            {/* TODO add loading animations or display partially loaded data */}
            {hasDataLoaded() && (
                <SectionWrapper>
                    <SectionHeader>
                        <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                            Your staking pools
                        </Heading>

                        {/* <Button
                            color={colors.brandDark}
                            isWithArrow={true}
                            isTransparent={true}
                            onClick={() => toggleApplyModal(true)}
                        >
                            Apply to create a staking pool
                        </Button> */}
                    </SectionHeader>
                    {/* WORKAROUND BECAUSE API WILL RETURN 1 'null' pool if you haven't staked to any pools */}
                    {/* TODO(johnrjj) - Need to fix api response to not return a null pool  */}
                    {delegatorData.forCurrentEpoch.poolData.length === 0 ||
                    (delegatorData.forCurrentEpoch.poolData.length === 1 &&
                        delegatorData.forCurrentEpoch.poolData[0].poolId === null) ? (
                        <CallToAction
                            icon="revenue"
                            title="You haven't staked ZRX"
                            description="Start staking your ZRX and getting interest."
                            actions={[
                                {
                                    label: 'Start staking',
                                    to: WebsitePaths.StakingWizard,
                                },
                            ]}
                        />
                    ) : (
                        delegatorData.forCurrentEpoch.poolData
                            // Don't show pools with pending withdrawals, they are shown in pending section instead
                            .filter(p => !pendingUnstakePoolSet.has(p.poolId) && p.zrxStaked > 0)
                            .map(delegatorPoolStats => {
                                const poolId = delegatorPoolStats.poolId;
                                const pool = poolWithStatsMap[poolId];

                                if (!pool) {
                                    return null;
                                }

                                const availablePoolRewards =
                                    (availableRewardsMap[poolId] && availableRewardsMap[poolId]) || new BigNumber(0);

                                const userData = {
                                    rewardsReceivedFormatted: formatEther(availablePoolRewards).formatted,
                                    zrxStakedFormatted: formatZrx(delegatorPoolStats.zrxStaked).formatted,
                                };

                                return (
                                    <AccountStakeOverview
                                        key={`stake-${pool.poolId}`}
                                        poolId={pool.poolId}
                                        name={stakingUtils.getPoolDisplayName(pool)}
                                        websiteUrl={pool.metaData.websiteUrl}
                                        operatorAddress={pool.operatorAddress}
                                        logoUrl={pool.metaData.logoUrl}
                                        stakeRatio={pool.nextEpochStats.approximateStakeRatio}
                                        rewardsSharedRatio={1 - pool.nextEpochStats.operatorShare}
                                        feesGenerated={
                                            formatEther(pool.sevenDayProtocolFeesGeneratedInEth).full as string
                                        }
                                        userData={userData}
                                        nextEpochApproximateStart={new Date(nextEpochStats.epochStart.timestamp)}
                                        isVerified={pool.metaData.isVerified}
                                        onMoveStake={() => {
                                            const zrxAmount = delegatorPoolStats.zrxStaked;
                                            setChangePoolDetails({ poolId, zrxAmount });
                                        }}
                                        onRemoveStake={() => {
                                            const zrxAmount = delegatorPoolStats.zrxStaked;
                                            unstake([{ poolId, zrxAmount }], () => {
                                                // If TX is successful optimistically update UI before
                                                // API has received the new state
                                                const nextEpochStake = Math.max(
                                                    (nextEpochStakeMap[poolId] || 0) - zrxAmount,
                                                    0,
                                                );
                                                setNextEpochStakeMap(stakeMap => ({
                                                    ...stakeMap,
                                                    [poolId]: nextEpochStake,
                                                }));
                                            });
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
            <ChangePoolDialog
                stakingPools={stakingPools || []}
                moveStake={moveStake}
                currentPoolDetails={changePoolDetails}
                isOpen={!!changePoolDetails}
                onDismiss={() => setChangePoolDetails(undefined)}
            />
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
