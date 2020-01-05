import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { History } from 'history';
import qs from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { usePreviousDistinct } from 'react-use';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import { Status } from 'ts/components/staking/wizard/status';
import {
    ConnectWalletPane,
    MarketMakerStakeInputPane,
    RecommendedPoolsStakeInputPane,
    StartStaking,
    TokenApprovalPane,
} from 'ts/components/staking/wizard/wizard_flow';
import { ConfirmationWizardInfo, IntroWizardInfo, TokenApprovalInfo } from 'ts/components/staking/wizard/wizard_info';

import { useAllowance } from 'ts/hooks/use_allowance';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { useQuery } from 'ts/hooks/use_query';
import { useStake } from 'ts/hooks/use_stake';

import { State } from 'ts/redux/reducer';
import {
    AccountReady,
    AccountState,
    Epoch,
    Network,
    PoolWithStats,
    ProviderState,
    UserStakingChoice,
    WebsitePaths,
} from 'ts/types';
import { constants } from 'ts/utils/constants';

export interface StakingWizardProps {
    providerState: ProviderState;
    networkId: Network;
    onOpenConnectWalletDialog: () => void;
}

const Container = styled.div`
    max-width: 1390px;
    margin: 0 auto;
    position: relative;
`;

// These are the primary states (controlled by routing).
// Within these, there are substates.
// We do this to control routing/back/forward in the wizard
export enum WizardRouterSteps {
    Start = 'start',
    Stake = 'stake',
}

export enum WizardFlowSteps {
    // 'Start' steps.
    ConnectWallet = 'CONNECT_WALLET',
    Empty = 'EMPTY',
    NoZrxInWallet = 'NO_ZRX_IN_WALLET',
    MarketMakerEntry = 'MARKET_MAKER_ENTRY',
    RecomendedEntry = 'RECOMENDED_ENTRY',
    // 'Stake' steps.
    TokenApproval = 'TOKEN_APPROVAL',
    CoreWizard = 'CORE_WIZARD',
}

export enum WizardInfoSteps {
    IntroductionStats = 'INTRODUCTION',
    Confirmation = 'CONFIRMATION',
    TokenApproval = 'TOKEN_APPROVAL',
}

export interface IUSeWizardResult {
    currentStep: WizardRouterSteps;
    next: (nextStep: WizardRouterSteps) => void;
    back: () => void;
}

const DEFAULT_STEP = WizardRouterSteps.Start;

const useStakingWizard = (selectedStakingPools?: UserStakingChoice[]): IUSeWizardResult => {
    const { step } = useQuery<{ poolId: string | undefined; step: WizardRouterSteps | undefined }>();
    const history: History = useHistory();
    const queryParams = useQuery();

    // Default to initial step if none/invalid one provided
    // OR if a user loads a url directly to mid-progress wizard without requied data, redirect back to start page
    useEffect(() => {
        if (!step || (step !== WizardRouterSteps.Start && !selectedStakingPools)) {
            return history.replace(
                `${WebsitePaths.StakingWizard}?${qs.stringify({
                    ...queryParams,
                    step: DEFAULT_STEP,
                })}`,
            );
        }
    }, [step, history, queryParams, selectedStakingPools]);

    // Right now, user-space will determine what the next step is.
    const goToNextStep = useCallback(
        nextStep => {
            if (!nextStep) {
                return;
            }
            history.push(
                `${WebsitePaths.StakingWizard}?${qs.stringify({
                    ...queryParams,
                    step: nextStep,
                })}`,
            );
        },
        [history, queryParams],
    );

    const goToPreviousStep = useCallback(() => {
        history.goBack();
    }, [history]);

    return {
        currentStep: step || DEFAULT_STEP,
        next: goToNextStep,
        back: goToPreviousStep,
    };
};

