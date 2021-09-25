import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { logUtils } from '@0x/utils';
import { addMilliseconds } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { AccountReady, ProviderState, TransactionLoadingState } from 'ts/types';
import { backendClient } from 'ts/utils/backend_client';
import { constants } from 'ts/utils/constants';
import { errorReporter } from 'ts/utils/error_reporter';

export interface UseAllowanceHookResult {
    loadingState?: TransactionLoadingState;
    error?: Error;
    setAllowance: () => void;
    estimatedTimeMs?: number;
    estimatedTransactionFinishTime?: Date;
}

export const useAllowance = (): UseAllowanceHookResult => {
    const networkId: number = useSelector((state: State) => state.networkId);
    const providerState: ProviderState = useSelector((state: State) => state.providerState);
    const dispatch = useDispatch();
    const dispatcher = new Dispatcher(dispatch);

    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [loadingState, setLoadingState] = useState<undefined | TransactionLoadingState>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [estimatedTimeMs, setEstimatedTimeMs] = useState<number | undefined>(undefined);
    const [estimatedTransactionFinishTime, setEstimatedTransactionFinishTime] = useState<Date | undefined>(undefined);

    const setAllowanceIfNeeded = async () => {
        if (isStarted) {
            return;
        }

        setIsStarted(true);
        const ownerAddress = (providerState.account as AccountReady).address;

        const localStorageSpeed = localStorage.getItem('gas-speed');
        const gasInfo = await backendClient.getGasInfoAsync('instant');

        const contractAddresses = getContractAddressesForChainOrThrow(networkId);
        const erc20ProxyAddress = contractAddresses.erc20Proxy;
        const zrxTokenContract = new ERC20TokenContract(contractAddresses.zrxToken, providerState.provider);

        const currentAllowance = await zrxTokenContract.allowance(ownerAddress, erc20ProxyAddress).callAsync();

        if (currentAllowance.isLessThan(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS)) {
            setEstimatedTimeMs(gasInfo.estimatedTimeMs);
            setLoadingState(TransactionLoadingState.WaitingForSignature);
            const txPromise = zrxTokenContract
                .approve(erc20ProxyAddress, constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
                .awaitTransactionSuccessAsync({
                    from: ownerAddress,
                    gasPrice: gasInfo.gasPriceInWei,
                });

            await txPromise.txHashPromise;
            setLoadingState(TransactionLoadingState.WaitingForTransaction);
            // tslint:disable:await-promise
            await txPromise;
            dispatcher.updateAccountZrxAllowance(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS);
        }

        setLoadingState(TransactionLoadingState.Success);
        setIsStarted(false);
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
        error,
        setAllowance: () => {
            setAllowanceIfNeeded().catch((err: Error) => {
                setLoadingState(TransactionLoadingState.Failed);
                setError(err);
                logUtils.warn(err);
                setIsStarted(false);
                errorReporter.report(err);
            });
        },
        estimatedTimeMs,
        estimatedTransactionFinishTime,
    };
};
