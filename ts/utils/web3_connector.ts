import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses';
import { ContractWrappers, ERC20TokenContract } from '@0x/contract-wrappers';
import {
    LedgerSubprovider,
    MetamaskSubprovider,
    RedundantSubprovider,
    RPCSubprovider,
    SignerSubprovider,
    Web3ProviderEngine,
} from '@0x/subproviders';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ZeroExProvider } from 'ethereum-types';
import * as _ from 'lodash';
import { ConnectedWalletDetails, InjectedProvider, Providers } from 'ts/types';
import { configs } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

const providerToName: { [provider: string]: string } = {
    [Providers.Metamask]: constants.PROVIDER_NAME_METAMASK,
    [Providers.Parity]: constants.PROVIDER_NAME_PARITY_SIGNER,
    [Providers.Mist]: constants.PROVIDER_NAME_MIST,
    [Providers.CoinbaseWallet]: constants.PROVIDER_NAME_COINBASE_WALLET,
    [Providers.Cipher]: constants.PROVIDER_NAME_CIPHER,
};

const ZERO = new BigNumber(0);

export class Web3Connector {
    // blockchain related
    public networkId: number;
    // User connection related
    public userAddresses: string[];
    public addressBalances: BigNumber[];
    private _providerName: string;
    private _contractWrappers: ContractWrappers;
    private _injectedProviderIfExists?: InjectedProvider;
    private _web3Wrapper?: Web3Wrapper;
    // TODO(kimpers): is _providerEngine needed?
    // @ts-ignore
    private _providerEngine?: ZeroExProvider;

    public async getUserAccountsAsync(): Promise<string[]> {
        utils.assert(this._contractWrappers !== undefined, 'ContractWrappers must be instantiated.');
        const provider = this._contractWrappers.getProvider();
        const web3Wrapper = new Web3Wrapper(provider);
        const userAccountsIfExists = await web3Wrapper.getAvailableAddressesAsync();
        return userAccountsIfExists;
    }
    public async getZrxBalanceAsync(owner: string): Promise<BigNumber> {
        utils.assert(this._contractWrappers !== undefined, 'ContractWrappers must be instantiated.');
        const contractAddresses = getContractAddressesForNetworkOrThrow(this.networkId);
        const tokenAddress: string = contractAddresses.zrxToken;
        const erc20Token = new ERC20TokenContract(tokenAddress, this._contractWrappers.getProvider());
        try {
            const amount = await erc20Token.balanceOf.callAsync(owner);
            return amount;
        } catch (error) {
            return ZERO;
        }
    }

    public async connectToWalletAsync(): Promise<ConnectedWalletDetails | undefined> {
        const networkIdIfExists = await this._getInjectedProviderNetworkIdIfExistsAsync();
        this.networkId = networkIdIfExists !== undefined ? networkIdIfExists : constants.NETWORK_ID_MAINNET;

        await this._resetOrInitializeAsync(this.networkId);

        await this._fetchAddressesAndBalancesAsync();

        // Always assume selected index is 0 for Metamask
        const walletInfo = await this._updateSelectedAddressAsync(0);

        return walletInfo;
    }

