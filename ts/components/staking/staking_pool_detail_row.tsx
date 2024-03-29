import * as React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { colors } from 'ts/style/colors';
import { ScreenWidths } from 'ts/types';
import { utils } from 'ts/utils/utils';

import { CircleCheckMark } from 'ts/components/ui/circle_check_mark';
import { generateUniqueId, Jazzicon } from 'ts/components/ui/jazzicon';
import { formatEther, formatPercent } from 'ts/utils/format_number';

const StyledStatLabel = styled.div`
    position: relative;
    font-size: 18px;
    line-height: 22px;
    @media (max-width: ${ScreenWidths.Lg}rem) {
        font-size: 17px;
    }
`;

const ShortenedEthAddress = ({ address }: { address: string }) => (
    <DetailsText>{utils.getAddressBeginAndEnd(address)}</DetailsText>
);

const PoolWebsiteLink = ({ websiteUrl }: { websiteUrl: string }) => (
    <a href={websiteUrl} style={{ textDecoration: 'none' }}>
        <DetailsText>{websiteUrl.replace(/(https:\/\/)?(www\.)?/, '')}</DetailsText>
    </a>
);

interface IStakingPoolDetailRowProps {
    apy: number;
    name: string;
    address: string;
    totalFeesGeneratedInEth: number;
    stakeRatio: number;
    averageRewardsSharedInEth: number;
    isVerified: boolean;
    poolId: string;
    websiteUrl?: string;
    thumbnailUrl?: string;
    isFullSizeTumbnail?: boolean;
    to?: string;
}

export const StakingPoolDetailRow: React.FC<IStakingPoolDetailRowProps> = ({
    apy,
    name,
    poolId,
    thumbnailUrl,
    address,
    websiteUrl,
    isVerified,
    totalFeesGeneratedInEth,
    averageRewardsSharedInEth,
    stakeRatio,
    to,
    isFullSizeTumbnail,
}) => (
    <StakingPoolDetailRowWrapper as={to && Link} to={to}>
        {thumbnailUrl ? (
            <Logo isFullSizeThumbnail={isFullSizeTumbnail}>
                <img src={thumbnailUrl} />
            </Logo>
        ) : (
            <JazziconContainer>
                <Jazzicon diameter={80} seed={generateUniqueId(address, poolId)} isSquare={true} />
            </JazziconContainer>
        )}
        <PoolOverviewSection>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Heading hasHoverEffect={!!to}>{name}</Heading>
                {isVerified && (
                    <DesktopOnlyWrapper style={{ margin: '7px' }}>
                        <CircleCheckMark width="22px" height="22px" />
                    </DesktopOnlyWrapper>
                )}
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
            <PoolPerformanceItem style={{ width: '8rem' }}>
                <span>APR (12 week avg.)</span>
                <div>
                    <StyledStatLabel>
                        {Number(formatPercent(apy * 100 || 0, { decimals: 2 }).minimized).toFixed(2)}%
                    </StyledStatLabel>
                </div>
            </PoolPerformanceItem>
            <PoolPerformanceItem>
                <span>Fees generated</span>
                <span>{formatEther(totalFeesGeneratedInEth || 0, { decimals: 2 }).formatted} ETH</span>
            </PoolPerformanceItem>
            <PoolPerformanceItem style={{ flex: 'none' }}>
                <span>Saturation</span>
                <div>
                    <StyledStatLabel>
                        {Math.round(stakeRatio * 100)}%
                        <SaturationBar percentage={stakeRatio * 100} />
                    </StyledStatLabel>
                </div>
            </PoolPerformanceItem>
        </PoolPerformanceSection>
    </StakingPoolDetailRowWrapper>
);

const desktopOnlyStyle = css<{ cutOffRem?: number }>`
    @media (max-width: ${(props) => `${props.cutOffRem || ScreenWidths.Lg}rem`}) {
        display: none;
    }
`;

const DesktopOnlyWrapper = styled.div`
    display: flex;

    ${desktopOnlyStyle};
`;

const StakingPoolDetailRowWrapper = styled.div<{ to?: string }>`
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
    :hover,
    :active {
        border: ${(props) => (props.to ? '1px solid #B4B4B4' : 'inherit')};
    }
`;

const BaseLogoContainer = styled.div`
    border: 1px solid #d9d9d9;
    height: 80px;
    width: 80px;

    ${desktopOnlyStyle}
`;

const JazziconContainer = styled(BaseLogoContainer)``;

const Logo = styled(BaseLogoContainer)<{ isFullSizeThumbnail?: boolean }>`
    padding: ${(props) => (props.isFullSizeThumbnail ? 0 : 15)}px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PoolOverviewSection = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 30px;

    @media (max-width: ${ScreenWidths.Lg}rem) {
        margin: 0;
    }
`;

const Heading = styled.span<{ hasHoverEffect?: boolean }>`
    font-size: 24px;
    line-height: 32px;
    font-feature-settings: 'tnum' on, 'lnum' on;
    @media (max-width: ${ScreenWidths.Lg}rem) {
        font-size: 20px;
        line-height: 27px;
    }
    ${StakingPoolDetailRowWrapper}:hover & {
        color: ${(props) => (props.hasHoverEffect ? '#00AE99' : 'inherit')};
    }
    ${StakingPoolDetailRowWrapper}:active & {
        color: ${(props) => (props.hasHoverEffect ? '#00AE99' : 'inherit')};
    }
`;

const DetailsText = styled.span`
    font-size: 17px;
    color: ${colors.textDarkSecondary};
`;

const PoolPerformanceSection = styled.div`
    display: flex;
    margin-left: auto;
    width: auto;
    justify-content: flex-end;

    @media (max-width: ${ScreenWidths.Lg}rem) {
        width: 100%;
        margin: 0;
    }
`;

const PoolPerformanceItem = styled.div<{ cutOffRem?: number }>`
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;

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

    ${(props) => props.cutOffRem && desktopOnlyStyle}

    // Border
    & + & {
        border-left: 1px solid #d9d9d9;
        height: 47px;
        padding-left: 20px;
        padding-right: 20px;
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

const SaturationBarContainer = styled.div`
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 2px;
    max-width: 84px;
`;

const RedBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e71d36;
`;

const GreenBackground = styled(RedBackground)`
    background-color: #ace0dc;
`;

const GreenPercentageWidth = styled.div<{ percentage: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => props.percentage}%;
    bottom: 0;
    background-color: #00ae99;
`;

const SaturationBar: React.FC<{ percentage: number }> = ({ percentage }) => {
    return (
        <SaturationBarContainer>
            {percentage > 100 ? (
                <RedBackground />
            ) : (
                <GreenBackground>
                    <GreenPercentageWidth percentage={percentage} />
                </GreenBackground>
            )}
        </SaturationBarContainer>
    );
};
