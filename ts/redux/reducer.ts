import { generatePseudoRandomSalt } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
    Account,
    AccountReady,
    AccountState,
    Action,
    ActionTypes,
    BlockchainErrs,
    Network,
    PortalOrder,
    ProviderState,
    ProviderType,
    ScreenWidths,
    Side,
    SideToAssetToken,
    TokenByAddress,
} from 'ts/types';
import { constants } from 'ts/utils/constants';
import { environments } from 'ts/utils/environments';
import { providerStateFactory } from 'ts/utils/providers/provider_state_factory';
import { Translate } from 'ts/utils/translate';
import { utils } from 'ts/utils/utils';

// Instead of defaulting the docs version to an empty string, we pre-populate it with
// a valid version value. This does not need to be updated however, since onLoad, it
// is always replaced with a value retrieved from our S3 bucket.
const DEFAULT_DOCS_VERSION = '0.0.0';

export interface State {
    // Portal
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    networkId: number;
    orderExpiryTimestamp: BigNumber;
    orderFillAmount: BigNumber;
    orderTakerAddress: string;
    orderSignature: string;
    orderSalt: BigNumber;
    nodeVersion: string;
    screenWidth: ScreenWidths;
    shouldBlockchainErrDialogBeOpen: boolean;
    sideToAssetToken: SideToAssetToken;
    tokenByAddress: TokenByAddress;
    lastForceTokenStateRefetch: number;
    userAddress: string;
    userEtherBalanceInWei?: BigNumber;
    portalOnboardingStep: number;
    isPortalOnboardingShowing: boolean;
    hasPortalOnboardingBeenClosed: boolean;
    // Note: cache of supplied orderJSON in fill order step. Do not use for anything else.
    userSuppliedOrderCache: PortalOrder;

    // Docs
    docsVersion: string;
    availableDocVersions: string[];

    // Staking
    isConnectWalletDialogOpen: boolean;
    providerState: ProviderState;

    // Shared
    flashMessage: string | React.ReactNode;
    providerType: ProviderType;
    injectedProviderName: string;
    translate: Translate;
    // Simulator
    isSimulationDialogOpen: boolean
}

const DEFAULT_NETWORK_ID = environments.isDevelopment() ? Network.Kovan : Network.Mainnet;

export const INITIAL_STATE: State = {
    // Portal
    blockchainErr: BlockchainErrs.NoError,
    blockchainIsLoaded: false,
    networkId: DEFAULT_NETWORK_ID,
    orderExpiryTimestamp: utils.initialOrderExpiryUnixTimestampSec(),
    orderFillAmount: undefined,
    orderSignature: '',
    orderTakerAddress: constants.NULL_ADDRESS,
    orderSalt: generatePseudoRandomSalt(),
    nodeVersion: undefined,
    screenWidth: utils.getScreenWidth(),
    shouldBlockchainErrDialogBeOpen: false,
    sideToAssetToken: {
        [Side.Deposit]: {},
        [Side.Receive]: {},
    },
    tokenByAddress: {},
    lastForceTokenStateRefetch: moment().unix(),
    userAddress: '',
    userEtherBalanceInWei: undefined,
    userSuppliedOrderCache: undefined,
    portalOnboardingStep: 0,
    isPortalOnboardingShowing: false,
    hasPortalOnboardingBeenClosed: false,
    // Docs
    docsVersion: DEFAULT_DOCS_VERSION,
    availableDocVersions: [DEFAULT_DOCS_VERSION],
    // Staking
    isConnectWalletDialogOpen: false,
    providerState: providerStateFactory.getInitialProviderState(DEFAULT_NETWORK_ID),
    // Shared
    flashMessage: undefined,
    providerType: ProviderType.Injected,
    injectedProviderName: '',
    translate: new Translate(),
    // Simulator
    isSimulationDialogOpen: false
};

