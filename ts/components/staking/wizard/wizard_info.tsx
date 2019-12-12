import { addDays, format, formatDistanceStrict } from 'date-fns';
import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';
import { Epoch, UserStakingChoice } from 'ts/types';

import { Timeline } from 'ts/components/staking/wizard/timeline';

export interface WizardInfoProps {
    selectedStakingPools: UserStakingChoice[] | undefined;
    currentEpochStats: Epoch | undefined;
    nextEpochStats: Epoch | undefined;
}

const IntroHeader = styled.h1`
    font-size: 36px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 15px;
    text-align: center;

    @media (min-width: 480px) {
        text-align: left;
    }

    @media (min-width: 768px) {
        font-size: 50px;
    }
`;

const IntroDescription = styled.h2`
    font-size: 18px;
    font-weight: 300;
    color: ${colors.textDarkSecondary};
    line-height: 1.44;
    margin-bottom: 30px;
    text-align: center;

    @media (min-width: 480px) {
        max-width: 340px;
        text-align: left;
    }

    @media (min-width: 768px) {
        margin-bottom: 60px;
    }
`;

const IntroMetrics = styled.ul`
    display: block;
    padding-top: 30px;
    position: relative;

    @media (min-width: 480px) {
        padding-top: 60px;

        &:before {
            position: absolute;
            height: 1px;
            width: 100%;
            max-width: 340px;
            background-color: #e3e3e3;
            top: 0;
            left: 0;
            content: '';
        }
    }
`;

const IntroMetric = styled.li`
    display: block;
    text-align: center;
    margin-bottom: 15px;

    @media (min-width: 480px) {
        text-align: left;
        display: inline-block;
        width: 50%;
    }

    h2 {
        font-size: 28px;
        line-height: 1.35;
        margin-bottom: 7px;

        @media (min-width: 480px) {
            font-size: 34px;
            line-height: 1.23;
            margin-bottom: 15px;
        }
    }

    p {
        font-size: 17px;
        line-height: 1.44;
        font-weight: 300;
        color: ${colors.textDarkSecondary};

        @media (min-width: 480px) {
            font-size: 18px;
        }
    }
`;

export interface WizardInfoHeaderProps {
    title: string;
    description: string;
}

const WizardInfoHeader: React.FC<WizardInfoHeaderProps> = ({title, description}) => (
    <>
        <IntroHeader>{title}</IntroHeader>
        <IntroDescription>
            {description}
        </IntroDescription>
    </>
);

export const WizardInfo: React.FC<WizardInfoProps> = ({ selectedStakingPools, currentEpochStats, nextEpochStats }) => {
    if (!selectedStakingPools) {
        return (
            <>
                <WizardInfoHeader title="Start staking your tokens" description="Use one pool of capital across multiple relayers to trade against a large group."/>
                <IntroMetrics>
                    <IntroMetric>
                        <h2>873,435 ETH</h2>
                        <p>Total rewards collected</p>
                    </IntroMetric>
                    <IntroMetric>
                        <h2>203,000 ZRX</h2>
                        <p>Total ZRX Staked</p>
                    </IntroMetric>
                </IntroMetrics>
            </>
        );
    }

    const stakingStartsEpochDate = new Date(currentEpochStats.epochStart.timestamp);
    const firstRewardsEpochDate = new Date(nextEpochStats.epochStart.timestamp);

    const now = new Date();
    const DATE_FORMAT = 'MM.dd';
    const nowFormattedDate = format(now, DATE_FORMAT);
    const nowFormattedTime = 'Now';

    const stakingStartsFormattedTime = formatDistanceStrict(now, stakingStartsEpochDate);
    const stakingStartsFormattedDate = format(stakingStartsEpochDate, DATE_FORMAT);

    const firstRewardsFormattedTime = formatDistanceStrict(now, firstRewardsEpochDate);
    const firstRewardsFormattedDate = format(firstRewardsEpochDate, DATE_FORMAT);

    return (
        <>
        <WizardInfoHeader title="Confirmation" description="Use one pool of capital across multiple relayers to trade against a large group."/>
        <Timeline
            activeItemIndex={0}
            items={[
                {
                    date: nowFormattedDate,
                    fromNow: nowFormattedTime,
                    title: 'Locking your ZRX',
                    description: 'Your declared staking pool is going to be locked in smart contract.',
                    isActive: true,
                },
                {
                    date: stakingStartsFormattedDate,
                    fromNow: stakingStartsFormattedTime,
                    title: 'Staking starts',
                    description:
                        'Your staking pool is included in the Market Maker score along with voting power.',
                    isActive: false,
                },
                {
                    date: firstRewardsFormattedDate,
                    fromNow: firstRewardsFormattedTime,
                    title: 'First rewards',
                    description:
                        'You are going to receive first rewards, at this point you can opt out without consequences.',
                    isActive: false,
                },
            ]}
        />
        </>
    );
};
