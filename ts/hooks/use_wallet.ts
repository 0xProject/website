import { logUtils } from '@0x/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Dispatcher } from 'ts/redux/dispatcher';
import { Network, ProviderState } from 'ts/types';

import { asyncDispatcher } from 'ts/redux/async_dispatcher';
import { analytics } from 'ts/utils/analytics';
import { constants } from 'ts/utils/constants';
import { providerStateFactory } from 'ts/utils/providers/provider_state_factory';

const PROVIDER_CHAIN_CHANGE_EVENT = 'chainChanged';
const PROVIDER_ACCOUNTS_CHANGED_EVENT = 'accountsChanged';
const PROVIDER_NETWORK_CHANGED_EVENT = 'networkChanged';

export const useWallet = (currentNetworkId: Network, currentProviderState: ProviderState) => {
    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);

    const accountsChangedRef = useRef<() => void | undefined>(undefined);
    const networkChangedRef = useRef<(networkId: string) => void | undefined>(undefined);

    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const handleAccountsChange = useCallback(async () => {
        console.log('account change');
        await asyncDispatcher.fetchAccountInfoAndDispatchToStoreAsync(
            currentProviderState,
            dispatcher,
            currentNetworkId,
            true,
        );
    }, [currentNetworkId, currentProviderState, dispatcher]);

    const handleNetworksChange = useCallback(
        (newNetworkId: string) => {
            const networkId = parseInt(newNetworkId, 10);

            if (networkId) {
                dispatcher.updateNetworkId(networkId);
            }
        },
        [dispatcher],
    );

    const cleanupCurrentProvider = useCallback(() => {
        const provider = currentProviderState.provider as any;

        if (provider.off) {
            if (accountsChangedRef.current) {
                provider.off(PROVIDER_ACCOUNTS_CHANGED_EVENT, accountsChangedRef.current);
            }

            if (networkChangedRef.current) {
                provider.off(PROVIDER_NETWORK_CHANGED_EVENT, networkChangedRef.current);
                provider.off(PROVIDER_CHAIN_CHANGE_EVENT, networkChangedRef.current);
            }
            console.log('cleanup');
        }
    }, [currentProviderState.provider]);

    const connectToWallet = useCallback(async () => {
        cleanupCurrentProvider();
        const providerState = providerStateFactory.getInitialProviderState(currentNetworkId);

        const networkId = await providerState.web3Wrapper.getNetworkIdAsync();
        if (networkId !== currentNetworkId) {
            dispatcher.updateNetworkId(networkId);
        }

        await asyncDispatcher.fetchAccountInfoAndDispatchToStoreAsync(providerState, dispatcher, networkId, true);

        const newProvider = providerState.provider as any;
        if (newProvider.on) {
            accountsChangedRef.current = handleAccountsChange;
            newProvider.on(PROVIDER_ACCOUNTS_CHANGED_EVENT, accountsChangedRef.current);

            networkChangedRef.current = handleNetworksChange;
            for (const networkEvent of [PROVIDER_NETWORK_CHANGED_EVENT, PROVIDER_CHAIN_CHANGE_EVENT]) {
                newProvider.on(networkEvent, networkChangedRef.current);
            }
        }

        analytics.track(constants.STAKING.TRACKING.CONNECT_WALLET, {
            provider: providerState.displayName || 'UnknownWallet',
        });
    }, [cleanupCurrentProvider, currentNetworkId, dispatcher, handleAccountsChange, handleNetworksChange]);

    return {
        connectToWallet: () => {
            connectToWallet().catch((err: Error) => {
                logUtils.warn(`Failed to connect wallet ${err}`);
            });
        },
    };
};
