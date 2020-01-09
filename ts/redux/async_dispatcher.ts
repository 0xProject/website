import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';

import { Dispatcher } from 'ts/redux/dispatcher';
import { AccountState, Network, ProviderState } from 'ts/types';
import { errorReporter } from 'ts/utils/error_reporter';

// NOTE: Copied from Instant
export const asyncDispatcher = {
    fetchAccountInfoAndDispatchToStoreAsync: async (
        providerState: ProviderState,
        dispatcher: Dispatcher,
        networkId: Network,
        shouldAttemptUnlock: boolean = false,
        shouldSetToLoading: boolean = false,
    ) => {
        const web3Wrapper = providerState.web3Wrapper;
        const provider = providerState.provider;
        if (shouldSetToLoading && providerState.account.state !== AccountState.Loading) {
            dispatcher.setAccountStateLoading();
        }
        let availableAddresses: string[];
        try {
            // TODO(bmillman): Add support at the web3Wrapper level for calling `eth_requestAccounts` instead of calling enable here
            const isPrivacyModeEnabled = (provider as any).enable !== undefined;
            availableAddresses =
                isPrivacyModeEnabled && shouldAttemptUnlock
                    ? await (provider as any).enable()
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
                providerState.web3Wrapper,
                dispatcher,
                networkId,
            );
        } else {
            dispatcher.setAccountStateLocked();
        }
    },

    fetchAccountBalanceAndDispatchToStoreAsync: async (
        address: string,
        web3Wrapper: Web3Wrapper,
        dispatcher: Dispatcher,
        networkId: Network,
    ) => {
        try {
            const provider = web3Wrapper.getProvider();
            const contractAddresses = getContractAddressesForChainOrThrow(networkId as number);
            const zrxTokenContract = new ERC20TokenContract(contractAddresses.zrxToken, provider);
            const [ethBalanceInWei, zrxBalance, zrxAllowance] = await Promise.all([
                web3Wrapper.getBalanceInWeiAsync(address),
                zrxTokenContract.balanceOf(address).callAsync(),
                zrxTokenContract.allowance(address, contractAddresses.erc20Proxy).callAsync(),
            ]);

            dispatcher.updateAccountEthBalance({ address, ethBalanceInWei });
            dispatcher.updateAccountZrxBalance(zrxBalance);
            dispatcher.updateAccountZrxAllowance(zrxAllowance);
        } catch (err) {
            logUtils.warn(err);
            errorReporter.report(err);
            return;
        }
    },
};
