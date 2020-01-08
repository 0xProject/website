import { addDays, format, formatDistanceStrict } from 'date-fns';
import * as React from 'react';
import styled from 'styled-components';

import { Timeline } from 'ts/components/staking/wizard/timeline';

import { colors } from 'ts/style/colors';
import { formatEther, formatZrx } from 'ts/utils/format_number';

import { AllTimeStats, Epoch } from 'ts/types';

const PLACEHOLDER = '—';

export interface ConfirmationWizardInfo {
    nextEpochStats: Epoch | undefined;
}

export interface WizardInfoProps {
    currentEpochStats: Epoch | undefined;
    allTimeStats: AllTimeStats | undefined;
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

const TokenApprovalHeader = styled.h1`
    font-size: 36px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 30px;
    text-align: center;

    @media (min-width: 480px) {
        text-align: left;
        max-width: 435px;
    }

    @media (min-width: 768px) {
        font-size: 50px;
    }
`;

const TokenApprovalDescription = styled.h2`
    font-size: 18px;
    font-weight: 300;
    color: ${colors.textDarkSecondary};
    line-height: 1.44;
    margin-bottom: 30px;
    text-align: center;

    @media (min-width: 480px) {
        max-width: 435px;
        text-align: left;
    }

    @media (min-width: 768px) {
        margin-bottom: 60px;
    }
`;

export const TokenApprovalInfo: React.FC<{}> = () => {
    return (
        <>
            <TokenApprovalHeader>You need to let us use your tokens</TokenApprovalHeader>
            <TokenApprovalDescription>
                In order to stake you ZRX tokens you must first grant permissions to the 0x Staking Proxy contract. This
                will allow the contract to transfer the ZRX tokens you decide to stake, and start earning rewards.
            </TokenApprovalDescription>
        </>
    );
};

export const IntroWizardInfo: React.FC<WizardInfoProps> = ({ currentEpochStats, allTimeStats }) => {
    return (
        <>
            <>
                <IntroHeader>Start staking your tokens</IntroHeader>
                <IntroDescription>
                    Use one pool of capital across multiple relayers to trade against a large group.
                </IntroDescription>
            </>
            <IntroMetrics>
                <IntroMetric>
                    <h2>
                        {allTimeStats ? formatEther(allTimeStats.totalRewardsPaidInEth).minimized : PLACEHOLDER} ETH
                    </h2>
                    <p>Total rewards distributed</p>
                </IntroMetric>
                <IntroMetric>
                    <h2>{currentEpochStats ? formatZrx(currentEpochStats.zrxStaked).formatted : PLACEHOLDER} ZRX</h2>
                    <p>Total ZRX Staked</p>
                </IntroMetric>
            </IntroMetrics>
        </>
    );
};

export const ConfirmationWizardInfo: React.FC<ConfirmationWizardInfo> = ({ nextEpochStats }) => {
    const stakingStartsEpochDate = new Date(nextEpochStats ? nextEpochStats.epochStart.timestamp : null);
    const ESTIMATED_EPOCH_LENGTH_IN_DAYS = 10;
    const firstRewardsEpochDate = addDays(stakingStartsEpochDate, ESTIMATED_EPOCH_LENGTH_IN_DAYS);

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
            <>
                <IntroHeader>Confirmation</IntroHeader>
                <IntroDescription>Here's a recap of what is going to happen once you stake.</IntroDescription>
            </>
            <Timeline
                activeItemIndex={0}
                items={[
                    {
                        date: nowFormattedDate,
                        fromNow: nowFormattedTime,
                        title: 'Locking your ZRX',
                        description: 'Your ZRX are safely transferred to the staking contracts.',
                        isActive: true,
                    },
                    {
                        date: stakingStartsFormattedDate,
                        fromNow: stakingStartsFormattedTime,
                        title: 'Staking starts',
                        description:
                            'You start collecting rewards with the staking pool, based on their trading activity and total stake.',
                        isActive: false,
                    },
                    {
                        date: firstRewardsFormattedDate,
                        fromNow: firstRewardsFormattedTime,
                        title: 'First rewards available',
                        description:
                            'You are able to collect your first rewards, available in the account section. Keep your stake to continue getting rewards.',
                        isActive: false,
                    },
                ]}
            />
        </>
    );
};