export const StakingWizard: React.FC<StakingWizardProps> = props => {
    // If coming from the market maker page, poolId will be provided
    const { poolId } = useQuery<{ poolId: string | undefined; step: WizardRouterSteps }>();

    const networkId = useSelector((state: State) => state.networkId);
    const providerState = useSelector((state: State) => state.providerState);
    const apiClient = useAPIClient(networkId);

    const [stakingPools, setStakingPools] = useState<PoolWithStats[] | undefined>(undefined);
    const [selectedStakingPools, setSelectedStakingPools] = React.useState<UserStakingChoice[] | undefined>(undefined);
    const [currentEpochStats, setCurrentEpochStats] = useState<Epoch | undefined>(undefined);
    const [nextEpochStats, setNextEpochStats] = useState<Epoch | undefined>(undefined);

    const stake = useStake(networkId, providerState);
    const allowance = useAllowance();

    const allowanceBaseUnits =
        (props.providerState.account as AccountReady).zrxAllowanceBaseUnitAmount || new BigNumber(0);

    const doesNeedTokenApproval = allowanceBaseUnits.isLessThan(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS);

    const { zrxBalanceBaseUnitAmount } = providerState.account as AccountReady;
    let zrxBalance: BigNumber | undefined;
    if (zrxBalanceBaseUnitAmount) {
        zrxBalance = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
    }

    const { currentStep, next, back } = useStakingWizard(selectedStakingPools);

    // Load stakingPools
    useEffect(() => {
        const fetchAndSetPools = async () => {
            try {
                const poolsResponse = await apiClient.getStakingPoolsAsync();
                setStakingPools(poolsResponse.stakingPools);
            } catch (err) {
                logUtils.warn(err);
                setStakingPools([]);
            }
        };
        setStakingPools(undefined);
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetPools();
    }, [networkId, apiClient]);

    // Load current and next epoch
    useEffect(() => {
        const fetchAndSetEpochs = async () => {
            try {
                const epochsResponse = await apiClient.getStakingEpochsAsync();
                setCurrentEpochStats(epochsResponse.currentEpoch);
                setNextEpochStats(epochsResponse.nextEpoch);
            } catch (err) {
                logUtils.warn(err);
                setStakingPools([]);
            }
        };
        setCurrentEpochStats(undefined);
        setNextEpochStats(undefined);
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetEpochs();
    }, [networkId, apiClient]);

    // TODO(johnrjj) - I'll clean this up in the next pass.
    // The important part is the wizard logic is centralized here now.
    // Determine right pane (wizard flow) state.
    let wizardFlowStep: WizardFlowSteps = WizardFlowSteps.Empty;
    // First half of wizard
    if (currentStep === WizardRouterSteps.Start) {
        // We're currently in the first part
        if (providerState.account.state !== AccountState.Ready) {
            wizardFlowStep = WizardFlowSteps.ConnectWallet;
        } else if (!zrxBalanceBaseUnitAmount) {
            // TODO(johnrjj) - This should also add a spinner to the ConnectWallet panel
            // e.g. at this point, the wallet is connected but loading stuff via redux/etc
            wizardFlowStep = WizardFlowSteps.ConnectWallet;
        } else if (!zrxBalance || zrxBalance.isLessThan(1)) {
            // No balance...
            wizardFlowStep = WizardFlowSteps.NoZrxInWallet;
        } else {
            if (!selectedStakingPools && poolId) {
                // Coming from market maker entry
                wizardFlowStep = WizardFlowSteps.MarketMakerEntry;
            } else {
                // Coming from wizard/recommendation entry
                wizardFlowStep = WizardFlowSteps.RecomendedEntry;
            }
        }
    } else if (currentStep === WizardRouterSteps.Stake) {
        // Core wizard
        // tslint:disable-next-line: prefer-conditional-expression
        if (doesNeedTokenApproval) {
            wizardFlowStep = WizardFlowSteps.TokenApproval;
        } else {
            wizardFlowStep = WizardFlowSteps.CoreWizard;
        }
    }
    // Derive left pane (wizard info) step from the right pane.
    let wizardInfoStep: WizardInfoSteps;
    if (wizardFlowStep === WizardFlowSteps.CoreWizard) {
        wizardInfoStep = WizardInfoSteps.Confirmation;
    } else if (wizardFlowStep === WizardFlowSteps.TokenApproval) {
        wizardInfoStep = WizardInfoSteps.TokenApproval;
    } else {
        wizardInfoStep = WizardInfoSteps.IntroductionStats;
    }

    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview
                    leftComponent={
                        <>
                            {wizardInfoStep === WizardInfoSteps.IntroductionStats && (
                                <IntroWizardInfo currentEpochStats={currentEpochStats} />
                            )}
                            {wizardInfoStep === WizardInfoSteps.TokenApproval && <TokenApprovalInfo />}
                            {wizardInfoStep === WizardInfoSteps.Confirmation && (
                                <ConfirmationWizardInfo nextEpochStats={nextEpochStats} />
                            )}
                        </>
                    }
                    rightComponent={
                        <>
                            {wizardFlowStep === WizardFlowSteps.ConnectWallet && (
                                <ConnectWalletPane onOpenConnectWalletDialog={props.onOpenConnectWalletDialog} />
                            )}
                            {wizardFlowStep === WizardFlowSteps.NoZrxInWallet && (
                                <Status
                                    title="You have no ZRX balance. You will need some to stake."
                                    linkText="Go buy some ZRX"
                                    linkUrl={`https://www.rexrelay.com/instant/?defaultSelectedAssetData=${constants.ZRX_ASSET_DATA}`}
                                />
                            )}
                            {wizardFlowStep === WizardFlowSteps.MarketMakerEntry && (
                                <MarketMakerStakeInputPane
                                    poolId={poolId}
                                    zrxBalance={zrxBalance}
                                    stakingPools={stakingPools}
                                    onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                    setSelectedStakingPools={setSelectedStakingPools}
                                    onClickNextStepButton={() => next(WizardRouterSteps.Stake)}
                                />
                            )}
                            {wizardFlowStep === WizardFlowSteps.RecomendedEntry && (
                                <RecommendedPoolsStakeInputPane
                                    onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                    setSelectedStakingPools={setSelectedStakingPools}
                                    stakingPools={stakingPools}
                                    zrxBalance={zrxBalance}
                                    onClickNextStepButton={() => next(WizardRouterSteps.Stake)}
                                />
                            )}
                            {wizardFlowStep === WizardFlowSteps.TokenApproval && (
                                <TokenApprovalPane
                                    allowance={allowance}
                                    nextEpochStats={nextEpochStats}
                                    providerState={providerState}
                                    selectedStakingPools={selectedStakingPools}
                                />
                            )}
                            {wizardFlowStep === WizardFlowSteps.CoreWizard && (
                                <StartStaking
                                    stake={stake}
                                    nextEpochStats={nextEpochStats}
                                    providerState={providerState}
                                    selectedStakingPools={selectedStakingPools}
                                />
                            )}
                        </>
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
