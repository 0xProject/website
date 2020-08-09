import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { BigNumber } from '@0x/utils';
import { StakingWizard as StakingWizardComponent } from 'ts/pages/staking/wizard/wizard';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { Action } from 'ts/types';

interface StakingWizardProps {}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
}

interface ConnectedState {
    zrxBalanceBaseUnitAmount: BigNumber | undefined;
    zrxAllowanceBaseUnitAmount: BigNumber | undefined;
}

const mapStateToProps = (state: State, _ownProps: StakingWizardProps): ConnectedState => ({
    zrxBalanceBaseUnitAmount: state.zrxBalanceBaseUnitAmount,
    zrxAllowanceBaseUnitAmount: state.zrxAllowanceBaseUnitAmount,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
    };
};

export const StakingWizard = connect(mapStateToProps, mapDispatchToProps)(StakingWizardComponent);
