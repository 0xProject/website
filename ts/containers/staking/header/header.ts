import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'ts/redux/reducer';

import { Header as HeaderComponent } from 'ts/components/staking/header/header';
import { Dispatcher } from 'ts/redux/dispatcher';

interface HeaderProps {
    location?: Location;
    isNavToggled?: boolean;
    toggleMobileNav?: () => void;
}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
}

interface ConnectedState {}

// TODO(kimpers): Get connected wallet from state after connecting with blockchain
const mapStateToProps = (_: State, _ownProps: HeaderProps): ConnectedState => ({});

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
    };
};

export const Header: React.ComponentClass<HeaderProps> = connect(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderComponent);
