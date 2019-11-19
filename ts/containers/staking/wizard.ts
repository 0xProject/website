import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses';
import { ContractWrappers, ERC20TokenContract } from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { StakingWizard as StakingWizardPage } from 'ts/pages/staking/wizard/wizard';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';

import { AccountReady, Action, ProviderState } from 'ts/types';
import { backendClient } from 'ts/utils/backend_client';
import { constants } from 'ts/utils/constants';

const DECIMALS_ZRX = new BigNumber(10 ** constants.DECIMAL_PLACES_ZRX);

interface ConnectedWizardProps {}

interface ConnectedState {
    providerState: ProviderState;
    networkId: number;
}

interface ConnectedDispatch {
    onOpenConnectWalletDialog: () => void;
    onStartStaking(networkId: number, providerState: ProviderState, amountToStake: BigNumber): Promise<void>;
}

const mapStateToProps = (state: State, _ownProps: ConnectedWizardProps): ConnectedState => ({
    providerState: state.providerState,
    // TODO: use getState instead
    networkId: state.networkId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ConnectedDispatch => {
    const dispatcher = new Dispatcher(dispatch);

    return {
        onOpenConnectWalletDialog: (): void => {
            dispatcher.updateIsConnectWalletDialogOpen(true);
        },
        onStartStaking: async (
            networkId: number,
            providerState: ProviderState,
            amountToStake: BigNumber,
        ): Promise<void> => {
            const { provider } = providerState;
            const ownerAddress = (providerState.account as AccountReady).address;
            const amountToStakeBaseUnits = amountToStake.multipliedBy(DECIMALS_ZRX);
            const gasInfo = await backendClient.getGasInfoAsync();
            const gasPriceInGwei = new BigNumber(gasInfo.fast / 10);
            const gasPriceInWei = gasPriceInGwei.multipliedBy(1000000000);

            // TODO: put in state
            const contractWrappers = new ContractWrappers(provider, { networkId });
            const contractAddresses = getContractAddressesForNetworkOrThrow(networkId);
            const erc20Token = new ERC20TokenContract(contractAddresses.zrxToken, provider);

            const currentAllowance = await erc20Token.allowance.callAsync(
                ownerAddress,
                contractWrappers.contractAddresses.erc20Proxy,
            );

            // TODO: loading indicator
            if (currentAllowance.isLessThan(amountToStakeBaseUnits)) {
                // tslint:disable:await-promise
                await erc20Token.approve.awaitTransactionSuccessAsync(
                    contractWrappers.contractAddresses.erc20Proxy,
                    amountToStakeBaseUnits,
                    {
                        from: ownerAddress,
                        gasPrice: gasPriceInWei,
                    },
                );
            }
        },
    };
};

export const StakingWizard = connect(mapStateToProps, mapDispatchToProps)(StakingWizardPage);
