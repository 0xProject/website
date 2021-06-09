import * as React from 'react';
import styled from 'styled-components';
import { Progressbar } from 'ts/components/progressbar';
import { stakingUtils } from 'ts/utils/staking_utils';

import { BigNumber } from '@0x/utils';

import { differenceInSeconds } from 'date-fns';

import { formatEther, formatZrx } from 'ts/utils/format_number';

import { colors } from 'ts/style/colors';

interface StakingHeroProps {
    title: string | React.ReactNode;
    titleMobile: string | React.ReactNode;
    description: string | React.ReactNode;
    figure: React.ReactNode;
    actions: React.ReactNode;
    videoId?: string;
    videoChannel?: string;
    videoRatio?: string;
    youtubeOptions?: any;
    metrics?: {
        zrxStaked: number;
        currentEpochRewards: BigNumber;
        nextEpochStartDate: Date;
    };
}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

const ProgressbarText = styled.span`
    display: block;
    font-size: 15px;
    color: #5c5c5c;
    line-height: 1.2;
    margin-top: 8px;
`;

const Wrapper = styled.div<WrapperProps>`
    width: 100%;
    text-align: center;
    @media (min-width: 768px) {
        padding: 30px;
        text-align: left;
    }
`;

const Inner = styled.div<InnerProps>`
    background-color: #f3f6f4;
    background-image: url(/images/stakingGraphic.svg);
    background-repeat: no-repeat;
    background-position-x: right;
    background-position-y: center;
    @media (min-width: 768px) {
        padding: 30px;
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
        & > * {
        }
    }
`;

const Column = styled.div`
    padding: 30px;
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

const TitleMobile = styled(Title)`
    display: block;
    @media (min-width: 768px) {
        display: none;
    }
`;

const Description = styled.h2`
    font-size: 18px;
    line-height: 1.45;
    font-weight: 300;
    margin-bottom: 30px;
    color: ${colors.textDarkSecondary};
`;

const Actions = styled.div`
    & > * {
        margin-right: 13px;
        margin-bottom: 10px;
    }
`;

const MetricsWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const FiguresList = styled.ol`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-top: 15px;
    width: 250px;
`;

const Figure = styled.li`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    background-color: ${colors.white};
    padding: 10px;
    margin-bottom: 15px;
    @media (min-width: 480px) {
        padding: 20px;
    }
`;

const FigureHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
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

const FiguresListHeader = styled.h2``;

export const StakingHero: React.FC<StakingHeroProps> = (props) => {
    const {
        title,
        titleMobile,
        description,
        actions,

        metrics,
    } = props;

    const progressAmt = (differenceInSeconds(metrics.nextEpochStartDate, Date.now()) * 100) / 604800;
    return (
        <Wrapper>
            <Inner>
                <Row>
                    <Column>
                        <Title>{title}</Title>
                        <TitleMobile>{titleMobile}</TitleMobile>
                        <Description>{description}</Description>
                        <Actions>{actions}</Actions>
                    </Column>
                    <Column>
                        <MetricsWrapper>
                            <FiguresListHeader>Epoch Stats</FiguresListHeader>
                            <FiguresList>
                                <Figure key={1}>
                                    <FigureHeader>
                                        <FigureTitle>Rewards (Weekly)</FigureTitle>
                                    </FigureHeader>
                                    <FigureNumber>
                                        {metrics.currentEpochRewards
                                            ? formatEther(metrics.currentEpochRewards, { decimals: 2 }).full
                                            : '-'}
                                    </FigureNumber>
                                </Figure>
                                <Figure key={2}>
                                    <FigureHeader>
                                        <FigureTitle>Total ZRX Staked</FigureTitle>
                                    </FigureHeader>
                                    <FigureNumber>
                                        {metrics.zrxStaked
                                            ? formatZrx(metrics.zrxStaked, { bigUnitPostfix: true }).formatted
                                            : '-'}
                                    </FigureNumber>
                                </Figure>
                                <ProgressbarText>
                                    Next rewards in {stakingUtils.getEpochCountdown(metrics.nextEpochStartDate)}
                                </ProgressbarText>
                                <Progressbar progress={100 - progressAmt} />
                            </FiguresList>
                        </MetricsWrapper>
                    </Column>
                </Row>
            </Inner>
        </Wrapper>
    );
};

StakingHero.defaultProps = {
    videoChannel: 'youtube',
    videoRatio: '21:9',
};
