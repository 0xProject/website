import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from 'ts/utils/connectors';

export function useEdgerConnect() {
    const { activate, active } = useWeb3React();

    const [tried, setTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized: boolean) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, []);

    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
}

export function useInactiveListener(suppress: boolean = false) {
    const { active, error, activate } = useWeb3React();

    useEffect((): any => {
        const { ethereum } = window as any;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                console.log("Handling 'connect' event");
                activate(injected);
            };
            const handleChainChanged = (chainId: string | number) => {
                console.log("Handling 'chainChanged' event with payload", chainId);
                activate(injected);
            };
            const handleAccountsChanged = (accounts: string[]) => {
                console.log("Handling 'accountsChanged' event with payload", accounts);
                if (accounts.length > 0) {
                    activate(injected);
                }
            };
            const handleNetworkChanged = (networkId: string | number) => {
                console.log("Handling 'networkChanged' event with payload", networkId);
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
