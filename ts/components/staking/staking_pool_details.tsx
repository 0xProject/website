import * as React from 'react';
import styled from 'styled-components';

const DetailsWrapper = styled.div`
    height: 120px;
    border: 1px solid #d9d9d9;
    display: flex;
    align-items: center
    padding: 0 20px;
    flex-wrap: wrap;

    @media (max-width: 1200px) {
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
`;

const PoolOverview = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 30px;

    @media (max-width: 1200px) {
        margin: 0;
    }
`;

const Heading = styled.span`
    font-size: 24px;
    line-height: 32px;
    font-feature-settings: 'tnum' on, 'lnum' on;

    @media (max-width: 1200px) {
        font-size: 20px;
        line-height: 27px;
    }
`;

const DetailsText = styled.span`
    font-size: 17px;
    line-height: 23px;
    color: #5c5c5c;
`;

const PerformanceSection = styled.div`
    display: flex;
    margin-left: auto;
    width: 448px;
    justify-content: space-around;

    @media (max-width: 1200px) {
        width: 100%;
        margin: 0;
    }
`;

const PoolPerformance = styled.div`
    display: flex;
    flex-direction: column;
    align-self: center;
    flex: 1;

    span:nth-of-type(1) {
        font-size: 14px;
        line-height: 17px;
        color: #5c5c5c;
    }

    span:nth-of-type(2) {
        font-size: 18px;
        line-height: 22px;
        @media (max-width: 1200px) {
            font-size: 17px;
        }
    }
`;

const VerticalDivider = styled.div`
    border-left: 1px solid #d9d9d9;
    height: 47px;
    margin-right: 20px;

    @media (max-width: 1200px) {
        margin-right: 27px;
    }
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

// TODO: proper types
interface IStakingPoolDetailsProps {
    name: string;
    thumbnailUrl?: string;
    ethAddress?: string;
    websiteUrl?: string;
    feesGeneratedEth?: number;
    stakingPercent?: number;
    rewardsSharePercent?: number;
}

const ShortAddress = ({ ethAddress }: { ethAddress: string }) => (
    <DetailsText>{`${ethAddress.slice(0, 6)}...${ethAddress.slice(
        ethAddress.length - 4,
        ethAddress.length,
    )}`}</DetailsText>
);

export const StakingPoolDetails: React.FC<IStakingPoolDetailsProps> = ({
    name,
    thumbnailUrl,
    ethAddress,
    websiteUrl,
    feesGeneratedEth,
    rewardsSharePercent,
    stakingPercent,
}) => {
    // TODO: implement
    const isMobile = true;
    return (
        <DetailsWrapper>
            {!isMobile && (
                <Logo>
                    <img src={thumbnailUrl} />
                </Logo>
            )}
            <PoolOverview>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Heading>{name}</Heading>
                    {!isMobile && <CheckMark />}
                </div>
                {!isMobile && (
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <ShortAddress ethAddress={ethAddress} />
                        <DetailsText>{websiteUrl}</DetailsText>
                    </div>
                )}
            </PoolOverview>
            <PerformanceSection>
                <PoolPerformance>
                    <span>Collected Fees</span>
                    <span>{feesGeneratedEth.toFixed(5)} ETH</span>
                </PoolPerformance>
                <VerticalDivider />
                <PoolPerformance>
                    <span>Rewards Shared</span>
                    <span>{Math.round(rewardsSharePercent)}%</span>
                </PoolPerformance>
                {!isMobile && (
                    <>
                        <VerticalDivider />
                        <PoolPerformance>
                            <span>Staked</span>
                            <span>{Math.round(stakingPercent)}%</span>
                        </PoolPerformance>
                    </>
                )}
            </PerformanceSection>
        </DetailsWrapper>
    );
};
