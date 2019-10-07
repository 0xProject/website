import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

export interface StakingWizardProps {}

interface SplitviewProps {
    leftComponent: React.ReactNode;
    rightComponent: React.ReactNode;
}

interface TimelineItem {
    date: string;
    fromNow: string;
    title: string;
    description: string;
    isActive: boolean;
}

interface TimelineProps {
    items: TimelineItem[];
    activeItemIndex: number;
}

interface TimelineContentProps {
    isActive: boolean;
}

const Container = styled.div`
    max-width: 1152px;
    margin: 0 auto;
    position: relative;
    height: 290px;
`;

const SplitviewContainer = styled.div`
    display: flex;
    & > div {
        width: 50%;
    }
`;

const Left = styled.div`
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

const TimelineItem = styled.li`
    display: flex;
`;

const TimelineDate = styled.div`
    font-size: 17px;
    font-weight: 300;
    flex: 0 0 90px;
    & > span {
        margin-bottom: 10px;
        display: block;
    }
`;

const TimelineContent = styled.div<TimelineContentProps>`
    border-left: 1px solid #E6E6E6;
    padding: 0 40px 60px;
    position: relative;

    h3 {
        font-size: 20px;
        margin-bottom: 15px;
    }

    p {
        font-size: 17px;
        font-weight: 300;
        color: ${colors.textDarkSecondary};
        line-height: 1.35;
    }

    ${TimelineItem}:last-child & {
        padding-bottom: 0;
    }

    &:before {
        content: '';
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: ${props => props.isActive ? colors.black : '#E6E6E6' };
        top: 0;
        left: -8px;
    }
`;

const Timeline: React.FC<TimelineProps> = props => {
    const { items, activeItemIndex } = props;
    return (
        <ol>
            {items.map((item, index) => {
                const { date, fromNow, title, description } = item;
                const isActive = activeItemIndex === index;
                return (
                    <TimelineItem key={date}>
                        <TimelineDate>
                            <span>{fromNow}</span>
                            <span>{date}</span>
                        </TimelineDate>
                        <TimelineContent isActive={isActive}>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </ol>
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
