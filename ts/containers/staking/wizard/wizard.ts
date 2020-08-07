import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { StakingWizard as StakingWizardComponent } from 'ts/pages/staking/wizard/wizard';
import { Dispatcher } from 'ts/redux/dispatcher';
import { Action } from 'ts/types';

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
    };
};

export const StakingWizard = connect(undefined, mapDispatchToProps)(StakingWizardComponent);
