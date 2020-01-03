import { stringify } from 'query-string';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Progressbar } from 'ts/components/progressbar';
import { Tab, Tabs } from 'ts/components/tabs';
import { generateUniqueId, Jazzicon } from 'ts/components/ui/jazzicon';
import CheckmarkThin from 'ts/icons/illustrations/checkmark-thin.svg';
import Checkmark from 'ts/icons/illustrations/checkmark.svg';

import { colors } from 'ts/style/colors';

import { WebsitePaths } from 'ts/types';
import { formatPercent } from 'ts/utils/format_number';
import { utils } from 'ts/utils/utils';

interface Metrics {
    title: string;
    number: string;
}

interface DashBoardHeroTabs {
    title: string;
    metrics: Metrics[];
}

interface DashboardHeroProps {
    title: string;
    websiteUrl: string;
    poolId: string;
    operatorAddress: string;
    isVerified: boolean;
    estimatedStake: number;
    rewardsShared: number;
    iconUrl: string;
    tabs: DashBoardHeroTabs[];
}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

const Wrapper = styled.div<WrapperProps>`
    @media (min-width: 768px) {
        padding: 60px 30px 40px 30px;
    }
`;

const Inner = styled.div<InnerProps>`
    padding: 0;
    @media (min-width: 768px) {
        background-color: ${colors.backgroundLightGrey};
        padding: 60px 30px;
    }
`;

const Row = styled.div<RowProps>`
    max-width: 1152px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    @media (min-width: 768px) {
        align-items: center;
        flex-direction: row;
    }
`;

const Column = styled.div`
    padding: 30px 20px;
    &:first-child {
        background-color: ${colors.backgroundLightGrey};
    }
    @media (min-width: 768px) {
        width: 50%;
        /* padding: 60px; */
        padding: 0;
        &:first-child {
            padding-left: 0;
            background-color: none;
        }
        &:last-child {
            padding-right: 0;
        }
    }
`;

const Metrics = styled(Column)`
    padding: 30px 20px;
    @media (min-width: 768px) {
        max-width: 460px;
        padding: 0 0 0 20px;
    }
`;

const FiguresList = styled.ol`
    display: flex;
    flex-wrap: wrap;
    padding-top: 15px;
    margin-right: -20px;
`;

const Figure = styled.li`
    background-color: ${colors.white};
    padding: 10px;
    margin-right: 15px;
    margin-bottom: 15px;
    @media (min-width: 480px) {
        width: calc(50% - 15px);
        padding: 20px;
    }
`;

const FigureTitle = styled.span`
    display: block;
    font-size: 16px;
    line-height: 1.35;
    color: #999999;
    margin-bottom: 5px;
`;

const FigureNumber = styled.span`
    display: block;
    font-feature-settings: 'tnum' on, 'lnum' on;
    font-size: 20px;
    line-height: 1.35;
    @media (min-width: 768px) {
        font-size: 24px;
    }
    @media (min-width: 991px) {
        font-size: 28px;
    }
`;

const PoolIcon = styled.img`
    width: 60px;
    height: 60px;
    background-color: ${colors.white};
    margin-bottom: 23px;
    border: 1px solid #d9d9d9;
`;

const Title = styled.h1`
    font-size: 28px;
    line-height: 1.35;
    margin-bottom: 12px;
    @media (min-width: 768px) {
        font-size: 34px;
    }
`;

const HorizontalList = styled.ul`
    font-size: 17px;
    font-weight: 300;
    color: #5c5c5c;
    margin-bottom: 40px;
    a {
        color: ${colors.brandLight};
    }
    & > li {
        display: inline-block;
        line-height: 1.5;
        position: relative;
        margin-right: 15px;
        padding-left: 15px;
        &:first-child {
            padding-left: 0;
            &:before {
                display: none;
            }
        }
        &:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            margin-top: -4px;
            border-radius: 50%;
            background-color: #d7d7d7;
            width: 4px;
            height: 4px;
        }
    }
`;

const ButtonContainer = styled.div`
    @media (min-width: 768px) {
        max-width: 330px;
    }
`;

const StakingButton = styled(Button)`
    padding: 100px;
    margin-bottom: 15px;
`;

const ProgressbarText = styled.span`
    display: block;
    font-size: 15px;
    color: #5c5c5c;
    line-height: 1.2;
    margin-top: 8px;
`;

const CheckmarkThinDesktop = styled(CheckmarkThin)`
    display: none;
    @media (min-width: 768px) {
        display: inline-block;
    }
`;

const VerificationIndicator = styled.li`
    display: inline-block;
    @media (min-width: 768px) {
        display: none !important;
    }
`;

export const DashboardHero: React.FC<DashboardHeroProps> = ({
    title,
    tabs,
    poolId,
    operatorAddress,
    websiteUrl,
    isVerified,
    estimatedStake,
    rewardsShared,
    iconUrl,
}) => {
    const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);

    const selectedTab = tabs[selectedTabIndex];
    const metrics = selectedTab != null ? selectedTab.metrics : null;

    return (
        <Wrapper>
            <Inner>
                <Row>
                    <Column>
                    {
                        iconUrl
                            ? <PoolIcon src={iconUrl} />
                            : <Jazzicon
                                seed={generateUniqueId(operatorAddress, poolId)}
                                diameter={60}
                            />
                    }
                        <Title>
                            {title ? title : `Staking Pool #${poolId}`}{' '}
                            {isVerified && (
                                <span title="Identitity verified">
                                    <CheckmarkThinDesktop />
                                </span>
                            )}
                        </Title>
                        <HorizontalList>
                            <li>{utils.getAddressBeginAndEnd(operatorAddress)}</li>
                            {websiteUrl && <li>{websiteUrl}</li>}
                            <li>
                                <a href="">{formatPercent(rewardsShared).minimized}% Rewards Shared</a>
                            </li>
                            {isVerified && (
                                <VerificationIndicator>
                                    <a href="">
                                        <Checkmark /> Verified identity
                                    </a>
                                </VerificationIndicator>
                            )}
                        </HorizontalList>
                        <ButtonContainer>
                            <StakingButton
                                to={`${WebsitePaths.StakingWizard}?${stringify({ poolId })}`}
                                color={colors.white}
                                isFullWidth={true}
                                isLarge={true}
                            >
                                Start Staking
                            </StakingButton>
                            <Progressbar progress={estimatedStake} />
                            <ProgressbarText>{formatPercent(estimatedStake).minimized}% estimated stake for next epoch</ProgressbarText>
                        </ButtonContainer>
                    </Column>
                    <Metrics>
                        <Tabs isLight={true}>
                            {tabs.map((tab, index) => {
                                return (
                                    <Tab
                                        key={tab.title}
                                        isSelected={selectedTabIndex === index}
                                        onClick={() => setSelectedTabIndex(index)}
                                        isLight={true}
                                    >
                                        {tab.title}
                                    </Tab>
                                );
                            })}
                        </Tabs>
                        {metrics != null && (
                            <FiguresList>
                                {metrics.map(metric => {
                                    return (
                                        <Figure key={`${metric.title}${metric.number}`}>
                                            <FigureTitle>{metric.title}</FigureTitle>
                                            <FigureNumber>{metric.number}</FigureNumber>
                                        </Figure>
                                    );
                                })}
                            </FiguresList>
                        )}
                    </Metrics>
                </Row>
            </Inner>
        </Wrapper>
    );
};
