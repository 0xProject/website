import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

const POLLING_INTERVAL = 12000;
const RPC_URLS: { [chainId: number]: string } = {
    1: (process.env.RPC_URL_1),
    4: (process.env.RPC_URL_4),
};

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });

export const walletconnect = new WalletConnectConnector({
    rpc: { 1: RPC_URLS[1] },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

export const walletlink = new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: '0x',
});
