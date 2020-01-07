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

const PROVIDER_EVENTS = [PROVIDER_CHAIN_CHANGE_EVENT, PROVIDER_ACCOUNTS_CHANGED_EVENT, PROVIDER_NETWORK_CHANGED_EVENT];

export const useWallet = (currentNetworkId: Network, currentProviderState: ProviderState) => {
    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);

    const eventListnerFnRef = useRef<() => void | undefined>(undefined);

    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const handleProviderChanges = useCallback(
        async (providerState: ProviderState) => {
            console.log('provider change');
            const networkId = await providerState.web3Wrapper.getNetworkIdAsync();
            if (networkId !== currentNetworkId) {
                console.log('network changed');
                dispatcher.updateNetworkId(networkId);
            }

            await asyncDispatcher.fetchAccountInfoAndDispatchToStoreAsync(providerState, dispatcher, networkId, true);
        },
        [currentNetworkId, dispatcher],
    );

    const cleanupCurrentProvider = useCallback(() => {
        const provider = currentProviderState.provider as any;

        if (provider.off && eventListnerFnRef.current) {
            for (const eventName of PROVIDER_EVENTS) {
                provider.off(eventName, eventListnerFnRef.current);
            }
            console.log('cleanup');
        }
    }, [currentProviderState.provider]);

    const connectToWallet = async () => {
        cleanupCurrentProvider();
        const providerState = providerStateFactory.getInitialProviderState(currentNetworkId);

        await handleProviderChanges(providerState);

        const newProvider = providerState.provider as any;
        if (newProvider.on) {
            eventListnerFnRef.current = () => {
                handleProviderChanges(providerState).catch((err: Error) => {
                    logUtils.warn(`Failed to update account details: ${err}`);
                });
            };
            for (const eventName of PROVIDER_EVENTS) {
                newProvider.on(eventName, eventListnerFnRef.current);
            }
        }

        analytics.track(constants.STAKING.TRACKING.CONNECT_WALLET, {
            provider: providerState.displayName || 'UnknownWallet',
        });
    };

    return {
        connectToWallet: () => {
            connectToWallet().catch((err: Error) => {
                logUtils.warn(`Failed to connect wallet ${err}`);
            });
        },
    };
};
