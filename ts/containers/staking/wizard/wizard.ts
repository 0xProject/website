import { BigNumber } from '@0x/utils';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { StakingWizard as StakingWizardComponent } from 'ts/pages/staking/wizard/wizard';
import { asyncDispatcher } from 'ts/redux/async_dispatcher';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { AccountReady, Action, Network, ProviderState } from 'ts/types';
import { constants } from 'ts/utils/constants';

interface StakingWizardProps {}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
    onDepositAndStartStakingAsync: (
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
        onDepositAndStartStakingAsync: async (
            providerState: ProviderState,
            networkId: Network,
            amountToStakeInput: string,
            poolId: string,
        ): Promise<void> => {
            const amountToStakeBaseUnits = new BigNumber(amountToStakeInput, 10).multipliedBy(constants.ZRX_BASE_UNIT);

            const account = providerState.account as AccountReady;
            const currentAllowance = account.zrxAllowanceBaseUnitAmount || new BigNumber(0);

            if (amountToStakeBaseUnits.isGreaterThan(currentAllowance)) {
                await asyncDispatcher.increaseZrxAllowanceAndDispatchToStoreIfNeededAsync(
                    providerState,
                    networkId,
                    amountToStakeBaseUnits,
                    dispatcher,
                );
            }

            await asyncDispatcher.depositStakeToContractAndStakeWithPoolAsync(
                providerState,
                networkId,
                amountToStakeBaseUnits,
                poolId,
            );
        },
    };
};

export const StakingWizard = connect(mapStateToProps, mapDispatchToProps)(StakingWizardComponent);
