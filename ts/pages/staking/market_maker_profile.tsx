import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

export interface MarketMakerProfileProps {}

const Container = styled.div`
    max-width: 1152px;
    margin: 0 auto;
    position: relative;
    height: 290px;
`;

export const MarketMakerProfile: React.FC<MarketMakerProfileProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="Market Maker Profile">
            <Container/>
        </StakingPageLayout>
    );
};
