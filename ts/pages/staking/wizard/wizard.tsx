import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    VotingPowerConfirmation,
} from 'ts/components/staking/wizard/wizard_flow';
import {
    ConfirmationWizardInfo,
    IntroWizardInfo,
    VotingPowerWizardInfo,
} from 'ts/components/staking/wizard/wizard_info';

import { useAllowance } from 'ts/hooks/use_allowance';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { useQuery } from 'ts/hooks/use_query';
import { useStake } from 'ts/hooks/use_stake';
import { useStakingWizard, WizardRouterSteps } from 'ts/hooks/use_wizard';

import { asyncDispatcher } from 'ts/redux/async_dispatcher';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import {
    AccountReady,
    AccountState,
    AllTimeStats,
    Epoch,
    Network,
    PoolWithStats,
    ProviderState,
    StakingPoolRecomendation,
    UserStakingChoice,
} from 'ts/types';
import { constants } from 'ts/utils/constants';
import { errorReporter } from 'ts/utils/error_reporter';
import { stakingUtils } from 'ts/utils/staking_utils';

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

export const StakingWizard: React.FC<StakingWizardProps> = (props) => {
    // If coming from the market maker page, poolId will be provided
    const { poolId } = useQuery<{ poolId: string | undefined }>();
    const { providerState } = props;

    const dispatch = useDispatch();
    const dispatcher = new Dispatcher(dispatch);

    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);

    const [stakingPools, setStakingPools] = useState<PoolWithStats[] | undefined>(undefined);
    const [selectedStakingPools, setSelectedStakingPools] = React.useState<UserStakingChoice[] | undefined>(undefined);
    const [currentEpochStats, setCurrentEpochStats] = useState<Epoch | undefined>(undefined);
    const [nextEpochStats, setNextEpochStats] = useState<Epoch | undefined>(undefined);
    const [allTimeStats, setAllTimeStats] = useState<AllTimeStats | undefined>(undefined);

    const stake = useStake(networkId, providerState);
    const allowance = useAllowance();

    const allowanceBaseUnits = (providerState.account as AccountReady).zrxAllowanceBaseUnitAmount || new BigNumber(0);

    const doesNeedTokenApproval = allowanceBaseUnits.isLessThan(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS);

    const { zrxBalanceBaseUnitAmount } = providerState.account as AccountReady;
    let zrxBalance: BigNumber | undefined;
    if (zrxBalanceBaseUnitAmount) {
        zrxBalance = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
    }

    // Load stakingPools
    useEffect(() => {
        const fetchAndSetPools = async () => {
            try {
                const poolsResponse = await apiClient.getStakingPoolsAsync();
                const activePools = (poolsResponse.stakingPools || []).filter(stakingUtils.isPoolActive);
                setStakingPools(activePools);
            } catch (err) {
                logUtils.warn(err);
                setStakingPools([]);
                errorReporter.report(err);
            }
        };
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
                setCurrentEpochStats(undefined);
                setNextEpochStats(undefined);
                errorReporter.report(err);
            }
        };
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetEpochs();
    }, [networkId, apiClient]);

    useEffect(() => {
        const fetchAndSetStakingStats = async () => {
            try {
                const stats = await apiClient.getStakingStatsAsync();
                setAllTimeStats(stats.allTime);
            } catch (err) {
                logUtils.warn(err);
                setAllTimeStats(undefined);
                errorReporter.report(err);
            }
        };

        // tslint:disable-next-line:no-floating-promises
        fetchAndSetStakingStats();
    }, [networkId, apiClient]);

    const { currentStep, next } = useStakingWizard();

    const handleClickNextStep = useCallback(() => {
        if (currentStep === WizardRouterSteps.SetupWizard) {
            if (doesNeedTokenApproval) {
                return next(WizardRouterSteps.ApproveTokens);
            } else {
                return next(WizardRouterSteps.VotingPower);
            }
        }
        if (currentStep === WizardRouterSteps.VotingPower) {
            return next(WizardRouterSteps.ReadyToStake);
        }
        if (currentStep === WizardRouterSteps.ApproveTokens) {
            // We block users to go back to ApproveToken panel once they've already approved.
            // If they hit back, they'll go back to the setup panel (thanks to replace: true)
            return next(WizardRouterSteps.ReadyToStake, { replace: true });
        }
        return next(WizardRouterSteps.ReadyToStake);
    }, [currentStep, doesNeedTokenApproval, next]);

    const onUpdateAccountBalances = useCallback(() => {
        // tslint:disable-next-line:no-floating-promises
        asyncDispatcher.fetchAccountBalanceAndDispatchToStoreAsync(
            (providerState.account as AccountReady).address,
            providerState.web3Wrapper,
            dispatcher,
            networkId,
        );
    }, [dispatcher, networkId, providerState.account, providerState.web3Wrapper]);

    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview
                    leftComponent={
                        <>
                            {(currentStep === WizardRouterSteps.SetupWizard ||
                                currentStep === WizardRouterSteps.ApproveTokens) && (
                                <IntroWizardInfo
                                    nextEpochStats={nextEpochStats}
                                    currentEpochStats={currentEpochStats}
                                    allTimeStats={allTimeStats}
                                />
                            )}
                            {currentStep === WizardRouterSteps.VotingPower && <VotingPowerWizardInfo />}
                            {currentStep === WizardRouterSteps.ReadyToStake && (
                                <ConfirmationWizardInfo nextEpochStats={nextEpochStats} />
                            )}
                        </>
                    }
                    rightComponent={
                        <>
                            {currentStep === WizardRouterSteps.SetupWizard && (
                                <SetupStaking
                                    onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                    poolId={poolId}
                                    setSelectedStakingPools={setSelectedStakingPools}
                                    stakingPools={stakingPools}
                                    zrxBalanceBaseUnitAmount={zrxBalanceBaseUnitAmount}
                                    zrxBalance={zrxBalance}
                                    providerState={providerState}
                                    onGoToNextStep={handleClickNextStep}
                                    onUpdateAccountBalances={onUpdateAccountBalances}
                                />
                            )}
                            {currentStep === WizardRouterSteps.VotingPower && (
                                <VotingPowerConfirmation
                                    selectedStakingPools={selectedStakingPools}
                                    onGoToNextStep={handleClickNextStep}
                                    providerState={providerState}
                                />
                            )}
                            {currentStep === WizardRouterSteps.ApproveTokens && (
                                <TokenApprovalPane
                                    allowance={allowance}
                                    providerState={providerState}
                                    onGoToNextStep={handleClickNextStep}
                                />
                            )}
                            {currentStep === WizardRouterSteps.ReadyToStake && (
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

// TODO(johnrjj) - Deserves its own file...
export interface SetupStakingProps {
    providerState: ProviderState;
    setSelectedStakingPools: React.Dispatch<React.SetStateAction<StakingPoolRecomendation[]>>;
    onOpenConnectWalletDialog: () => void;
    onGoToNextStep: () => void;
    stakingPools?: PoolWithStats[];
    zrxBalanceBaseUnitAmount?: BigNumber;
    zrxBalance?: BigNumber;
    poolId?: string;
    onUpdateAccountBalances: () => void;
}

// Substeps of the start step
export enum WizardSetupSteps {
    // 'Start' steps.
    ConnectWallet = 'CONNECT_WALLET',
    Empty = 'EMPTY',
    NoZrxInWallet = 'NO_ZRX_IN_WALLET',
    MarketMakerEntry = 'MARKET_MAKER_ENTRY',
    RecomendedEntry = 'RECOMENDED_ENTRY',
}

const SetupStaking: React.FC<SetupStakingProps> = ({
    providerState,
    setSelectedStakingPools,
    stakingPools,
    onOpenConnectWalletDialog,
    zrxBalanceBaseUnitAmount,
    zrxBalance,
    poolId,
    onGoToNextStep,
    onUpdateAccountBalances,
}) => {
    let wizardFlowStep: WizardSetupSteps = WizardSetupSteps.Empty;
    if (providerState.account.state !== AccountState.Ready) {
        wizardFlowStep = WizardSetupSteps.ConnectWallet;
    } else if (!zrxBalanceBaseUnitAmount) {
        // TODO(johnrjj) - This should also add a spinner to the ConnectWallet panel
        // e.g. at this point, the wallet is connected but loading stuff via redux/etc
        wizardFlowStep = WizardSetupSteps.ConnectWallet;
    } else if (!zrxBalance || zrxBalance.isLessThan(1)) {
        // No balance...
        wizardFlowStep = WizardSetupSteps.NoZrxInWallet;
    } else {
        // Otherwise, we're good to show either the MM or Recommendation pane
        if (poolId) {
            // Coming from market maker entry
            wizardFlowStep = WizardSetupSteps.MarketMakerEntry;
        } else {
            // Coming from wizard/recommendation entry
            wizardFlowStep = WizardSetupSteps.RecomendedEntry;
        }
    }

    return (
        <>
            {wizardFlowStep === WizardSetupSteps.ConnectWallet && (
                <ConnectWalletPane onOpenConnectWalletDialog={onOpenConnectWalletDialog} />
            )}
            {wizardFlowStep === WizardSetupSteps.NoZrxInWallet && (
                <Status
                    title={
                        <div>
                            You have no ZRX balance.
                            <br />
                            You will need some to stake.
                        </div>
                    }
                    linkText="Go buy some ZRX"
                    linkUrl={`https://matcha.xyz/markets/ZRX`}
                />
            )}
            {/* TODO(johnrjj) - Conslidate MM and Recommended panels */}
            {wizardFlowStep === WizardSetupSteps.MarketMakerEntry && (
                <MarketMakerStakeInputPane
                    poolId={poolId}
                    zrxBalance={zrxBalance}
                    stakingPools={stakingPools}
                    onOpenConnectWalletDialog={onOpenConnectWalletDialog}
                    setSelectedStakingPools={setSelectedStakingPools}
                    onGoToNextStep={onGoToNextStep}
                />
            )}
            {wizardFlowStep === WizardSetupSteps.RecomendedEntry && (
                <RecommendedPoolsStakeInputPane
                    onOpenConnectWalletDialog={onOpenConnectWalletDialog}
                    setSelectedStakingPools={setSelectedStakingPools}
                    stakingPools={stakingPools}
                    zrxBalance={zrxBalance}
                    onGoToNextStep={onGoToNextStep}
                />
            )}
        </>
    );
};
