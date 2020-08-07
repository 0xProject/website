import { Middleware } from 'redux';
import { State } from 'ts/redux/reducer';
import { AccountReady, ActionTypes } from 'ts/types';
import { analytics } from 'ts/utils/analytics';

export const analyticsMiddleware: Middleware = (store) => (next) => (action) => {
    const nextAction = next(action);
    const nextState = store.getState() as State;
    switch (action.type) {
        case ActionTypes.UpdateInjectedProviderName:
            analytics.addEventProperties({
                injectedProviderName: action.injectedProviderName,
            });
            break;
        case ActionTypes.UpdateNetworkId:
            analytics.addEventProperties({
                networkId: nextState.networkId,
            });
            break;
        case ActionTypes.UpdateUserAddress:
            analytics.addUserProperties({
                ethAddress: nextState.userAddress,
            });
            break;
        case ActionTypes.SetAccountStateReady:
            const account = action.data;
            analytics.addUserProperties({
                ethAddress: account.address,
            });
            break;
        case ActionTypes.UpdateUserEtherBalance:
            if (nextState.userEtherBalanceInWei) {
                analytics.addUserProperties({
                    ethBalance: nextState.userEtherBalanceInWei.toString(),
                });
            }
            break;
        default:
            break;
    }
    return nextAction;
};
