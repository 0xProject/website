import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { RegisterWizard as RegisterWizardComponent } from 'ts/pages/governance/register';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { Action, Network, ProviderState } from 'ts/types';

interface RegisterWizardProps {}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
}

interface ConnectedState {
    providerState: ProviderState;
    networkId: Network;
}

const mapStateToProps = (state: State, _ownProps: RegisterWizardProps): ConnectedState => ({
    providerState: state.providerState,
    networkId: state.networkId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
    };
};

export const RegisterWizard = connect(mapStateToProps, mapDispatchToProps)(RegisterWizardComponent);
