import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { useStakingWizard, WizardRouterSteps } from 'ts/hooks/use_wizard';

import { State } from 'ts/redux/reducer';
import {
    AccountReady,
    AccountState,
    Epoch,
    Network,
    PoolWithStats,
    ProviderState,
    StakingPoolRecomendation,
    UserStakingChoice,
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

export const StakingWizard: React.FC<StakingWizardProps> = props => {
    // If coming from the market maker page, poolId will be provided
    const { poolId } = useQuery<{ poolId: string | undefined }>();

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

    const { currentStep, next } = useStakingWizard();

    const handleClickNextStep = useCallback(() => {
        if (currentStep === WizardRouterSteps.SetupWizard) {
            if (doesNeedTokenApproval) {
                return next(WizardRouterSteps.ApproveTokens);
            } else {
                return next(WizardRouterSteps.ReadyToStake);
            }
        }
        if (currentStep === WizardRouterSteps.ApproveTokens) {
            // We block users to go back to ApproveToken panel once they've already approved.
            // If they hit back, they'll go back to the setup panel (thanks to replace: true)
            return next(WizardRouterSteps.ReadyToStake, { replace: true });
        }
        return next(WizardRouterSteps.ReadyToStake);
    }, [currentStep, doesNeedTokenApproval, next]);

    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview
                    leftComponent={
                        <>
                            {currentStep === WizardRouterSteps.SetupWizard && (
                                <IntroWizardInfo currentEpochStats={currentEpochStats} />
                            )}
                            {currentStep === WizardRouterSteps.ApproveTokens && <TokenApprovalInfo />}
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
                    title="You have no ZRX balance. You will need some to stake."
                    linkText="Go buy some ZRX"
                    linkUrl={`https://www.rexrelay.com/instant/?defaultSelectedAssetData=${constants.ZRX_ASSET_DATA}`}
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
