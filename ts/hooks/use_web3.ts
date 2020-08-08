import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

import { injected } from 'ts/utils/connectors';

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
