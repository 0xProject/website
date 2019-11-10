import { providerUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { SupportedProvider, ZeroExProvider } from 'ethereum-types';
import * as _ from 'lodash';

import { Maybe, Network, ProviderState } from 'ts/types';
import { LOADING_ACCOUNT, NO_ACCOUNT } from 'ts/utils/providers/constants';
import { envUtil } from 'ts/utils/providers/env';

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
        const providerStateFromWindowIfExits = providerStateFactory.getInitialProviderStateFromWindowIfExists(
            walletDisplayName,
        );
        if (providerStateFromWindowIfExits) {
            return providerStateFromWindowIfExits;
        } else {
            return providerStateFactory.getInitialProviderStateFallback(fallbackNetworkId, walletDisplayName);
        }
    },

    getInitialProviderStateFromProvider: (provider: ZeroExProvider, walletDisplayName?: string): ProviderState => {
        const providerState: ProviderState = {
            name: envUtil.getProviderName(provider),
            displayName: walletDisplayName || envUtil.getProviderDisplayName(provider),
            provider,
            web3Wrapper: new Web3Wrapper(provider),
            account: LOADING_ACCOUNT,
        };
        return providerState;
    },

    getInitialProviderStateFromWindowIfExists: (walletDisplayName?: string): Maybe<ProviderState> => {
        const injectedProviderIfExists = providerFactory.getInjectedProviderIfExists();
        if (injectedProviderIfExists !== undefined) {
            const providerState: ProviderState = {
                name: envUtil.getProviderName(injectedProviderIfExists),
                displayName: walletDisplayName || envUtil.getProviderDisplayName(injectedProviderIfExists),
                provider: injectedProviderIfExists,
                web3Wrapper: new Web3Wrapper(injectedProviderIfExists),
                account: LOADING_ACCOUNT,
            };
            return providerState;
        } else {
            return undefined;
        }
    },

    getInitialProviderStateFallback: (network: Network, walletDisplayName?: string): ProviderState => {
        const provider = providerFactory.getFallbackNoSigningProvider(network);
        const providerState: ProviderState = {
            name: 'Fallback',
            displayName: walletDisplayName || envUtil.getProviderDisplayName(provider),
            provider,
            web3Wrapper: new Web3Wrapper(provider),
            account: NO_ACCOUNT,
        };
        return providerState;
    },
};
