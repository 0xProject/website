import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper, ZeroExProvider } from '@0x/web3-wrapper';
import * as _ from 'lodash';

import { Dispatcher } from 'ts/redux/dispatcher';
import { AccountState, Network, ProviderState } from 'ts/types';

const ZERO = new BigNumber(0);

// NOTE: Copied from Instant
export const asyncDispatcher = {
    fetchAccountInfoAndDispatchToStore: async (
        providerState: ProviderState,
        networkId: Network,
        dispatcher: Dispatcher,
        shouldAttemptUnlock: boolean = false,
        shouldSetToLoading: boolean = false,
    ) => {
        const { web3Wrapper, provider } = providerState;
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
                web3Wrapper,
                provider,
                networkId,
                dispatcher,
            );
        } else {
            dispatcher.setAccountStateLocked();
        }
    },

    fetchAccountBalanceAndDispatchToStore: async (
        address: string,
        web3Wrapper: Web3Wrapper,
        provider: ZeroExProvider,
        networkId: Network,
        dispatcher: Dispatcher,
    ) => {
        try {
            const [ethBalanceInWei, zrxBalance] = await Promise.all([
                web3Wrapper.getBalanceInWeiAsync(address),
                asyncDispatcher._fetchZrxBalance(address, provider, networkId),
            ]);

            dispatcher.updateAccountBalances({ address, ethBalanceInWei, zrxBalance });
        } catch (err) {
            // leave balance as is
            return;
        }
    },

    _fetchZrxBalance: async (address: string, provider: ZeroExProvider, networkId: number) => {
        const contractAddresses = getContractAddressesForNetworkOrThrow(networkId);
        const tokenAddress: string = contractAddresses.zrxToken;
        const erc20Token = new ERC20TokenContract(tokenAddress, provider);
        try {
            const amount = await erc20Token.balanceOf.callAsync(address);
            return amount;
        } catch (err) {
            return ZERO;
        }
    },
};
