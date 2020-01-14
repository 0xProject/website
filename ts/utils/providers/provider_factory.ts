import { EmptyWalletSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { providerUtils } from '@0x/utils';
import { ZeroExProvider } from 'ethereum-types';

import { Maybe, Network } from 'ts/types';
import { configs } from 'ts/utils/configs';

const { PUBLIC_NODE_URLS_BY_NETWORK_ID } = configs;

// TODO(kimpers): Copied from instant, migrate to a package that can be shared
export const providerFactory = {
    getInjectedProviderIfExists: (): Maybe<ZeroExProvider> => {
        const injectedProviderIfExists = (window as any).ethereum;
        if (injectedProviderIfExists !== undefined) {
            return injectedProviderIfExists;
            // const provider = providerUtils.standardizeOrThrow(injectedProviderIfExists);
            // return provider;
        }
        const injectedWeb3IfExists = (window as any).web3;
        if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
            const currentProvider = injectedWeb3IfExists.currentProvider;
            const provider = providerUtils.standardizeOrThrow(currentProvider);
            return provider;
        }
        return undefined;
    },

    getFallbackNoSigningProvider: (network: Network): Web3ProviderEngine => {
        const providerEngine = new Web3ProviderEngine();
        // Intercept calls to `eth_accounts` and always return empty
        providerEngine.addProvider(new EmptyWalletSubprovider());
        // Construct an RPC subprovider, all data based requests will be sent via the RPCSubprovider
        // TODO(bmillman): make this more resilient to infura failures
        const rpcUrl = PUBLIC_NODE_URLS_BY_NETWORK_ID[network][0];
        providerEngine.addProvider(new RPCSubprovider(rpcUrl));
        // Start the Provider Engine
        providerUtils.startProviderEngine(providerEngine);
        return providerEngine;
    },
};
