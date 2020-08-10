import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';

import { Dispatcher } from 'ts/redux/dispatcher';
import { Network } from 'ts/types';
import { errorReporter } from 'ts/utils/error_reporter';

// NOTE: Copied from Instant
export const asyncDispatcher = {
    fetchAccountInfoAndDispatchToStoreAsync: async (
        dispatcher: Dispatcher,
        networkId: Network,
        shouldAttemptUnlock: boolean = false,
        shouldSetToLoading: boolean = false,
        connector: any,
    ) => {
        const provider = await connector.getProvider();
        const web3Wrapper = new Web3Wrapper(provider);
        if (shouldSetToLoading) {
            dispatcher.setAccountStateLoading();
        }
        let availableAddresses: string[];
        try {
            // TODO(bmillman): Add support at the web3Wrapper level for calling `eth_requestAccounts` instead of calling enable here
            const isPrivacyModeEnabled = provider.enable !== undefined;
            availableAddresses =
                isPrivacyModeEnabled && shouldAttemptUnlock
                    ? await provider.enable()
                    : await web3Wrapper.getAvailableAddressesAsync();
        } catch (e) {
            dispatcher.setAccountStateLocked();
            return;
        }
        if (!_.isEmpty(availableAddresses)) {
            const activeAddress = availableAddresses[0];
            dispatcher.setAccountStateReady(activeAddress);

            await asyncDispatcher.fetchAccountBalanceAndDispatchToStoreAsync(
                activeAddress,
                web3Wrapper,
                dispatcher,
                networkId,
            );
        } else {
            dispatcher.setAccountStateLocked();
        }
    },

    // Isaac: no longer using this as dispatch. instead I'm returning it to waiver once its retrieved
    fetchAccountBalanceAndDispatchToStoreAsync: async (
        address: string,
        connector: any,
        dispatcher: Dispatcher,
        chainId: number,
    ) => {
        try {
            const provider = await connector.getProvider();
            const web3Wrapper = new Web3Wrapper(provider);
            const contractAddresses = getContractAddressesForChainOrThrow(chainId);
            const zrxTokenContract = new ERC20TokenContract(contractAddresses.zrxToken, provider);
            const [ethBalanceInWei, zrxBalance, zrxAllowance] = await Promise.all([
                web3Wrapper.getBalanceInWeiAsync(address),
                zrxTokenContract.balanceOf(address).callAsync(),
                zrxTokenContract.allowance(address, contractAddresses.erc20Proxy).callAsync(),
            ]);

            dispatcher.updateAccountEthBalance(ethBalanceInWei);
            dispatcher.updateAccountZrxBalance(zrxBalance);
            dispatcher.updateAccountZrxAllowance(zrxAllowance);
        } catch (err) {
            logUtils.warn(err);
            errorReporter.report(err);
            return;
        }
    },
};
