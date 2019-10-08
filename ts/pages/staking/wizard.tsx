import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Timeline } from 'ts/components/staking/wizard/Timeline';

export interface StakingWizardProps {}

interface SplitviewProps {
    leftComponent: React.ReactNode;
    rightComponent: React.ReactNode;
}

const Container = styled.div`
    max-width: 1390px;
    margin: 0 auto;
    position: relative;
`;

const SplitviewContainer = styled.div`
    display: flex;
    & > div {
        width: 50%;
    }
`;

const Left = styled.div`
    padding: 100px 60px;
`;

const Right = styled.div`
    background-color: ${colors.backgroundLightGrey};
    padding: 60px;
`;

const Splitview: React.FC<SplitviewProps> = props => {
    const { leftComponent, rightComponent } = props;
    return (
        <SplitviewContainer>
            <Left>{leftComponent}</Left>
            <Right>{rightComponent}</Right>
        </SplitviewContainer>
    );
};

export const StakingWizard: React.FC<StakingWizardProps> = props => {
    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview
                    leftComponent={
                        <Timeline
                            activeItemIndex={0}
                            header="Start Staking"
                            description="Use one pool of capital across multiple relayers to trade against a large group."
                            items={[
                                {
                                    date: '22.08',
                                    fromNow: '2 days',
                                    title: 'Staking starts',
                                    description: 'Your staking pool is included in the Market Maker score along with voting power.',
                                },
                                {
                                    date: '22.08',
                                    fromNow: '2 days',
                                    title: 'Staking starts',
                                    description: 'Your staking pool is included in the Market Maker score along with voting power.',
                                },
                                {
                                    date: '22.08',
                                    fromNow: '2 days',
                                    title: 'Staking starts',
                                    description: 'Your staking pool is included in the Market Maker score along with voting power.',
                                },
                            ]}
                        />
                    }
                    rightComponent={
                        <div>Right</div>
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
