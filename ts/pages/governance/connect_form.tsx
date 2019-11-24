import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
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
import '@reach/dialog/styles.css';
import { ZeroExProvider } from 'ethereum-types';
import * as _ from 'lodash';
import * as React from 'react';
import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';
import { InjectedProvider, Providers } from 'ts/types';
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

export interface WalletConnectedProps {
    providerName: string;
    selectedAddress: string;
    currentBalance: BigNumber;
    contractWrappers?: ContractWrappers;
    injectedProviderIfExists?: InjectedProvider;
    providerEngine?: ZeroExProvider;
    web3Wrapper?: Web3Wrapper;
}

interface Props {
    onDismiss?: () => void;
    onWalletConnected?: (props: WalletConnectedProps) => void;
    onVoted?: () => void;
    onError?: (errorMessage: string) => void;
    web3Wrapper?: Web3Wrapper;
    currentBalance: BigNumber;
}

interface State {
    providerName?: string;
    connectionErrMsg: string;
    isWalletConnected: boolean;
    isSubmitting: boolean;
    isSuccessful: boolean;
    preferredNetworkId: number;
    errors: ErrorProps;
    userAddresses: string[];
    addressBalances: BigNumber[];
    derivationErrMsg: string;
}

interface ErrorProps {
    [key: string]: string;
}

const ZERO = new BigNumber(0);

export class ConnectForm extends React.Component<Props, State> {
    public static defaultProps = {
        currentBalance: ZERO,
        isWalletConnected: false,
        errors: {},
    };
    // blockchain related
    public networkId: number;
    private _providerName: string;
    private _contractWrappers: ContractWrappers;
    private _injectedProviderIfExists?: InjectedProvider;
    private _web3Wrapper?: Web3Wrapper;
    private _providerEngine?: ZeroExProvider;
    public constructor(props: Props) {
        super(props);
        this.state = {
            connectionErrMsg: '',
            isWalletConnected: false,
            isSubmitting: false,
            isSuccessful: false,
            providerName: null,
            preferredNetworkId: constants.NETWORK_ID_MAINNET,
            errors: {},
            userAddresses: [],
            addressBalances: [],
            derivationErrMsg: '',
        };
    }
    public render(): React.ReactNode {
        const { errors } = this.state;
        return (
            <div style={{ textAlign: 'center' }}>
                <Icon name="wallet" size={120} margin={[0, 0, 'default', 0]} />
                {this._renderContent(errors)}
            </div>
        );
    }
    public _renderContent(errors: ErrorProps): React.ReactNode {
        return this._renderButtonsContent(errors);
    }
    public _renderButtonsContent(errors: ErrorProps): React.ReactNode {
        return (
            <div style={{ maxWidth: '470px', margin: '0 auto' }}>
                <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                    Connect Your Wallet
                </Heading>
                <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                    In order to vote on this issue you will need to connect a wallet with a balance of ZRX tokens.
                </Paragraph>
                <Button onClick={this._onConnectWalletClickAsync.bind(this)}>Connect Wallet</Button>

                {errors.connectionError !== undefined && (
                    <Paragraph isMuted={true} color={colors.red}>
                        {errors.connectionError}
                    </Paragraph>
                )}
            </div>
        );
    }
    public async getUserAccountsAsync(): Promise<string[]> {
        utils.assert(this._contractWrappers !== undefined, 'ContractWrappers must be instantiated.');
        const provider = this._contractWrappers.getProvider();
        const web3Wrapper = new Web3Wrapper(provider);
        const userAccountsIfExists = await web3Wrapper.getAvailableAddressesAsync();
        return userAccountsIfExists;
    }
    public async getZrxBalanceAsync(owner: string): Promise<BigNumber> {
        utils.assert(this._contractWrappers !== undefined, 'ContractWrappers must be instantiated.');
        const contractAddresses = getContractAddressesForChainOrThrow(this.networkId);
        const tokenAddress: string = contractAddresses.zrxToken;
        const erc20Token = new ERC20TokenContract(tokenAddress, this._contractWrappers.getProvider());
        try {
            const amount = await erc20Token.balanceOf(owner).callAsync();
            return amount;
        } catch (error) {
            return ZERO;
        }
    }
    private async _onConnectWalletClickAsync(): Promise<boolean> {
        const networkIdIfExists = await this._getInjectedProviderNetworkIdIfExistsAsync();
        this.networkId = networkIdIfExists !== undefined ? networkIdIfExists : constants.NETWORK_ID_MAINNET;

        await this._resetOrInitializeAsync(this.networkId);

        const didSucceed = await this._fetchAddressesAndBalancesAsync();
        if (didSucceed) {
            this.setState(
                {
                    errors: {},
                    preferredNetworkId: this.networkId,
                },
                async () => {
                    // Always assume selected index is 0 for Metamask
                    await this._updateSelectedAddressAsync(0);
                },
            );
        }

        return didSucceed;
    }
    private async _fetchAddressesAndBalancesAsync(): Promise<boolean> {
        let userAddresses: string[];
        const addressBalances: BigNumber[] = [];
        try {
            userAddresses = await this._getUserAddressesAsync();
            for (const address of userAddresses) {
                const balanceInZrx = await this.getZrxBalanceAsync(address);
                addressBalances.push(balanceInZrx);
            }
        } catch (err) {
            const errorMessage = 'Failed to connect. Follow the instructions and try again.';
            this.props.onError
                ? this.props.onError(errorMessage)
                : this.setState({
                      errors: {
                          connectionError: errorMessage,
                      },
                  });
            return false;
        }

        this.setState({
            userAddresses,
            addressBalances,
        });
        return true;
    }
    private async _updateSelectedAddressAsync(index: number): Promise<void> {
        const { userAddresses, addressBalances } = this.state;
        const injectedProviderIfExists = await this._getInjectedProviderIfExistsAsync();
        if (this.props.onWalletConnected && userAddresses[index] !== undefined) {
            const walletInfo: WalletConnectedProps = {
                contractWrappers: this._contractWrappers,
                injectedProviderIfExists,
                selectedAddress: userAddresses[index],
                currentBalance: addressBalances[index],
                providerEngine: this._providerEngine,
                providerName: this._providerName,
                web3Wrapper: this._web3Wrapper,
            };
            this.props.onWalletConnected(walletInfo);
        }
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
            chainId: networkId,
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