export function reducer(state: State = INITIAL_STATE, action: Action): State {
    switch (action.type) {
        // Portal
        case ActionTypes.ResetState:
            return {
                ...INITIAL_STATE,
                translate: state.translate,
            };

        case ActionTypes.UpdateOrderSalt: {
            return {
                ...state,
                orderSalt: action.data,
            };
        }

        case ActionTypes.UpdateSelectedLanguage: {
            return {
                ...state,
                translate: new Translate(action.data),
            };
        }

        case ActionTypes.UpdateNodeVersion: {
            return {
                ...state,
                nodeVersion: action.data,
            };
        }

        case ActionTypes.UpdateOrderFillAmount: {
            return {
                ...state,
                orderFillAmount: action.data,
            };
        }

        case ActionTypes.UpdateSimulatorDialogOpen: {
            return {
                ...state,
                isSimulationDialogOpen: action.data
            }
        }

        case ActionTypes.UpdateShouldBlockchainErrDialogBeOpen: {
            return {
                ...state,
                shouldBlockchainErrDialogBeOpen: action.data,
            };
        }

        case ActionTypes.UpdateUserEtherBalance: {
            return {
                ...state,
                userEtherBalanceInWei: action.data,
            };
        }

        case ActionTypes.UpdateUserSuppliedOrderCache: {
            return {
                ...state,
                userSuppliedOrderCache: action.data,
            };
        }

        case ActionTypes.AddTokenToTokenByAddress: {
            const newTokenByAddress = { ...state.tokenByAddress };
            newTokenByAddress[action.data.address] = action.data;
            return {
                ...state,
                tokenByAddress: newTokenByAddress,
            };
        }

        case ActionTypes.RemoveTokenFromTokenByAddress: {
            const newTokenByAddress = { ...state.tokenByAddress };
            delete newTokenByAddress[action.data.address];
            return {
                ...state,
                tokenByAddress: newTokenByAddress,
            };
        }

        case ActionTypes.UpdateTokenByAddress: {
            const tokenByAddress = { ...state.tokenByAddress };
            const tokens = action.data;
            _.each(tokens, token => {
                const updatedToken = {
                    ...tokenByAddress[token.address],
                    ...token,
                };
                tokenByAddress[token.address] = updatedToken;
            });
            return {
                ...state,
                tokenByAddress,
            };
        }

        case ActionTypes.BatchDispatch: {
            const userAddress = action.data.userAddressIfExists === undefined ? '' : action.data.userAddressIfExists;
            return {
                ...state,
                networkId: action.data.networkId,
                userAddress,
                sideToAssetToken: action.data.sideToAssetToken,
                tokenByAddress: action.data.tokenByAddress,
            };
        }

        case ActionTypes.ForceTokenStateRefetch:
            return {
                ...state,
                lastForceTokenStateRefetch: moment().unix(),
            };

        case ActionTypes.UpdateOrderSignature: {
            return {
                ...state,
                orderSignature: action.data,
            };
        }

        case ActionTypes.UpdateScreenWidth: {
            return {
                ...state,
                screenWidth: action.data,
            };
        }

        case ActionTypes.UpdateBlockchainIsLoaded: {
            return {
                ...state,
                blockchainIsLoaded: action.data,
            };
        }

        case ActionTypes.BlockchainErrEncountered: {
            return {
                ...state,
                blockchainErr: action.data,
            };
        }

        case ActionTypes.UpdateNetworkId: {
            return {
                ...state,
                networkId: action.data,
            };
        }

        case ActionTypes.UpdateChosenAssetToken: {
            const newSideToAssetToken = {
                ...state.sideToAssetToken,
                [action.data.side]: action.data.token,
            };
            return {
                ...state,
                sideToAssetToken: newSideToAssetToken,
            };
        }

        case ActionTypes.UpdateChosenAssetTokenAddress: {
            const newAssetToken = { ...state.sideToAssetToken[action.data.side] };
            newAssetToken.address = action.data.address;
            const newSideToAssetToken = {
                ...state.sideToAssetToken,
                [action.data.side]: newAssetToken,
            };
            return {
                ...state,
                sideToAssetToken: newSideToAssetToken,
            };
        }

        case ActionTypes.SwapAssetTokens: {
            const newSideToAssetToken = {
                [Side.Deposit]: state.sideToAssetToken[Side.Receive],
                [Side.Receive]: state.sideToAssetToken[Side.Deposit],
            };
            return {
                ...state,
                sideToAssetToken: newSideToAssetToken,
            };
        }

        case ActionTypes.UpdateOrderExpiry: {
            return {
                ...state,
                orderExpiryTimestamp: action.data,
            };
        }

        case ActionTypes.UpdateOrderTakerAddress: {
            return {
                ...state,
                orderTakerAddress: action.data,
            };
        }

        case ActionTypes.UpdateUserAddress: {
            const userAddress = action.data === undefined ? '' : action.data;
            return {
                ...state,
                userAddress,
            };
        }

        case ActionTypes.UpdatePortalOnboardingStep: {
            const portalOnboardingStep = action.data;
            return {
                ...state,
                portalOnboardingStep,
            };
        }

        case ActionTypes.UpdatePortalOnboardingShowing: {
            const isPortalOnboardingShowing = action.data;
            return {
                ...state,
                isPortalOnboardingShowing,
                hasPortalOnboardingBeenClosed: !isPortalOnboardingShowing ? true : state.hasPortalOnboardingBeenClosed,
                // always start onboarding from the beginning
                portalOnboardingStep: 0,
            };
        }

        // Docs
        case ActionTypes.UpdateLibraryVersion: {
            return {
                ...state,
                docsVersion: action.data,
            };
        }
        case ActionTypes.UpdateAvailableLibraryVersions: {
            return {
                ...state,
                availableDocVersions: action.data,
            };
        }

        // Staking
        case ActionTypes.UpdateIsConnectWalletDialogOpen: {
            return {
                ...state,
                isConnectWalletDialogOpen: action.data,
            };
        }

        case ActionTypes.SetAccountStateLoading: {
            return reduceStateWithAccount(state, constants.LOADING_ACCOUNT);
        }

        case ActionTypes.SetAccountStateLocked: {
            return reduceStateWithAccount(state, constants.LOCKED_ACCOUNT);
        }

        case ActionTypes.SetAccountStateReady: {
            const address = action.data;
            let newAccount: AccountReady = {
                state: AccountState.Ready,
                address,
            };

            if (state.providerState) {
                const currentAccount = state.providerState.account;
                if (currentAccount.state === AccountState.Ready && currentAccount.address === address) {
                    newAccount = {
                        ...newAccount,
                        ethBalanceInWei: currentAccount.ethBalanceInWei,
                    };
                }
            }

            return reduceStateWithAccount(state, newAccount);
        }

        case ActionTypes.UpdateAccountEthBalance: {
            const { address, ethBalanceInWei } = action.data;
            const currentAccount = state.providerState.account;
            if (currentAccount.state !== AccountState.Ready || currentAccount.address !== address) {
                return state;
            } else {
                const newAccount: AccountReady = {
                    ...currentAccount,
                    ethBalanceInWei,
                };
                return reduceStateWithAccount(state, newAccount);
            }
        }

        case ActionTypes.UpdateAccountZrxBalance: {
            const zrxBalanceBaseUnitAmount = action.data;
            const currentAccount = state.providerState.account;
            const newAccount = {
                ...currentAccount,
                zrxBalanceBaseUnitAmount,
            };
            return reduceStateWithAccount(state, newAccount);
        }

        case ActionTypes.UpdateAccountZrxAllowance: {
            const zrxAllowanceBaseUnitAmount = action.data;
            const currentAccount = state.providerState.account;
            const newAccount = {
                ...currentAccount,
                zrxAllowanceBaseUnitAmount,
            };
            return reduceStateWithAccount(state, newAccount);
        }

        case ActionTypes.UpdateProviderState: {
            return {
                ...state,
                providerState: action.data,
            };
        }

        // Shared
        case ActionTypes.ShowFlashMessage: {
            return {
                ...state,
                flashMessage: action.data,
            };
        }

        case ActionTypes.HideFlashMessage: {
            return {
                ...state,
                flashMessage: undefined,
            };
        }

        case ActionTypes.UpdateProviderType: {
            return {
                ...state,
                providerType: action.data,
            };
        }

        case ActionTypes.UpdateInjectedProviderName: {
            return {
                ...state,
                injectedProviderName: action.data,
            };
        }

        default:
            return state;
    }
}

const reduceStateWithAccount = (state: State, account: Account) => {
    const oldProviderState = state.providerState;
    const newProviderState: ProviderState = {
        ...oldProviderState,
        account,
    };
    return {
        ...state,
        providerState: newProviderState,
    };
};
