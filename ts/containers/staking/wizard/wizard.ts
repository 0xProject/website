import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { StakingWizard as StakingWizardComponent } from 'ts/pages/staking/wizard/wizard';
import { asyncDispatcher } from 'ts/redux/async_dispatcher';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { Action, Network, ProviderState } from 'ts/types';

interface StakingWizardProps {}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
    onSetZrxAllowanceIfNeededAsync: (
        providerState: ProviderState,
        networkId: Network,
        amountToStakeInput: string,
        poolId: string,
    ) => Promise<void>;
}

interface ConnectedState {
    providerState: ProviderState;
    networkId: Network;
}

const mapStateToProps = (state: State, _ownProps: StakingWizardProps): ConnectedState => ({
    providerState: state.providerState,
    networkId: state.networkId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
        onSetZrxAllowanceIfNeededAsync: async (providerState: ProviderState, networkId: Network): Promise<void> => {
            await asyncDispatcher.setZrxAllowanceAndDispatchToStoreIfNeededAsync(providerState, networkId, dispatcher);
        },
    };
};

export const StakingWizard = connect(mapStateToProps, mapDispatchToProps)(StakingWizardComponent);
