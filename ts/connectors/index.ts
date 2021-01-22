import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { configs } from 'ts/utils/configs';

const POLLING_INTERVAL = 10000;

const RPC_URLS: { [chainId: number]: string } = {
    1: configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[1][0],
    42: configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[42][0],
    4: configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[4][0],
    3: configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[3][0],
};

export const network = new NetworkConnector({
    urls: { 1: RPC_URLS[1], 4: RPC_URLS[3] },
    defaultChainId: 1,
});

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
});

const newWalletConnect = () =>
    new WalletConnectConnector({
        rpc: { 1: RPC_URLS[1] },
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
        pollingInterval: POLLING_INTERVAL,
    });

const newWalletLink = () =>
    new WalletLinkConnector({
        url: RPC_URLS[1],
        appName: '0x',
        appLogoUrl: 'https://0x.org/images/0x_logo.png',
    });

export let walletconnect = newWalletConnect();
export let walletlink = newWalletLink();

export const resetWalletConnect = () => {
    walletconnect = newWalletConnect();
};

export const resetWalletLink = () => {
    walletlink = newWalletLink();
};
