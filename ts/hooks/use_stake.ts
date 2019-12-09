import { ContractAddresses, getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { StakingContract, StakingProxyContract } from '@0x/contract-wrappers';
import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { TransactionReceiptWithDecodedLogs } from 'ethereum-types';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { State } from 'ts/redux/reducer';
import { AccountReady, StakePoolData, StakeStatus, TransactionLoadingState } from 'ts/types';
import { backendClient } from 'ts/utils/backend_client';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

const normalizeStakePoolData = (stakePoolData: StakePoolData[]) =>
    stakePoolData.map(pool => ({
        poolId: utils.toPaddedHex(pool.poolId),
        amountBaseUnits: Web3Wrapper.toBaseUnitAmount(new BigNumber(pool.zrxAmount, 10), constants.DECIMAL_PLACES_ZRX),
    }));

export const useStake = () => {
    const networkId = useSelector((state: State) => state.networkId);
    const providerState = useSelector((state: State) => state.providerState);

    const [loadingState, setLoadingState] = React.useState<undefined | TransactionLoadingState>(undefined);
    const [error, setError] = React.useState<Error | undefined>(undefined);
    const [result, setResult] = React.useState<TransactionReceiptWithDecodedLogs | undefined>(undefined);
    const [estimatedTimeMs, setEstimatedTimeMs] = React.useState<number | undefined>(undefined);

    const [ownerAddress, setOwnerAddress] = React.useState<string | undefined>(undefined);
    const [stakingContract, setStakingContract] = React.useState<StakingContract | undefined>(undefined);
    const [stakingProxyContract, setStakingProxyContract] = React.useState<StakingProxyContract | undefined>(undefined);
    const [contractAddresses, setContractAddresses] = React.useState<ContractAddresses | undefined>(undefined);

    React.useEffect(() => {
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

    const unstakeFromPoolsAsync = async (stakePoolData: StakePoolData[]) => {
        if (!stakePoolData || stakePoolData.length === 0) {
            return;
        }

        if (
            [TransactionLoadingState.WaitingForTransaction, TransactionLoadingState.WaitingForSignature].includes(
                loadingState,
            )
        ) {
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

    const depositAndStakeAsync = async (stakePoolData: StakePoolData[]) => {
        if (!stakePoolData || stakePoolData.length === 0) {
            return;
        }

        if (
            [TransactionLoadingState.WaitingForTransaction, TransactionLoadingState.WaitingForSignature].includes(
                loadingState,
            )
        ) {
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

    const handleErr = (err: Error) => {
        setLoadingState(TransactionLoadingState.Failed);
        setError(err);
        logUtils.log(err);
    };

    return {
        loadingState,
        result,
        error,
        depositAndStake: (stakePoolData: StakePoolData[]) => {
            depositAndStakeAsync(stakePoolData).catch(handleErr);
        },
        unstake: (stakePoolData: StakePoolData[]) => {
            unstakeFromPoolsAsync(stakePoolData).catch(handleErr);
        },
        estimatedTimeMs,
    };
};
