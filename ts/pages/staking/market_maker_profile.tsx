import * as React from 'react';
import styled from 'styled-components';

import { HistoryChart } from 'ts/components/staking/history_chart';
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
            <Container>
                <HistoryChart
                    fees={[40, 41, 40, 41, 40, 41, 40, 41, 40, 41, 40, 41]}
                    rewards={[30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31]}
                    epochs={[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]}
                    labels={['1 July', '5 July', '10 July', '15 July', '20 July', '25 July', '30 July']}
                />
            </Container>
        </StakingPageLayout>
    );
};
