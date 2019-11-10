import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'ts/redux/reducer';

import { Header as HeaderComponent } from 'ts/components/staking/header/header';
import { Dispatcher } from 'ts/redux/dispatcher';
import { ProviderState } from 'ts/types';

interface HeaderProps {
    location?: Location;
    isNavToggled?: boolean;
    toggleMobileNav?: () => void;
}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
    onLogoutWallet: () => void;
}

interface ConnectedState {
    providerState: ProviderState;
}

const mapStateToProps = (state: State, _ownProps: HeaderProps): ConnectedState => ({
    providerState: state.providerState,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
        onLogoutWallet: (): void => {
            dispatcher.setAccountStateLoading();
        },
    };
};

export const Header: React.ComponentClass<HeaderProps> = connect(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderComponent);
