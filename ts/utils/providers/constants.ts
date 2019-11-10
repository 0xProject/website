import { AccountNotReady, AccountState } from 'ts/types';
import { ProviderType } from 'ts/utils/providers/types';

export const PROVIDER_TYPE_TO_NAME: { [key in ProviderType]: string } = {
    [ProviderType.Cipher]: 'Cipher',
    [ProviderType.MetaMask]: 'MetaMask',
    [ProviderType.Mist]: 'Mist',
    [ProviderType.CoinbaseWallet]: 'Coinbase Wallet',
    [ProviderType.Parity]: 'Parity',
    [ProviderType.TrustWallet]: 'Trust Wallet',
    [ProviderType.Opera]: 'Opera Wallet',
    [ProviderType.Fallback]: 'Fallback',
};

export const NO_ACCOUNT: AccountNotReady = {
    state: AccountState.None,
};
export const LOADING_ACCOUNT: AccountNotReady = {
    state: AccountState.Loading,
};
export const LOCKED_ACCOUNT: AccountNotReady = {
    state: AccountState.Locked,
};

export const PROVIDER_TYPE_TO_ICON: { [key: string]: string | undefined } = {
    [ProviderType.MetaMask]: 'metamask_icon',
};
