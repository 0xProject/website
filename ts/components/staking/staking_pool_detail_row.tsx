import * as React from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'ts/style/colors';
import { ScreenWidths } from 'ts/types';
import { configs } from 'ts/utils/configs';
import { utils } from 'ts/utils/utils';

import { CircleCheckMark } from 'ts/components/ui/circle_check_mark';
const RoundedPercentage = ({ percentage }: { percentage: number }) => <span>{Math.round(percentage)}%</span>;

const ShortenedEthAddress = ({ address }: { address: string }) => (
    <DetailsText>{utils.getAddressBeginAndEnd(address)}</DetailsText>
);

const PoolWebsiteLink = ({ websiteUrl }: { websiteUrl: string }) => (
    <a href={websiteUrl} style={{ textDecoration: 'none' }}>
        <DetailsText>{websiteUrl.replace(/(https:\/\/)?(www\.)?/, '')}</DetailsText>
    </a>
);

interface IStakingPoolDetailRowProps {
    name: string;
    address: string;
    totalFeesGeneratedInEth: number;
    stakeRatio: number;
    rewardsSharedRatio: number;
    isVerified: boolean;
    websiteUrl?: string;
    thumbnailUrl?: string;
}

export const StakingPoolDetailRow: React.FC<IStakingPoolDetailRowProps> = ({
    name,
    thumbnailUrl,
    address,
    websiteUrl,
    isVerified,
    totalFeesGeneratedInEth,
    rewardsSharedRatio,
    stakeRatio,
}) => (
    <StakingPoolDetailRowWrapper>
        {thumbnailUrl && (
            <Logo>
                <img src={thumbnailUrl} />
            </Logo>
        )}
        <PoolOverviewSection>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Heading>{name}</Heading>
                {isVerified &&
                    <DesktopOnlyWrapper style={{ margin: '7px' }}>
                        <CircleCheckMark width="22px" height="22px" />
                    </DesktopOnlyWrapper>
                }
            </div>
            <DesktopOnlyWrapper style={{ height: '23px', alignItems: 'center' }}>
                <ShortenedEthAddress address={address} />
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
                <span>{totalFeesGeneratedInEth.toFixed(configs.AMOUNT_DISPLAY_PRECSION)} ETH</span>
            </PoolPerformanceItem>
            <PoolPerformanceItem>
                <span>Rewards Shared</span>
                <RoundedPercentage percentage={rewardsSharedRatio * 100} />
            </PoolPerformanceItem>
            <PoolPerformanceItem cutOffRem={ScreenWidths.Sm}>
                <span>Staked</span>
                <RoundedPercentage percentage={stakeRatio * 100} />
            </PoolPerformanceItem>
        </PoolPerformanceSection>
    </StakingPoolDetailRowWrapper>
);

const desktopOnlyStyle = css<{ cutOffRem?: number }>`
    @media (max-width: ${props => `${props.cutOffRem || ScreenWidths.Lg}rem`}) {
        display: none;
    }
`;

const DesktopOnlyWrapper = styled.div`
    display: flex;

    ${desktopOnlyStyle};
`;

const StakingPoolDetailRowWrapper = styled.div`
    min-height: 120px;
    border: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    padding: 0 20px;
    flex-wrap: wrap;
    margin: auto;
    max-width: 1152px;
    margin-top: 20px;

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
    background: ${colors.textDarkSecondary};
    opacity: 0.2;
    margin: 0 12px;
`;
