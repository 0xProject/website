import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { CallToAction } from 'ts/components/call_to_action';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading } from 'ts/components/text';
import { StatFigure } from 'ts/components/ui/stat_figure';
import { AccountActivitySummary } from 'ts/pages/account/account_activity_summary';
import { AccountDetail } from 'ts/pages/account/account_detail';
import { AccountStakeOverview } from 'ts/pages/account/account_stake_overview';
import { AccountVote } from 'ts/pages/account/account_vote';
import { colors } from 'ts/style/colors';

export interface AccountProps {}

const MOCK_DATA = {
    activitySummary: {
        title: '500 ZRX will be removed from Binance Pool in 10 days',
        subtitle: 'Your tokens will need to be manually withdrawn once they are removed ',
    },
    stakes: [
        {
            title: 'Binance Staking Pool',
            subtitle: 'https://binance.com',
            rewards: '95%',
            fees: '0.03212 ETH',
            staked: '52%',
            userData: {
                amount: 213425,
                rewards: 0.0342,
            },
            timeRemaining: '5 days',
        },
        {
            title: 'Coinbase Staking Pool',
            subtitle: 'https://coinbase.com',
            rewards: '23%',
            fees: '0.00236 ETH',
            staked: '12%',
            userData: {
                amount: 12345,
                rewards: 0.01134,
            },
            timeRemaining: '14 days',
        },
    ],
    voteHistory: [
        {
            title: 'StaticCallAssetProxy',
            zeip: 39,
            vote: 'yes',
            summary: 'This ZEIP adds support for trading arbitrary bundles of assets to 0x protocol. Historically, only a single asset could be traded per each....',
        },
        {
            title: 'AssetProxy',
            zeip: 40,
            vote: 'no',
            summary: 'This ZEIP adds support for trading arbitrary bundles of assets to 0x protocol. Historically, only a single asset could be traded per each....',
        },
        {
            title: 'TestVoteTitle',
            zeip: 41,
            vote: 'yes',
            summary: 'This ZEIP adds support for trading arbitrary bundles of assets to 0x protocol. Historically, only a single asset could be traded per each....',
        },
    ],
};

export const Account: React.FC<AccountProps> = () => {
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <HeaderWrapper>
                <Inner>
                    <AccountDetail
                        accountAddress="0x123451234512345"
                        avatarSrc=""
                    />

                    <Figures>
                        {/* Note: replace this with figures component */}
                        <div>Figure</div>
                        <div>Figure</div>
                        <div>Figure</div>
                    </Figures>
                </Inner>
            </HeaderWrapper>

            <SectionWrapper>
                <SectionHeader>
                    <Heading
                        asElement="h3"
                        fontWeight="400"
                        isNoMargin={true}
                    >
                        Activity
                    </Heading>

                    Show all activity
                </SectionHeader>

                <AccountActivitySummary
                    title={MOCK_DATA.activitySummary.title}
                    subtitle={MOCK_DATA.activitySummary.subtitle}
                >
                    <StatFigure
                        label="Withdraw date"
                        value="9/19/29"
                    />
                </AccountActivitySummary>
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>
                    <Heading
                        asElement="h3"
                        fontWeight="400"
                        isNoMargin={true}
                    >
                        Your staking pools
                    </Heading>

                    Apply to create a staking pool
                </SectionHeader>

                <CallToAction
                    icon="voting"
                    title="You haven't staked ZRX"
                    description="Start staking your ZRX and getting interest."
                    actions={[
                        {
                            label: 'Start staking',
                            onClick: () => null,
                        },
                    ]}
                />

                {_.map(MOCK_DATA.stakes, (item, index) => {
                    return (
                        <AccountStakeOverview
                            key={`stake-${index}`}
                            {...item}
                        />
                    );
                })}
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>
                    <Heading
                        asElement="h3"
                        fontWeight="400"
                        isNoMargin={true}
                    >
                        Your voting history
                    </Heading>
                </SectionHeader>

                <Grid>
                    {_.map(MOCK_DATA.voteHistory, item => {
                        return (
                            <AccountVote
                                title={item.title}
                                zeipId={item.zeip}
                                summary={item.summary}
                                vote={item.vote}
                            />
                        );
                    })}
                </Grid>
            </SectionWrapper>
        </StakingPageLayout>
    );
};

const HeaderWrapper = styled.div`
    width: 100%;
    max-width: 1500px;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 60px;

    @media (min-width: 768px) {
        padding: 30px;
        text-align: left;
    }
`;

const Inner = styled.div`
    @media (min-width: 1200px) {
        display: flex;
        justify-content: space-between;
    }

    @media (min-width: 768px) {
        padding: 60px;
        background-color: ${colors.backgroundLightGrey};
    }
`;

const Figures = styled.div`
    div {
        background-color: #fff;
        padding: 20px;
        width: 252px;
        height: 94px;
        text-align: left;
    }

    @media (max-width: 1200px) {
        padding-top: 24px;
    }

    @media (min-width: 768px) {
        display: flex;

        div + div {
            margin-left: 12px;
        }
    }
`;

const SectionWrapper = styled.div`
    width: calc(100% - 40px);
    max-width: 1152px;
    margin: 0 auto;

    & + & {
        margin-top: 90px;
    }
`;

const SectionHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;
