import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Progressbar } from 'ts/components/progressbar';
import { Tab, Tabs } from 'ts/components/tabs';
import CheckmarkThin from 'ts/icons/illustrations/checkmark-thin.svg';

import { colors } from 'ts/style/colors';

interface DashboardHeroProps {

}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

const Wrapper = styled.div<WrapperProps>`
    margin-bottom: 40px;
    @media (min-width: 768px) {
        padding: 60px 30px;
    }
`;

const Inner = styled.div<InnerProps>`
    background-color: ${colors.backgroundLightGrey};
    padding: 20px;
    @media (min-width: 768px) {
        padding: 60px 30px;
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

const PoolIcon = styled.div`
    width: 60px;
    height: 60px;
    background-color: ${colors.white};
    margin-bottom: 23px;
`;

const Title = styled.h1`
    font-size: 34px;
    line-height: 1.35;
    margin-bottom: 15px;
`;

const HorizontalList = styled.ul`
    font-size: 17px;
    font-weight: 300;
    color: #5C5C5C;
    margin-bottom: 40px;
    a {
        color: ${colors.brandLight};
    }
    & > li {
        display: inline-block;
        line-height: 1;
        position: relative;
        margin-right: 30px;
        &:first-child {
            &:before {
                display: none;
            }
        }
        &:before {
            content: '';
            position: absolute;
            top: 50%;
            left: -15px;
            margin-top: -4px;
            border-radius: 50%;
            background-color: #D7D7D7;
            width: 4px;
            height: 4px;
        }
    }
`;

const ButtonContainer = styled.div`
    max-width: 330px;
`;

const StakingButton = styled(Button)`
    padding: 100px;
    margin-bottom: 15px;
`;

const ProgressbarText = styled.span`
    display: block;
    font-size: 15px;
    color: #5C5C5C;
    line-height: 1.2;
    margin-top: 7px;
`;

export const DashboardHero: React.FC<DashboardHeroProps> = props => {
    const { } = props;

    const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);

    return (
        <Wrapper>
            <Inner>
                <Row>
                    <Column>
                        <PoolIcon />
                        <Title>Binance Staking Pool <CheckmarkThin /></Title>
                        <HorizontalList>
                            <li>0x1234...1234</li>
                            <li>mywebsite.com</li>
                            <li><a href="">75% Rewards Shared</a></li>
                        </HorizontalList>
                        <ButtonContainer>
                            <StakingButton href="/" isInline={true} color={colors.white}>
                                Start Staking
                            </StakingButton>
                            <Progressbar progress={75} />
                            <ProgressbarText>74% estimated stake for next epoch</ProgressbarText>
                        </ButtonContainer>
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
