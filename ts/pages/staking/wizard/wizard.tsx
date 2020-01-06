import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { useEffect, useState } from 'react';
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

import { State } from 'ts/redux/reducer';
import { AccountReady, AccountState, Epoch, Network, PoolWithStats, ProviderState, UserStakingChoice } from 'ts/types';
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

// Right pane states
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

// Left pane states
export enum WizardInfoSteps {
    IntroductionStats = 'INTRODUCTION',
    Confirmation = 'CONFIRMATION',
    TokenApproval = 'TOKEN_APPROVAL',
}

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

    // TODO(johnrjj) - I'll clean this up in the next pass.
    // The important part is the wizard logic is centralized here now.
    // Determine right pane (wizard flow) state.
    let wizardFlowStep: WizardFlowSteps = WizardFlowSteps.Empty;
    // First half of wizard
    // if (currentStep === WizardRouterSteps.Start) {
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
    } else if (!selectedStakingPools) {
        // tslint:disable-next-line: prefer-conditional-expression
        if (poolId) {
            // Coming from market maker entry
            wizardFlowStep = WizardFlowSteps.MarketMakerEntry;
        } else {
            // Coming from wizard/recommendation entry
            wizardFlowStep = WizardFlowSteps.RecomendedEntry;
        }
    } else if (doesNeedTokenApproval) {
        wizardFlowStep = WizardFlowSteps.TokenApproval;
    } else {
        wizardFlowStep = WizardFlowSteps.CoreWizard;
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
                                />
                            )}
                            {wizardFlowStep === WizardFlowSteps.RecomendedEntry && (
                                <RecommendedPoolsStakeInputPane
                                    onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                    setSelectedStakingPools={setSelectedStakingPools}
                                    stakingPools={stakingPools}
                                    zrxBalance={zrxBalance}
                                />
                            )}
                            {wizardFlowStep === WizardFlowSteps.TokenApproval && (
                                <TokenApprovalPane allowance={allowance} providerState={providerState} />
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
