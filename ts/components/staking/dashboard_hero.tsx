import * as React from 'react';
import styled from 'styled-components';

import { Tab, Tabs } from 'ts/components/tabs';

import { colors } from 'ts/style/colors';

interface DashboardHeroProps {

}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

const Wrapper = styled.div<WrapperProps>`
    margin-bottom: 40px;
`;

const Inner = styled.div<InnerProps>`
    background-color: ${colors.backgroundLightGrey};
    @media (min-width: 768px) {
        padding: 60px;
    }
`;

const Row = styled.div<RowProps>`
    max-width: 1152px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const Column = styled.div`
    padding: 30px;
    width: 50%;
    @media (min-width: 768px) {
        padding: 60px;
        &:first-child {
            padding-left: 0;
        }
        &:last-child {
            padding-right: 0;
        }
    }
`;

const Metrics = styled(Column)`
    max-width: 460px;
    padding: 0;
    @media (min-width: 768px) {
        padding: 0;
    }
`;

const Title = styled.h1`
    font-size: 46px;
    line-height: 1.2;
    font-weight: 300;
    margin-bottom: 20px;
    display: none;
    @media (min-width: 768px) {
        font-size: 50px;
        display: block;
    }
`;

const FiguresList = styled.ol`
    display: flex;
    flex-wrap: wrap;
    padding-top: 15px;
    margin-right: -15px;
`;

const Figure = styled.li`
    background-color: ${colors.white};
    padding: 20px;
    margin-right: 15px;
    margin-bottom: 15px;
    width: calc(50% - 15px);
`;

const FigureTitle = styled.span`
    display: block;
    font-size: 17px;
    line-height: 1.35;
    color: #999999;
    margin-bottom: 5px;
`;

const FigureNumber = styled.span`
    display: block;
    font-feature-settings: 'tnum' on, 'lnum' on;
    font-size: 28px;
    line-height: 1.35;
`;

export const DashboardHero: React.FC<DashboardHeroProps> = props => {
    const { } = props;

    const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);

    return (
        <Wrapper>
            <Inner>
                <Row>
                    <Column>
                        Left
                    </Column>
                    <Metrics>
                    <Tabs isLight={true}>
                        <Tab
                            isSelected={selectedTabIndex === 0}
                            onClick={() => setSelectedTabIndex(0)}
                            isLight={true}
                        >
                            Current Epoch
                        </Tab>
                        <Tab
                            isSelected={selectedTabIndex === 1}
                            onClick={() => setSelectedTabIndex(1)}
                            isLight={true}
                        >
                            All Time
                        </Tab>
                    </Tabs>
                    <FiguresList>
                        <Figure>
                            <FigureTitle>Total volume</FigureTitle>
                            <FigureNumber>1.23M USD</FigureNumber>
                        </Figure>
                        <Figure>
                            <FigureTitle>ZRX Staked</FigureTitle>
                            <FigureNumber>1,288,229</FigureNumber>
                        </Figure>
                        <Figure>
                            <FigureTitle>Fees Generated</FigureTitle>
                            <FigureNumber>.000023 ETH</FigureNumber>
                        </Figure>
                        <Figure>
                            <FigureTitle>Rewards generated</FigureTitle>
                            <FigureNumber>.000023 ETH</FigureNumber>
                        </Figure>
                    </FiguresList>
                    </Metrics>
                </Row>
            </Inner>
        </Wrapper>
    );
};
