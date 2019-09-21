import { BigNumber } from '@0x/utils';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'ts/style/colors';
import { ScreenWidths } from 'ts/types';
import { configs } from 'ts/utils/configs';

const desktopOnlyStyle = css<{ cutOffRem?: number }>`
    @media (max-width: ${props => `${props.cutOffRem || ScreenWidths.Lg}rem`}) {
        display: none;
    }
`;

const DesktopOnlyWrapper = styled.div`
    display: flex;

    ${desktopOnlyStyle};
`;

const StakingPoolDetailsWrapper = styled.div`
    min-height: 120px;
    border: 1px solid #d9d9d9;
    display: flex;
    align-items: center
    padding: 0 20px;
    flex-wrap: wrap;
    max-width: 1152px;

    @media (max-width: ${ScreenWidths.Lg}rem) {
        font-size: 20px;
        line-height: 27px;
        align-items: center;
        padding: 20px;
    }
`;

const Logo = styled.div`
    border: 1px solid #d9d9d9;
    height: 80px;
    width: 80px;
    padding: 15px;

    ${desktopOnlyStyle}
`;

const PoolOverviewSection = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 30px;

    @media (max-width: ${ScreenWidths.Lg}rem) {
        margin: 0;
    }
`;

const Heading = styled.span`
    font-size: 24px;
    line-height: 32px;
    font-feature-settings: 'tnum' on, 'lnum' on;

    @media (max-width: ${ScreenWidths.Lg}rem) {
        font-size: 20px;
        line-height: 27px;
    }
`;

const DetailsText = styled.span`
    font-size: 17px;
    color: ${colors.textDarkSecondary};
`;

const PoolPerformanceSection = styled.div`
    display: flex;
    margin-left: auto;
    width: 448px;
    justify-content: space-around;

    @media (max-width: ${ScreenWidths.Lg}rem) {
        width: 100%;
        margin: 0;
    }
`;

const PoolPerformanceItem = styled.div<{ cutOffRem?: number }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    span:nth-of-type(1) {
        font-size: 14px;
        line-height: 17px;
        color: ${colors.textDarkSecondary};
    }

    span:nth-of-type(2) {
        font-size: 18px;
        line-height: 22px;
        @media (max-width: ${ScreenWidths.Lg}rem) {
            font-size: 17px;
        }
    }

    ${props => props.cutOffRem && desktopOnlyStyle}

    // Border
    & + & {
        border-left: 1px solid #d9d9d9;
        height: 47px;
        padding-left: 20px;
    }
`;

const Ellipse = styled.div`
    border-radius: 50%;
    width: 4px;
    height: 4px;
    background: ${colors.textDarkSecondary}
    opacity: 0.2;
    margin: 0 12px;
`;

const CheckMark = () => (
    <svg
        style={{ height: '22.5px', width: '22.5px', margin: '7.5px' }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 23.25C18.2132 23.25 23.25 18.2132 23.25 12C23.25 5.7868 18.2132 0.75 12 0.75C5.7868 0.75 0.75 5.7868 0.75 12C0.75 18.2132 5.7868 23.25 12 23.25Z"
            stroke="#00AE99"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M6.75 12.25L10.5 16L18 8.5"
            stroke="#00AE99"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
);

const RoundedPercentage = ({ percentage }: { percentage: number }) => <span>{Math.round(percentage)}%</span>;

const ShortenedEthAddress = ({ address }: { address: string }) => (
    <DetailsText>{`${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`}</DetailsText>
);

const PoolWebsiteLink = ({ websiteUrl }: { websiteUrl: string }) => (
    <a href={websiteUrl} style={{ textDecoration: 'none' }}>
        <DetailsText>{websiteUrl.replace(/(https:\/\/)?(www\.)?/, '')}</DetailsText>
    </a>
);

interface IStakingPoolDetailsProps {
    name: string;
    ethAddress: string;
    feesCollectedEth: BigNumber;
    stakingPercent: number;
    rewardsSharePercent: number;

    websiteUrl?: string;
    thumbnailUrl?: string;
}

export const StakingPoolDetails: React.FC<IStakingPoolDetailsProps> = ({
    name,
    thumbnailUrl,
    ethAddress,
    websiteUrl,
    feesCollectedEth,
    rewardsSharePercent,
    stakingPercent,
}) => (
    <StakingPoolDetailsWrapper>
        {thumbnailUrl && (
            <Logo>
                <img src={thumbnailUrl} />
            </Logo>
        )}
        <PoolOverviewSection>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Heading>{name}</Heading>
                <DesktopOnlyWrapper>
                    <CheckMark />
                </DesktopOnlyWrapper>
            </div>
            <DesktopOnlyWrapper style={{ height: '23px', alignItems: 'center' }}>
                <ShortenedEthAddress address={ethAddress} />
                {websiteUrl && (
                    <>
                        <Ellipse />
                        <PoolWebsiteLink websiteUrl={websiteUrl} />
                    </>
                )}
            </DesktopOnlyWrapper>
        </PoolOverviewSection>
        <PoolPerformanceSection>
            <PoolPerformanceItem>
                <span>Collected Fees</span>
                <span>{feesCollectedEth.toFixed(configs.AMOUNT_DISPLAY_PRECSION)} ETH</span>
            </PoolPerformanceItem>
            <PoolPerformanceItem>
                <span>Rewards Shared</span>
                <RoundedPercentage percentage={rewardsSharePercent} />
            </PoolPerformanceItem>
            <PoolPerformanceItem cutOffRem={ScreenWidths.Sm}>
                <span>Staked</span>
                <RoundedPercentage percentage={stakingPercent} />
            </PoolPerformanceItem>
        </PoolPerformanceSection>
    </StakingPoolDetailsWrapper>
);
