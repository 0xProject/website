import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'ts/redux/reducer';

import { ConnectWalletDialog as ConnectWalletDialogComponent } from 'ts/components/dialogs/connect_wallet_dialog';
import { Dispatcher } from 'ts/redux/dispatcher';
import { Providers } from 'ts/types';

import { asyncDispatcher } from 'ts/redux/async_dispatcher';
import { providerStateFactory } from 'ts/utils/providers/provider_state_factory';

interface ConnectWalletDialogProps {}

// TODO(kimpers): add blockchain integration
interface ConnectedState {
    isOpen: boolean;
    isWalletConnected: boolean;
}

interface ConnectedDispatch {
    onDismiss: () => void;
    onConnectWallet: (provider: Providers) => void;
}

const mapStateToProps = (state: State, _ownProps: ConnectWalletDialogProps): ConnectedState => ({
    isOpen: state.isConnectWalletDialogOpen,
    isWalletConnected: !!state.walletDetails,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onDismiss: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(false);
        },
        onConnectWallet: async (_: Providers): Promise<void> => {
            // TODO: get real network and clean up Providers
            dispatcher.updateIsConnectWalletDialogOpen(false);
            const network = 1;
            const providerState = providerStateFactory.getInitialProviderState(network);
            await asyncDispatcher.fetchAccountInfoAndDispatchToStore(providerState, dispatcher);
        },
    };
};

export const ConnectWalletDialog: React.ComponentClass<ConnectWalletDialogProps> = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectWalletDialogComponent);
