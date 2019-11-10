import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';

import { Dispatcher } from 'ts/redux/dispatcher';
import { AccountState, ProviderState } from 'ts/types';

// NOTE: Copied from Instant
export const asyncDispatcher = {
    fetchAccountInfoAndDispatchToStore: async (
        providerState: ProviderState,
        dispatcher: Dispatcher,
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

            await asyncDispatcher.fetchAccountBalanceAndDispatchToStore(
                activeAddress,
                providerState.web3Wrapper,
                dispatcher,
            );
        } else {
            dispatcher.setAccountStateLocked();
        }
    },

    fetchAccountBalanceAndDispatchToStore: async (
        address: string,
        web3Wrapper: Web3Wrapper,
        dispatcher: Dispatcher,
    ) => {
        try {
            const ethBalanceInWei = await web3Wrapper.getBalanceInWeiAsync(address);
            dispatcher.updateAccountEthBalance({ address, ethBalanceInWei });
        } catch (e) {
            // leave balance as is
            return;
        }
    },
};
