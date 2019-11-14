import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { StakingWizard as StakingWizardPage } from 'ts/pages/staking/wizard/wizard';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';

import { ProviderState } from 'ts/types';

interface ConnectedWizardProps {}

interface ConnectedState {
    providerState: ProviderState;
}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
}

const mapStateToProps = (state: State, _ownProps: ConnectedWizardProps): ConnectedState => ({
    providerState: state.providerState,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
    };
};

export const StakingWizard: React.ComponentClass<ConnectedWizardProps> = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StakingWizardPage);
