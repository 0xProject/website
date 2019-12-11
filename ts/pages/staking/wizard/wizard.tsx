import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { logUtils } from '@0x/utils';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Splitview } from 'ts/components/staking/wizard/splitview';
import { WizardFlow } from 'ts/components/staking/wizard/wizard_flow';
import { WizardInfo } from 'ts/components/staking/wizard/wizard_info';

import { useAPIClient } from 'ts/hooks/use_api_client';
import { useStakingWizard } from 'ts/pages/staking/wizard/use-staking-wizard';

import { State } from 'ts/redux/reducer';
import { Epoch, Network, PoolWithStats, ProviderState, UserStakingChoice } from 'ts/types';

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
    const networkId = useSelector((state: State) => state.networkId);
    const providerState = useSelector((state: State) => state.providerState);
    const apiClient = useAPIClient(networkId);

    const [stakingPools, setStakingPools] = useState<PoolWithStats[] | undefined>(undefined);
    const [userSelectedStakingPools, setUserSelectedStakingPools] = React.useState<UserStakingChoice[] | undefined>(undefined);
    const [currentEpochStats, setCurrentEpochStats] = useState<Epoch | undefined>(undefined);
    const [nextEpochApproxStats, setNextEpochApproxStats] = useState<Epoch | undefined>(undefined);

    useEffect(() => {
        const fetchAndSetPools = async () => {
            try {
                const poolsResponse = await apiClient.getStakingPoolsAsync();
                setStakingPools(poolsResponse.stakingPools);
                setCurrentEpochStats(poolsResponse.currentEpoch);
                setNextEpochApproxStats(poolsResponse.approximateNextEpoch);
            } catch (err) {
                logUtils.warn(err);
                setStakingPools([]);
                setCurrentEpochStats(undefined);
                setNextEpochApproxStats(undefined);
            }
        };
        setStakingPools(undefined);
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetPools();
    }, [networkId, apiClient]);

    const {
        stake,
        allowance,
        estimatedAllowanceTransactionFinishTime,
        estimatedStakingTransactionFinishTime,
    } = useStakingWizard({
        networkId,
        providerState,
    });

    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview
                    leftComponent={
                        <WizardInfo
                            nextEpochApproxStats={nextEpochApproxStats}
                            currentEpochStats={currentEpochStats}
                            selectedStakingPools={userSelectedStakingPools}
                        />
                    }
                    rightComponent={
                        <WizardFlow
                            nextEpochApproxStats={nextEpochApproxStats}
                            selectedStakingPools={userSelectedStakingPools}
                            setSelectedStakingPools={setUserSelectedStakingPools}
                            stakingPools={stakingPools}
                            stake={stake}
                            allowance={allowance}
                            estimatedAllowanceTransactionFinishTime={estimatedAllowanceTransactionFinishTime}
                            estimatedStakingTransactionFinishTime={estimatedStakingTransactionFinishTime}
                            {...props}
                        />
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
