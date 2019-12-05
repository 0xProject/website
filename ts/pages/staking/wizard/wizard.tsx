import * as React from 'react';
import styled from 'styled-components';

import { Network, PoolWithStats, ProviderState } from 'ts/types';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Splitview } from 'ts/components/staking/wizard/splitview';
import { WizardFlow } from 'ts/components/staking/wizard/wizard_flow';
import { WizardInfo } from 'ts/components/staking/wizard/wizard_info';

export interface StakingWizardProps {
    providerState: ProviderState;
    networkId: Network;
    onOpenConnectWalletDialog: () => void;
    onSetZrxAllowanceIfNeededAsync: (providerState: ProviderState, networkId: Network) => Promise<void>;
}

const Container = styled.div`
    max-width: 1390px;
    margin: 0 auto;
    position: relative;
`;

export const StakingWizard: React.FC<StakingWizardProps> = props => {
    const [selectedStakingPools, setSelectedStakingPools] = React.useState<PoolWithStats[] | undefined>(undefined);

    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview leftComponent={<WizardInfo selectedStakingPools={selectedStakingPools} />} rightComponent={<WizardFlow selectedStakingPools={selectedStakingPools} setSelectedStakingPools={setSelectedStakingPools} {...props} />} />
            </Container>
        </StakingPageLayout>
    );
};
