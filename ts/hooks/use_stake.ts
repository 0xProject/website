import { ChainId, ContractAddresses, getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { StakingContract, StakingProxyContract, WETH9Contract } from '@0x/contract-wrappers';
import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { addMilliseconds } from 'date-fns';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import * as _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { AccountReady, ProviderState, StakePoolData, StakeStatus, TransactionLoadingState } from 'ts/types';
import { backendClient } from 'ts/utils/backend_client';
import { constants } from 'ts/utils/constants';
import { errorReporter } from 'ts/utils/error_reporter';
import { trackEvent } from 'ts/utils/google_analytics';
import { utils } from 'ts/utils/utils';

const { TRACKING } = constants.STAKING;

const isTxInProgress = (loadingState: TransactionLoadingState) =>
    [TransactionLoadingState.WaitingForTransaction, TransactionLoadingState.WaitingForSignature].includes(loadingState);

const toZrxBaseUnits = (zrxAmount: number) =>
    Web3Wrapper.toBaseUnitAmount(new BigNumber(zrxAmount, 10), constants.DECIMAL_PLACES_ZRX);

const normalizeStakePoolData = (stakePoolData: StakePoolData[]) =>
    stakePoolData.map(pool => ({
        poolId: utils.toPaddedHex(pool.poolId),
        amountBaseUnits: toZrxBaseUnits(pool.zrxAmount),
    }));

const toAggregatedStats = (stats: BigNumber[]) => {
    const [rewardsAvailable, numPoolsToFinalize, totalFeesCollected, totalWeightedStake, totalRewardsFinalized] = stats;

    return {
        rewardsAvailable,
        numPoolsToFinalize,
        totalFeesCollected,
        totalWeightedStake,
        totalRewardsFinalized,
    };
};

export interface UseStakeHookResult {
    depositAndStake: (stakingPools: StakePoolData[], callback?: () => void) => void;
    unstake: (stakePoolData: StakePoolData[], callback?: () => void) => void;
    withdrawStake: (zrxAmountBaseUnits: BigNumber, callback?: () => void) => void;
    withdrawRewards: (poolIds: string[], callback?: () => void) => void;
    stakingContract?: StakingContract;
    loadingState?: TransactionLoadingState;
    error?: Error;
    result?: TransactionReceiptWithDecodedLogs;
    estimatedTimeMs?: number;
    estimatedTransactionFinishTime?: Date;
    currentEpochRewards?: BigNumber;
}

export const useStake = (networkId: ChainId, providerState: ProviderState): UseStakeHookResult => {
    const [loadingState, setLoadingState] = useState<undefined | TransactionLoadingState>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [result, setResult] = useState<TransactionReceiptWithDecodedLogs | undefined>(undefined);
    const [estimatedTimeMs, setEstimatedTimeMs] = useState<number | undefined>(undefined);
    const [estimatedTransactionFinishTime, setEstimatedTransactionFinishTime] = useState<Date | undefined>(undefined);
    const [currentEpochRewards, setCurrentEpochRewards] = useState<BigNumber | undefined>(undefined);

    const [ownerAddress, setOwnerAddress] = useState<string | undefined>(undefined);
    const [stakingContract, setStakingContract] = useState<StakingContract>(undefined);
    const [stakingProxyContract, setStakingProxyContract] = useState<StakingProxyContract | undefined>(undefined);
    const [contractAddresses, setContractAddresses] = useState<ContractAddresses | undefined>(undefined);

    useEffect(() => {
        const _ownerAddress = (providerState.account as AccountReady).address;
        const _contractAddresses = getContractAddressesForChainOrThrow(networkId);

        setOwnerAddress(_ownerAddress);
        // NOTE: staking proxy has state and is a delegate proxy to staking contract, it can be used to initialize both contracts
        setStakingContract(
            new StakingContract(_contractAddresses.stakingProxy, providerState.provider, {
                from: _ownerAddress,
            }),
        );
        setStakingProxyContract(
            new StakingProxyContract(_contractAddresses.stakingProxy, providerState.provider, {
                from: _ownerAddress,
            }),
        );
        setContractAddresses(_contractAddresses);
    }, [providerState, networkId]);

    const executeWithData = useCallback(
        async (data: string[]) => {
            setLoadingState(TransactionLoadingState.WaitingForSignature);

            const gasInfo = await backendClient.getGasInfoAsync();

            const txPromise = stakingProxyContract
                .batchExecute(data)
                .awaitTransactionSuccessAsync({ from: ownerAddress, gasPrice: gasInfo.gasPriceInWei });

            await txPromise.txHashPromise;
            setEstimatedTimeMs(gasInfo.estimatedTimeMs);
            setLoadingState(TransactionLoadingState.WaitingForTransaction);
            // tslint:disable:await-promise
            const txResult = await txPromise;
            setResult(txResult);
            setLoadingState(TransactionLoadingState.Success);
        },
        [ownerAddress, stakingProxyContract],
    );

    const depositAndStakeAsync = useCallback(
        async (stakePoolData: StakePoolData[]) => {
            if (!stakePoolData || stakePoolData.length === 0 || isTxInProgress(loadingState)) {
                return;
            }

            const normalizedPoolData = normalizeStakePoolData(stakePoolData);

            const totalStakeBaseUnits = normalizedPoolData.reduce(
                (memo: BigNumber, { amountBaseUnits }: { amountBaseUnits: BigNumber }) => {
                    return memo.plus(amountBaseUnits);
                },
                new BigNumber(0, 10),
            );

            const data: string[] = [
                stakingContract.stake(totalStakeBaseUnits).getABIEncodedTransactionData(),
                ..._.flatMap(normalizedPoolData, ({ poolId, amountBaseUnits }) => [
                    // TODO(kimpers): only call finalizePool if poolStatsByEpoch returns feesCollected > 0
                    // https://github.com/0xProject/0x-monorepo/blob/51ca3109eb29e1b03199e98587403fc61f8f2716/contracts/staking/contracts/src/sys/MixinFinalizer.sol#L93-L107
                    stakingContract.finalizePool(poolId).getABIEncodedTransactionData(),
                    stakingContract
                        .moveStake(
                            { status: StakeStatus.Undelegated, poolId: constants.STAKING.NIL_POOL_ID }, // From undelegated
                            { status: StakeStatus.Delegated, poolId }, // To the pool
                            amountBaseUnits,
                        )
                        .getABIEncodedTransactionData(),
                ]),
            ];

            await executeWithData(data);
        },
        [executeWithData, loadingState, stakingContract],
    );

    const unstakeFromPoolsAsync = useCallback(
        async (stakePoolData: StakePoolData[]) => {
            if (!stakePoolData || stakePoolData.length === 0 || isTxInProgress(loadingState)) {
                return;
            }

            const normalizedPoolData = normalizeStakePoolData(stakePoolData);

            const data: string[] = normalizedPoolData.map(({ poolId, amountBaseUnits }) =>
                stakingContract
                    .moveStake(
                        { status: StakeStatus.Delegated, poolId }, // From the pool
                        { status: StakeStatus.Undelegated, poolId: constants.STAKING.NIL_POOL_ID }, // To undelegated
                        amountBaseUnits,
                    )
                    .getABIEncodedTransactionData(),
            );

            await executeWithData(data);
        },
        [executeWithData, loadingState, stakingContract],
    );

    const withdrawStakeAsync = useCallback(
        async (zrxAmountBaseUnits: BigNumber) => {
            if (zrxAmountBaseUnits.isLessThanOrEqualTo(0) || isTxInProgress(loadingState)) {
                return;
            }

            setLoadingState(TransactionLoadingState.WaitingForSignature);

            const gasInfo = await backendClient.getGasInfoAsync();

            const txPromise = stakingContract
                .unstake(zrxAmountBaseUnits)
                .awaitTransactionSuccessAsync({ from: ownerAddress, gasPrice: gasInfo.gasPriceInWei });

            await txPromise.txHashPromise;
            setEstimatedTimeMs(gasInfo.estimatedTimeMs);
            setLoadingState(TransactionLoadingState.WaitingForTransaction);
            // tslint:disable:await-promise
            const txResult = await txPromise;
            setResult(txResult);
            setLoadingState(TransactionLoadingState.Success);
        },
        [loadingState, ownerAddress, stakingContract],
    );

    const withdrawRewardsAsync = useCallback(
        async (poolIds: string[]) => {
            if (!poolIds.length || isTxInProgress(loadingState)) {
                return;
            }

            const data: string[] = _.flatMap(poolIds, poolId => [
                stakingContract.finalizePool(poolId).getABIEncodedTransactionData(),
                stakingContract.withdrawDelegatorRewards(poolId).getABIEncodedTransactionData(),
            ]);

            await executeWithData(data);
        },
        [executeWithData, loadingState, stakingContract],
    );

    const handleError = useCallback((err: Error) => {
        setLoadingState(TransactionLoadingState.Failed);
        setError(err);
        logUtils.log(err);
        errorReporter.report(err);
    }, []);

    useEffect(() => {
        if (!estimatedTimeMs) {
            return setEstimatedTransactionFinishTime(undefined);
        }
        const estimate = addMilliseconds(new Date(), estimatedTimeMs);
        setEstimatedTransactionFinishTime(estimate);
    }, [estimatedTimeMs]);

    useEffect(() => {
        if (currentEpochRewards || !contractAddresses || !providerState || !stakingContract) {
            return;
        }
        const getCurrentEpochRewards = async () => {
            const { web3Wrapper } = providerState;

            const stakingProxyAddress = contractAddresses.stakingProxy;
            const wethContractAddress = await stakingContract.getWethContract().callAsync();
            const wethContract = new WETH9Contract(wethContractAddress, providerState.provider);

            const [ethBalanceInWei, wethBalanceInWei, currentEpoch, wethReservedForPoolRewards] = await Promise.all([
                web3Wrapper.getBalanceInWeiAsync(stakingProxyAddress),
                wethContract.balanceOf(stakingProxyAddress).callAsync(),
                stakingContract.currentEpoch().callAsync(),
                stakingContract.wethReservedForPoolRewards().callAsync(),
            ]);

            const prevEpoch = currentEpoch.minus(1);
            const { rewardsAvailable, totalRewardsFinalized } = await stakingProxyContract
                .aggregatedStatsByEpoch(prevEpoch)
                .callAsync()
                .then(toAggregatedStats);

            const totalBalanceInWei = ethBalanceInWei.plus(wethBalanceInWei);
            const prevEpochRollover = rewardsAvailable.minus(totalRewardsFinalized).plus(wethReservedForPoolRewards);
            const _currentEpochRewards = Web3Wrapper.toUnitAmount(
                totalBalanceInWei.minus(prevEpochRollover),
                constants.DECIMAL_PLACES_ETH,
            );

            setCurrentEpochRewards(_currentEpochRewards);
        };

        getCurrentEpochRewards().catch((err: Error) => {
            setCurrentEpochRewards(undefined);
            logUtils.warn(err);
            errorReporter.report(err);
        });
    }, [contractAddresses, currentEpochRewards, providerState, stakingContract, stakingProxyContract]);

    return {
        loadingState,
        result,
        error,
        estimatedTimeMs,
        currentEpochRewards,
        stakingContract,
        depositAndStake: (stakePoolData: StakePoolData[], callback?: () => void) => {
            depositAndStakeAsync(stakePoolData)
                .then(() => {
                    trackEvent(TRACKING.STAKE, { success: true });
                })
                .then(callback)
                .catch((err: Error) => {
                    trackEvent(TRACKING.STAKE, { success: false });
                    handleError(err);
                });
        },
        unstake: (stakePoolData: StakePoolData[], callback?: () => void) => {
            unstakeFromPoolsAsync(stakePoolData)
                .then(() => {
                    trackEvent(TRACKING.UNSTAKE, { success: true });
                })
                .then(callback)
                .catch((err: Error) => {
                    trackEvent(TRACKING.UNSTAKE, { success: false });
                    handleError(err);
                });
        },
        withdrawStake: (zrxAmountBaseUnits: BigNumber, callback?: () => void) => {
            withdrawStakeAsync(zrxAmountBaseUnits)
                .then(() => {
                    trackEvent(TRACKING.WITHDRAW_STAKE, { success: true });
                })
                .then(callback)
                .catch((err: Error) => {
                    trackEvent(TRACKING.WITHDRAW_STAKE, { success: false });
                    handleError(err);
                });
        },
        withdrawRewards: (poolIds: string[], callback?: () => void) => {
            withdrawRewardsAsync(poolIds)
                .then(() => {
                    trackEvent(TRACKING.WITHDRAW_REWARDS, { success: true });
                })
                .then(callback)
                .catch((err: Error) => {
                    trackEvent(TRACKING.WITHDRAW_REWARDS, { success: false });
                    handleError(err);
                });
        },
        estimatedTransactionFinishTime,
    };
};
