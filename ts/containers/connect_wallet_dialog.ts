import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'ts/redux/reducer';

import { ConnectWalletDialog as ConnectWalletDialogComponent } from 'ts/components/dialogs/connect_wallet_dialog';
import { Dispatcher } from 'ts/redux/dispatcher';

interface IConnectWalletDialogProps {}

// TODO(kimpers): add blockchain integration
interface IConnectedState {
    isOpen: boolean;
}

interface IConnectedDispatch {
    dispatcher: Dispatcher;
}

const mapStateToProps = (state: State, _ownProps: IConnectWalletDialogProps): IConnectedState => ({
    isOpen: state.isConnectWalletDialogOpen,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): IConnectedDispatch => ({
    dispatcher: new Dispatcher(dispatch),
});

export const ConnectWalletDialog: React.ComponentClass<IConnectWalletDialogProps> = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectWalletDialogComponent);
