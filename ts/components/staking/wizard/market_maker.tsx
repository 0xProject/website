import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { Progressbar } from 'ts/components/progressbar';
import { InfoTooltip } from 'ts/components/ui/info_tooltip';
import { generateUniqueId, Jazzicon } from 'ts/components/ui/jazzicon';

import { colors } from 'ts/style/colors';

interface MarketMakerProps {
    name: string;
    iconUrl: string;
    poolId: string;
    operatorAddress: string;
    collectedFees: number;
    rewards: number;
    staked: number;
    website: string;
    difference: string | number;
}

const Container = styled.div`
    margin-bottom: 20px;
    border: 1px solid #DDDDDD;
    background-color: ${colors.white};
`;

const Heading = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    position: relative;
    flex: 1;

    @media (min-width: 768px) {
        border-bottom: 1px solid #DDDDDD;
        padding: 30px;
    }
`;

const MarketMakerIconContainer = styled.div`
    border: 1px solid #DDDDDD;
    display: block;
    margin-right: 20px;
    height: 60px;
    width: 60px;
`;

const MarketMakerIcon = styled.img`
    display: block;
    height: 60px;
    width: 60px;
`;

const Title = styled.h3`
    font-size: 18px;
    line-height: 1.34;
    margin-right: 5px;

    @media (min-width: 768px) {
        font-size: 22px;
    }
`;

const Metrics = styled.ul`
    display: flex;
    padding: 15px;
    background-color: ${colors.backgroundLightGrey};

    @media (min-width: 768px) {
        padding: 20px;
        background-color: ${colors.white};
    }
`;

const Metric = styled.li`
    flex: 1;
    position: relative;
    border-left: 1px solid #DDDDDD;
    text-align: center;

    &:first-child {
        padding-left: 0;
        border-left: 0;
    }

    @media (min-width: 768px) {
        text-align: left    ;
        padding: 8px 0 8px 30px;
    }
`;

const MetricTitle = styled.h4`
    font-size: 11px;
    line-height: 1.2;
    color: ${colors.textDarkSecondary};
    margin-bottom: 6px;

    @media (min-width: 768px) {
        margin-bottom: 8px;
        font-size: 14px;
        max-width: 85px;
    }

    @media (min-width: 1200px) {
        max-width: 100%;
    }
`;

const MetricAmount = styled.h5`
    font-size: 14px;
    line-height: 1.2;

    @media (min-width: 768px) {
        font-size: 18px;
    }
`;

const StyledInfoTooltip = styled(InfoTooltip)`
    position: absolute;
    top: 7px;
    right: 15px;
    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`;

const Difference = styled.span`
    position: absolute;
    top: 20px;
    right: 20px;
    color: ${colors.brandLight};
    font-size: 14px;

    display: none;

    @media (min-width: 768px) {
        display: block;
    }
`;

const CheckIcon = styled(Icon)`
    display: inline-block;

    @media (min-width: 768px) {
        display: none;
    }
`;

const Website = styled.a`
    font-size: 11px;
    display: block;
    font-weight: 300;
    line-height: 1.34;
    color: ${colors.textDarkSecondary};

    @media (min-width: 768px) {
        display: none;
    }
`;

const TitleContainer = styled.div`
`;

const LeftSideContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    flex-basis: 280px;
`;

const RightSideContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: 194px;
    min-width: 138px;
`;

const DeclaredStakeText = styled.div`
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 8px;
    font-weight: 300;
    color: ${colors.textDarkSecondary};
`;

const StakeAmountText = styled.div`
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 6px;
    /* disables zero strikethroughs */
    font-feature-settings: normal;
    color: ${colors.black};
`;

export const MarketMaker: React.FC<MarketMakerProps> = props => {
    const { name, operatorAddress, poolId, collectedFees, rewards, staked, difference, iconUrl, website } = props;

    return (
        <Container>
            <Heading>
                <LeftSideContainer>
                    <MarketMakerIconContainer>
                        {iconUrl
                            ?  <MarketMakerIcon src={iconUrl} alt={name} />
                            : <Jazzicon seed={generateUniqueId(operatorAddress, poolId)} diameter={60} isSquare={true} />
                        }
                    </MarketMakerIconContainer>
                    <TitleContainer>
                        <Title>{name} <CheckIcon name="checkmark" size={15} /></Title>
                        <Website href={website} target="_blank">{website}</Website>
                    </TitleContainer>
                </LeftSideContainer>
                <RightSideContainer>
                    <DeclaredStakeText>Declared stake (50%)</DeclaredStakeText>
                    <StakeAmountText>+500,000 ZRX</StakeAmountText>
                    <Progressbar progress={0.7} />
                </RightSideContainer>
                {/* <Difference>+{difference} ZRX</Difference> */}
            </Heading>
            {/* <Metrics>
                <Metric>
                    <MetricTitle>Collected fees</MetricTitle>
                    <MetricAmount>{collectedFees} ETH</MetricAmount>
                    <StyledInfoTooltip id="fees">
                        The fees the pool has collected in the current epoch
                    </StyledInfoTooltip>
                </Metric>
                <Metric>
                    <MetricTitle>Rewards</MetricTitle>
                    <MetricAmount>{Math.round(rewards * 100)}%</MetricAmount>
                    <StyledInfoTooltip id="rewards">
                        The percent of rewards the pool is sharing with stakers
                    </StyledInfoTooltip>
                </Metric>
                <Metric>
                    <MetricTitle>Staked</MetricTitle>
                    <MetricAmount>{Math.round(staked * 100)}%</MetricAmount>
                    <StyledInfoTooltip id="staked">
                        An approximation for how fully staked the pool is for the upcoming epoch
                    </StyledInfoTooltip>
                </Metric>
            </Metrics> */}
        </Container>
    );
};
