import { providerUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { SupportedProvider, ZeroExProvider } from 'ethereum-types';
import * as _ from 'lodash';

import { Maybe, Network, Providers, ProviderState } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

import { providerFactory } from 'ts/utils/providers/provider_factory';

// TODO(kimpers): Copied from instant, migrate to a package that can be shared
export const providerStateFactory = {
    getInitialProviderState: (
        fallbackNetworkId: Network,
        supportedProvider?: SupportedProvider,
        walletDisplayName?: string,
    ): ProviderState => {
        if (supportedProvider !== undefined) {
            const provider = providerUtils.standardizeOrThrow(supportedProvider);
            return providerStateFactory.getInitialProviderStateFromProvider(provider, walletDisplayName);
        }
        return providerStateFactory.getInitialProviderStateFallback(fallbackNetworkId, walletDisplayName);
        // We don't currently initially connect to a wallet, we only use public RDC nodes.
        // Connection to a wallet (so far) is a manual process
        //
        // const providerStateFromWindowIfExits = providerStateFactory.getInitialProviderStateFromWindowIfExists(
        //     walletDisplayName,
        // );
        // if (providerStateFromWindowIfExits) {
        //     return providerStateFromWindowIfExits;
        // } else {
        //     return providerStateFactory.getInitialProviderStateFallback(fallbackNetworkId, walletDisplayName);
        // }
    },

    getInitialProviderStateFromProvider: (provider: ZeroExProvider, walletDisplayName?: string): ProviderState => {
        const providerState: ProviderState = {
            name: utils.getProviderName(provider),
            displayName: walletDisplayName || utils.getProviderDisplayName(provider),
            providerType: utils.getProviderType(provider),
            provider,
            web3Wrapper: new Web3Wrapper(provider),
            account: constants.LOADING_ACCOUNT,
        };
        return providerState;
    },

    getInitialProviderStateFromWindowIfExists: (walletDisplayName?: string): Maybe<ProviderState> => {
        const injectedProviderIfExists = providerFactory.getInjectedProviderIfExists();
        if (injectedProviderIfExists !== undefined) {
            const providerState: ProviderState = {
                name: utils.getProviderName(injectedProviderIfExists),
                displayName: walletDisplayName || utils.getProviderDisplayName(injectedProviderIfExists),
                providerType: utils.getProviderType(injectedProviderIfExists),
                provider: injectedProviderIfExists,
                web3Wrapper: new Web3Wrapper(injectedProviderIfExists),
                account: constants.LOADING_ACCOUNT,
            };
            return providerState;
        } else {
            return undefined;
        }
    },

    getInitialProviderStateFromWalletLink: (walletLinkProvider: any): ProviderState => {
        const provider = providerFactory.getWalletLinkProvider(walletLinkProvider);
        const name = constants.PROVIDER_TYPE_TO_NAME[Providers.WalletLink];

        const providerState: ProviderState = {
            name,
            displayName: name,
            providerType: Providers.WalletLink,
            provider,
            web3Wrapper: new Web3Wrapper(provider),
            account: constants.LOADING_ACCOUNT,
        };

        return providerState;
    },

    getInitialProviderStateFromWalletConnect: (walletConnectProvider: any): ProviderState => {
        const provider = providerFactory.getWalletConnectProvider(walletConnectProvider);
        const name = constants.PROVIDER_TYPE_TO_NAME[Providers.WalletConnect];

        const providerState: ProviderState = {
            name,
            displayName: name,
            providerType: Providers.WalletConnect,
            provider,
            web3Wrapper: new Web3Wrapper(provider),
            account: constants.LOADING_ACCOUNT,
        };

        return providerState;
    },

    getInitialProviderStateFallback: (network: Network, walletDisplayName?: string): ProviderState => {
        const provider = providerFactory.getFallbackNoSigningProvider(network);
        const providerState: ProviderState = {
            name: 'Fallback',
            displayName: walletDisplayName || utils.getProviderDisplayName(provider),
            provider,
            web3Wrapper: new Web3Wrapper(provider),
            account: constants.NO_ACCOUNT,
        };
        return providerState;
    },
};
