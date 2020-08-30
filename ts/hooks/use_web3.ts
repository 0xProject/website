import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

import { injected, walletconnect, walletlink } from 'ts/connectors';

interface IUseAccount {
    account?: string;
    setAccount?: any;
}

export function useAccount(): IUseAccount {
    const { account: web3Account, activate } = useWeb3React();
    const [account, setAccount] = useState('');
    useEffect(() => {
        // tslint:disable-next-line:typedef
        async function accountAddress() {
            if (typeof window !== undefined && window.localStorage) {
                const storage = window.localStorage.getItem('WALLET_CONNECTOR');
                if (storage) {
                    const walletConnector = JSON.parse(storage);
                    if (walletConnector && walletConnector.accounts) {
                        setAccount(walletConnector.accounts[0]);
                        if (walletConnector.name === 'injected') {
                            await activate(injected, undefined, true);
                        } else if (walletConnector.name === 'walletconnect') {
                            await activate(walletconnect, undefined, true);
                        } else if (walletConnector.name === 'walletlink') {
                            await activate(walletlink, undefined, true);
                        }
                    }
                }
            }
        }
        // tslint:disable-next-line:no-floating-promises
        accountAddress();
    }, [web3Account, setAccount]);

    return { account: account ? account.toLowerCase() : null, setAccount };
}

export function useEagerConnect(): boolean {
    const { activate, active } = useWeb3React();

    const [isTried, setIsTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized: boolean) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setIsTried(true);
                });
            } else {
                setIsTried(true);
            }
        });
    }, []);

    useEffect(() => {
        if (!isTried && active) {
            setIsTried(true);
        }
    }, [isTried, active]);

    return isTried;
}

export function useInactiveListener(suppress: boolean = false): any {
    const { active, error, activate } = useWeb3React();

    useEffect((): any => {
        const { ethereum } = window as any;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                activate(injected);
            };
            const handleChainChanged = (chainId: string | number) => {
                activate(injected);
            };
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    activate(injected);
                }
            };
            const handleNetworkChanged = (networkId: string | number) => {
                activate(injected);
            };

            ethereum.on('connect', handleConnect);
            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('networkChanged', handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    ethereum.removeListener('networkChanged', handleNetworkChanged);
                }
            };
        }
    }, [active, error, suppress, activate]);
}
