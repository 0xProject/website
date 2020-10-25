import { logUtils } from '@0x/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { asyncDispatcher } from 'ts/redux/async_dispatcher';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { ProviderState } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { errorReporter } from 'ts/utils/error_reporter';
import { trackEvent } from 'ts/utils/google_analytics';
import { providerStateFactory } from 'ts/utils/providers/provider_state_factory';

const PROVIDER_CHAIN_CHANGED_EVENT = 'chainChanged';
const PROVIDER_ACCOUNTS_CHANGED_EVENT = 'accountsChanged';
const PROVIDER_NETWORK_CHANGED_EVENT = 'networkChanged';

export const useWallet = () => {
    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);

    const accountsChangedRef = useRef<() => void | undefined>(undefined);
    const networkChangedRef = useRef<(networkId: string) => void | undefined>(undefined);

    const currentNetworkId = useSelector((state: State) => state.networkId);
    const currentProviderState = useSelector((state: State) => state.providerState);

    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const handleAccountsChange = useCallback(async () => {
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
                provider.off(PROVIDER_CHAIN_CHANGED_EVENT, networkChangedRef.current);
            }
        }
    }, [currentProviderState.provider]);

    const connectToWallet = useCallback(
        async provider => {
            cleanupCurrentProvider();
            const payload = window.localStorage.getItem('WALLETCONNECTOR');
            let providerState: ProviderState;

            switch (JSON.parse(payload).name) {
                case 'METAMASK':
                    providerState = providerStateFactory.getInitialProviderStateFromWindowIfExists('METAMASK');
                    break;
                case 'WALLET_LINK':
                    providerState = providerStateFactory.getInitialProviderStateFromWalletLink(provider);
                    break;
                case 'WALLET_CONNECT':
                    providerState = providerStateFactory.getInitialProviderStateFromWalletConnect(provider);
                    break;
                default:
                    providerState = providerStateFactory.getInitialProviderState(1);
            }

            dispatcher.updateProviderState(providerState);

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
                for (const networkEvent of [PROVIDER_NETWORK_CHANGED_EVENT, PROVIDER_CHAIN_CHANGED_EVENT]) {
                    newProvider.on(networkEvent, networkChangedRef.current);
                }
            }

            const { TRACKING } = constants.STAKING;

            trackEvent(TRACKING.CONNECT_WALLET, { event_label: providerState.displayName || 'UnknownWallet' });
        },
        [cleanupCurrentProvider, currentNetworkId, dispatcher, handleAccountsChange, handleNetworksChange],
    );

    const logoutWallet = useCallback(() => {
        cleanupCurrentProvider();
        const providerState: ProviderState = providerStateFactory.getInitialProviderState(currentNetworkId);

        dispatcher.updateProviderState(providerState);
        dispatcher.setAccountStateLoading();
        const payload = window.localStorage.getItem('WALLETCONNECTOR');
        if (JSON.parse(payload).name === 'WALLET_CONNECT') {
            window.localStorage.removeItem('walletconnect');
        } else if (JSON.parse(payload).name === 'WALLET_LINK') {
            window.localStorage.removeItem('-walletlink:https://www.walletlink.org:session:linked');
            window.localStorage.removeItem('-walletlink:https://www.walletlink.org:session:id');
            window.localStorage.removeItem('-walletlink:https://www.walletlink.org:session:secret');
            window.localStorage.removeItem('-walletlink:https://www.walletlink.org:Addresses');
        }
        window.localStorage.removeItem('WALLETCONNECTOR');
    }, [cleanupCurrentProvider, currentNetworkId, dispatcher]);

    return {
        connectToWallet: useCallback(
            provider => {
                connectToWallet(provider).catch((err: Error) => {
                    logUtils.warn(`Failed to connect wallet ${err}`);
                    errorReporter.report(err);
                });
            },
            [connectToWallet],
        ),
        logoutWallet,
    };
};
