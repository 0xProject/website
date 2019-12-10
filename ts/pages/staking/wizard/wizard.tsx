import * as React from 'react';
import styled from 'styled-components';

import { logUtils } from '@0x/utils';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Epoch, Network, PoolWithStats, ProviderState, StakingPoolRecomendation, UserStakingChoice } from 'ts/types';

import { Splitview } from 'ts/components/staking/wizard/splitview';
import { WizardFlow } from 'ts/components/staking/wizard/wizard_flow';
import { WizardInfo } from 'ts/components/staking/wizard/wizard_info';

import { useAPIClient } from 'ts/hooks/use_api_client';

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
    const [userStakingPoolsToStake, setUserStakingPoolsToStake] = React.useState<UserStakingChoice[] | undefined>(
        undefined,
    );
    const [stakingPools, setStakingPools] = React.useState<PoolWithStats[] | undefined>(undefined); // available pools
    const [currentEpochStats, setCurrentEpochStats] = React.useState<Epoch | undefined>(undefined);
    const [nextEpochApproxStats, setNextEpochApproxStats] = React.useState<Epoch | undefined>(undefined);
    const apiClient = useAPIClient();
    React.useEffect(() => {
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
    }, []);

    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview
                    leftComponent={
                        <WizardInfo
                            nextEpochApproxStats={nextEpochApproxStats}
                            currentEpochStats={currentEpochStats}
                            selectedStakingPools={userStakingPoolsToStake}
                        />}
                    rightComponent={
                        <WizardFlow
                            nextEpochApproxStats={nextEpochApproxStats}
                            selectedStakingPools={userStakingPoolsToStake}
                            setSelectedStakingPools={setUserStakingPoolsToStake}
                            stakingPools={stakingPools}
                            {...props}
                        />
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
