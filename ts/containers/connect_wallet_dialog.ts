import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'ts/redux/reducer';

import { ConnectWalletDialog as ConnectWalletDialogComponent } from 'ts/components/dialogs/connect_wallet_dialog';
import { Dispatcher } from 'ts/redux/dispatcher';
import { Providers } from 'ts/types';

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
        onConnectWallet: (provider: Providers): void => {
            dispatcher.connectWallet(provider);
        },
    };
};

export const ConnectWalletDialog: React.ComponentClass<ConnectWalletDialogProps> = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectWalletDialogComponent);
