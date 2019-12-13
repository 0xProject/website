import { ChainId, ContractAddresses, getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { StakingContract, StakingProxyContract } from '@0x/contract-wrappers';
import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { addMilliseconds } from 'date-fns';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import * as _ from 'lodash';
import { useEffect, useState } from 'react';

import { AccountReady, ProviderState, StakePoolData, StakeStatus, TransactionLoadingState } from 'ts/types';
import { backendClient } from 'ts/utils/backend_client';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

const isTxInProgress = (loadingState: TransactionLoadingState) =>
    [TransactionLoadingState.WaitingForTransaction, TransactionLoadingState.WaitingForSignature].includes(loadingState);

const toZrxBaseUnits = (zrxAmount: number) =>
    Web3Wrapper.toBaseUnitAmount(new BigNumber(zrxAmount, 10), constants.DECIMAL_PLACES_ZRX);

const normalizeStakePoolData = (stakePoolData: StakePoolData[]) =>
    stakePoolData.map(pool => ({
        poolId: utils.toPaddedHex(pool.poolId),
        amountBaseUnits: toZrxBaseUnits(pool.zrxAmount),
    }));

export interface UseStakeHookResult {
    depositAndStake: (stakingPools: StakePoolData[]) => void;
    unstake: (stakePoolData: StakePoolData[]) => void;
    withdrawStake: (zrxAmount: number) => void;
    withdrawRewards: (poolIds: string[]) => void;
    stakingContract?: StakingContract;
    loadingState?: TransactionLoadingState;
    error?: Error;
    result?: TransactionReceiptWithDecodedLogs;
    estimatedTimeMs?: number;
    estimatedTransactionFinishTime?: Date;
}

export const useStake = (networkId: ChainId, providerState: ProviderState): UseStakeHookResult => {
    const [loadingState, setLoadingState] = useState<undefined | TransactionLoadingState>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [result, setResult] = useState<TransactionReceiptWithDecodedLogs | undefined>(undefined);
    const [estimatedTimeMs, setEstimatedTimeMs] = useState<number | undefined>(undefined);
    const [estimatedTransactionFinishTime, setEstimatedTransactionFinishTime] = useState<Date | undefined>(undefined);

    const [ownerAddress, setOwnerAddress] = useState<string | undefined>(undefined);
    const [stakingContract, setStakingContract] = useState<StakingContract | undefined>(undefined);
    const [stakingProxyContract, setStakingProxyContract] = useState<StakingProxyContract | undefined>(undefined);
    const [contractAddresses, setContractAddresses] = useState<ContractAddresses | undefined>(undefined);

    useEffect(() => {
        const _ownerAddress = (providerState.account as AccountReady).address;
        const _contractAddresses = getContractAddressesForChainOrThrow(networkId);

        setContractAddresses(_contractAddresses);
        setOwnerAddress(_ownerAddress);
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
    }, [providerState, contractAddresses, networkId]);

    const executeWithData = async (data: string[]) => {
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
    };

    const depositAndStakeAsync = async (stakePoolData: StakePoolData[]) => {
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
            ...normalizedPoolData.map(({ poolId, amountBaseUnits }) =>
                stakingContract
                    .moveStake(
                        { status: StakeStatus.Undelegated, poolId: constants.STAKING.NIL_POOL_ID }, // From undelegated
                        { status: StakeStatus.Delegated, poolId }, // To the pool
                        amountBaseUnits,
                    )
                    .getABIEncodedTransactionData(),
            ),
        ];

        await executeWithData(data);
    };

    const unstakeFromPoolsAsync = async (stakePoolData: StakePoolData[]) => {
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
    };

    const withdrawStakeAsync = async (zrxAmount: number) => {
        if (!zrxAmount || isTxInProgress(loadingState)) {
            return;
        }

        setLoadingState(TransactionLoadingState.WaitingForSignature);

        const gasInfo = await backendClient.getGasInfoAsync();

        const zrxAmountBaseUnits = toZrxBaseUnits(zrxAmount);
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
    };

    const withdrawRewardsAsync = async (poolIds: string[]) => {
        if (!poolIds.length || isTxInProgress(loadingState)) {
            return;
        }

        const data: string[] = _.flatMap(poolIds, poolId => [
            stakingContract.finalizePool(poolId).getABIEncodedTransactionData(),
            stakingContract.withdrawDelegatorRewards(poolId).getABIEncodedTransactionData(),
        ]);

        await executeWithData(data);
    };

    const handleError = (err: Error) => {
        setLoadingState(TransactionLoadingState.Failed);
        setError(err);
        logUtils.log(err);
    };

    useEffect(() => {
        if (!estimatedTimeMs) {
            return setEstimatedTransactionFinishTime(undefined);
        }
        const estimate = addMilliseconds(new Date(), estimatedTimeMs);
        setEstimatedTransactionFinishTime(estimate);
    }, [estimatedTimeMs]);

    return {
        loadingState,
        result,
        error,
        estimatedTimeMs,
        stakingContract,
        depositAndStake: (stakePoolData: StakePoolData[]) => {
            depositAndStakeAsync(stakePoolData).catch(handleError);
        },
        unstake: (stakePoolData: StakePoolData[]) => {
            unstakeFromPoolsAsync(stakePoolData).catch(handleError);
        },
        withdrawStake: (zrxAmount: number) => {
            withdrawStakeAsync(zrxAmount).catch(handleError);
        },
        withdrawRewards: (poolIds: string[]) => {
            withdrawRewardsAsync(poolIds).catch(handleError);
        },
        estimatedTransactionFinishTime,
    };
};
