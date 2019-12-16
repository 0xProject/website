import { logUtils } from '@0x/utils';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import {
    ConnectWalletPane,
    WizardFlow,
    MarketMakerStakeInputPane,
    RecommendedPoolsStakeInputPane,
} from 'ts/components/staking/wizard/wizard_flow';
import { WizardInfo } from 'ts/components/staking/wizard/wizard_info';

import { useAllowance } from 'ts/hooks/use_allowance';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { useQuery } from 'ts/hooks/use_query';
import { useStake } from 'ts/hooks/use_stake';

import { Web3Wrapper } from '@0x/web3-wrapper';
import { animated, useTransition } from 'react-spring';
import { Status } from 'ts/components/staking/wizard/status';
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

export interface WizardHookResult {
    step: Step;
    // next: Function;
    // back: Function;
}

enum Step {
    Initial,
}

const useWizard = (): WizardHookResult => {
    const [step, setStep] = useState<Step>(Step.Initial);

    return {
        step,
    };
};

export enum WizardSteps {
    ConnectWallet = 'CONNECT_WALLET',
    Empty = 'EMPTY',
    NoZrxInWallet = 'NO_ZRX_IN_WALLET',
    MarketMakerEntry = 'MARKET_MAKER_ENTRY',
    RecomendedEntry = 'RECOMENDED_ENTRY',
    CoreWizard = 'CORE_WIZARD',
}

export const StakingWizardBody: React.FC<StakingWizardProps> = props => {
    // If coming from the market maker page, poolId will be provided
    const { poolId } = useQuery<{ poolId: string | undefined }>();

    const networkId = useSelector((state: State) => state.networkId);
    const providerState = useSelector((state: State) => state.providerState);
    const apiClient = useAPIClient(networkId);

    const [stakingPools, setStakingPools] = useState<PoolWithStats[] | undefined>(undefined);
    const [userSelectedStakingPools, setUserSelectedStakingPools] = React.useState<UserStakingChoice[] | undefined>(
        undefined,
    );
    const [currentEpochStats, setCurrentEpochStats] = useState<Epoch | undefined>(undefined);
    const [nextEpochStats, setNextEpochStats] = useState<Epoch | undefined>(undefined);

    const getStatus = (): WizardSteps => {
        if (props.providerState.account.state !== AccountState.Ready) {
            return WizardSteps.ConnectWallet;
        }
        const { zrxBalanceBaseUnitAmount } = providerState.account as AccountReady;
        if (!zrxBalanceBaseUnitAmount) {
            return WizardSteps.ConnectWallet;
        }
        const unitAmount = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX).toNumber();
        if (unitAmount < 1) {
            return WizardSteps.NoZrxInWallet;
        }
        // Coming from market maker entry
        if (!userSelectedStakingPools && poolId) {
            return WizardSteps.MarketMakerEntry;
        }
        // Coming from wizard/recommendation entry
        if (!userSelectedStakingPools || providerState.account.state !== AccountState.Ready) {
            return WizardSteps.RecomendedEntry;
        }
        return WizardSteps.CoreWizard;
    };

    const status = getStatus();

    const stake = useStake(networkId, providerState);
    const allowance = useAllowance();

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

    const wizard = useWizard();

    const step = { stepId: status };

    const transitions = useTransition(step, s => s.stepId, {
        from: (s: any) => {
            return ({ opacity: 0, transform: 'translate3d(100%, 0px, 0)' });
        },
        enter: () => {
            return { opacity: 1, transform: 'translate3d(0, 0px, 0)' }
        },
        leave: (s: any) => {
            // if (s.stepId === WizardSteps.ConnectWallet) {
                // return ({
                    // position: 'absolute',
                    // opacity: 0, transform: 'translate3d(0%, -40vh, 0)' })
            // }
            return ({ opacity: 0, transform: 'translate3d(-100%, 0px, 0)' })
        },
        initial: null,
    });

    const { zrxBalanceBaseUnitAmount } = providerState.account as AccountReady;
    let unitAmount: number;
    if (zrxBalanceBaseUnitAmount) {
        unitAmount = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX).toNumber();
    }

    return (
            <Container>
                <Splitview
                    leftComponent={
                        <WizardInfo
                            currentEpochStats={currentEpochStats}
                            nextEpochStats={nextEpochStats}
                            selectedStakingPools={userSelectedStakingPools}
                        />
                    }
                    rightComponent={
                        <WizardFlowRelativeContainer>
                            {/* <WizardFlowAbsoluteContaine> */}
                                {transitions.map(({ item, props: styleProps, key }) => (
                                    <AnimatedWizardFlowAbsoluteContaine key={key} style={styleProps}>
                                        <WizardFlowFlexInnerContainer>
                                        {item.stepId === WizardSteps.ConnectWallet && (
                                            <ConnectWalletPane
                                                onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                            />
                                        )}
                                        {item.stepId === WizardSteps.NoZrxInWallet && (
                                            <Status
                                                title="You have no ZRX balance. You will need some to stake."
                                                linkText="Go buy some ZRX"
                                                linkUrl={`https://www.rexrelay.com/instant/?defaultSelectedAssetData=${constants.ZRX_ASSET_DATA}`}
                                            />
                                        )}
                                        {item.stepId === WizardSteps.MarketMakerEntry && (
                                            <MarketMakerStakeInputPane
                                                poolId={poolId}
                                                unitAmount={unitAmount}
                                                stakingPools={stakingPools}
                                                onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                                setSelectedStakingPools={setUserSelectedStakingPools}
                                                zrxBalanceBaseUnitAmount={zrxBalanceBaseUnitAmount}
                                            />
                                        )}
                                        {item.stepId === WizardSteps.RecomendedEntry && (
                                            <RecommendedPoolsStakeInputPane
                                                onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                                setSelectedStakingPools={setUserSelectedStakingPools}
                                                stakingPools={stakingPools}
                                                unitAmount={unitAmount}
                                                zrxBalanceBaseUnitAmount={zrxBalanceBaseUnitAmount}
                                            />
                                        )}
                                        </WizardFlowFlexInnerContainer>
                                    </AnimatedWizardFlowAbsoluteContaine>
                                ))}
                                {/* <WizardFlowFlexInnerContainer>
                                    <WizardFlow
                                        currentEpochStats={currentEpochStats}
                                        nextEpochStats={nextEpochStats}
                                        selectedStakingPools={userSelectedStakingPools}
                                        setSelectedStakingPools={setUserSelectedStakingPools}
                                        stakingPools={stakingPools}
                                        stake={stake}
                                        allowance={allowance}
                                        networkId={networkId}
                                        providerState={providerState}
                                        onOpenConnectWalletDialog={props.onOpenConnectWalletDialog}
                                        poolId={poolId}
                                    />
                                </WizardFlowFlexInnerContainer> */}
                            {/* </WizardFlowAbsoluteContaine> */}
                        </WizardFlowRelativeContainer>
                    }
                />
            </Container>
    );
};

export const StakingWizard: React.FC<StakingWizardProps> = props => {
    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <StakingWizardBody {...props}/>
        </StakingPageLayout>
    );
}

const WizardFlowRelativeContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
`;

const WizardFlowAbsoluteContaine = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`;

const WizardFlowFlexInnerContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

// const AnimatedWizardFlowAbsoluteContaine = animated(WizardFlowAbsoluteContaine);

const AnimatedWizardFlowAbsoluteContaine = styled(animated.div)`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`