    private async _fetchAddressesAndBalancesAsync(): Promise<void> {
        const userAddresses = await this._getUserAddressesAsync();
        const addressBalances: BigNumber[] = [];
        for (const address of userAddresses) {
            const balanceInZrx = await this.getZrxBalanceAsync(address);
            addressBalances.push(balanceInZrx);
        }

        this.userAddresses = userAddresses;
        this.addressBalances = addressBalances;
    }
    private async _updateSelectedAddressAsync(index: number): Promise<ConnectedWalletDetails | undefined> {
        const { userAddresses, addressBalances } = this;
        if (!userAddresses[index]) {
            return undefined;
        }

        const walletInfo: ConnectedWalletDetails = {
            selectedAddress: userAddresses[index],
            currentBalance: addressBalances[index],
            providerName: this._providerName,
        };

        return walletInfo;
    }
    private _getNameGivenProvider(provider: ZeroExProvider): string {
        const providerType = utils.getProviderType(provider);
        const providerNameIfExists = providerToName[providerType];
        if (providerNameIfExists === undefined) {
            return constants.PROVIDER_NAME_GENERIC;
        }
        return providerNameIfExists;
    }
    private async _getProviderAsync(
        injectedProviderIfExists?: InjectedProvider,
        networkIdIfExists?: number,
    ): Promise<[ZeroExProvider, LedgerSubprovider | undefined]> {
        // This code is based off of the Blockchain.ts code.
        // TODO refactor to re-use this utility outside of Blockchain.ts
        const doesInjectedProviderExist = injectedProviderIfExists !== undefined;
        const publicNodeUrlsIfExistsForNetworkId = configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[networkIdIfExists];
        const isPublicNodeAvailableForNetworkId = publicNodeUrlsIfExistsForNetworkId !== undefined;
        const provider = new Web3ProviderEngine();
        const rpcSubproviders = _.map(configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[networkIdIfExists], publicNodeUrl => {
            return new RPCSubprovider(publicNodeUrl);
        });

        if (doesInjectedProviderExist && isPublicNodeAvailableForNetworkId) {
            // We catch all requests involving a users account and send it to the injectedWeb3
            // instance. All other requests go to the public hosted node.
            const providerName = this._getNameGivenProvider(injectedProviderIfExists);
            // Wrap Metamask in a compatability wrapper MetamaskSubprovider (to handle inconsistencies)
            const signerSubprovider =
                providerName === constants.PROVIDER_NAME_METAMASK || constants.PROVIDER_NAME_COINBASE_WALLET
                    ? new MetamaskSubprovider(injectedProviderIfExists)
                    : new SignerSubprovider(injectedProviderIfExists);
            provider.addProvider(signerSubprovider);
            provider.addProvider(new RedundantSubprovider(rpcSubproviders));
            provider.start();
            return [provider, undefined];
        } else if (doesInjectedProviderExist) {
            // Since no public node for this network, all requests go to injectedWeb3 instance
            return [injectedProviderIfExists, undefined];
        } else {
            // If no injectedWeb3 instance, all requests fallback to our public hosted mainnet/testnet node
            // We do this so that users can still browse the 0x Portal DApp even if they do not have web3
            // injected into their browser.
            const networkId = constants.NETWORK_ID_MAINNET;
            const defaultRpcSubproviders = _.map(configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[networkId], publicNodeUrl => {
                return new RPCSubprovider(publicNodeUrl);
            });
            provider.addProvider(new RedundantSubprovider(defaultRpcSubproviders));
            provider.start();
            return [provider, undefined];
        }
    }
    private async _getInjectedProviderIfExistsAsync(): Promise<InjectedProvider | undefined> {
        if (this._injectedProviderIfExists !== undefined) {
            return this._injectedProviderIfExists;
        }
        let injectedProviderIfExists = (window as any).ethereum;
        if (injectedProviderIfExists !== undefined) {
            if (injectedProviderIfExists.enable !== undefined) {
                await injectedProviderIfExists.enable();
            }
        } else {
            const injectedWeb3IfExists = (window as any).web3;
            if (injectedWeb3IfExists !== undefined && injectedWeb3IfExists.currentProvider !== undefined) {
                injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
            } else {
                return undefined;
            }
        }
        this._injectedProviderIfExists = injectedProviderIfExists;
        return injectedProviderIfExists;
    }
    private async _getInjectedProviderNetworkIdIfExistsAsync(): Promise<number | undefined> {
        // If the user has an injectedWeb3 instance that is disconnected from a backing
        // Ethereum node, this call will throw. We need to handle this case gracefully
        const injectedProviderIfExists = await this._getInjectedProviderIfExistsAsync();
        let networkIdIfExists: number;
        if (injectedProviderIfExists !== undefined) {
            try {
                const injectedWeb3Wrapper = new Web3Wrapper(injectedProviderIfExists);
                networkIdIfExists = await injectedWeb3Wrapper.getNetworkIdAsync();
            } catch (err) {
                // Ignore error and proceed with networkId undefined
            }
        }
        return networkIdIfExists;
    }
    private async _resetOrInitializeAsync(networkId: number): Promise<void> {
        this.userAddresses = [];
        this.addressBalances = [];
        this.networkId = networkId;
        const injectedProviderIfExists = await this._getInjectedProviderIfExistsAsync();
        const [provider] = await this._getProviderAsync(injectedProviderIfExists, networkId);
        this._web3Wrapper = new Web3Wrapper(provider);
        this._providerEngine = provider;
        this.networkId = await this._web3Wrapper.getNetworkIdAsync();
        this._providerName = this._getNameGivenProvider(provider);
        if (this._contractWrappers !== undefined) {
            this._contractWrappers.unsubscribeAll();
        }
        const contractWrappersConfig = {
            networkId,
        };
        this._contractWrappers = new ContractWrappers(provider, contractWrappersConfig);
    }
    private async _getUserAddressesAsync(): Promise<string[]> {
        let userAddresses: string[];
        userAddresses = await this.getUserAccountsAsync();

        if (_.isEmpty(userAddresses)) {
            throw new Error('No addresses retrieved.');
        }
        return userAddresses;
    }
}

// tslint:disable:max-file-line-count
