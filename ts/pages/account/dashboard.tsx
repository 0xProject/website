import * as _ from 'lodash';
import * as React from 'react';
import * as ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { CallToAction } from 'ts/components/call_to_action';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading } from 'ts/components/text';
import { StatFigure } from 'ts/components/ui/stat_figure';
import { AccountActivitySummary } from 'ts/pages/account/account_activity_summary';
import { AccountApplyModal } from 'ts/pages/account/account_apply_modal';
import { AccountDetail } from 'ts/pages/account/account_detail';
import { AccountFigure } from 'ts/pages/account/account_figure';
import { AccountStakeOverview } from 'ts/pages/account/account_stake_overview';
import { AccountVote } from 'ts/pages/account/account_vote';
import { colors } from 'ts/style/colors';

export interface AccountProps {}

// Mock data: not sure how this would be designed from a backend perspective,
// but I think this gives an overview of what the components take in as props
const MOCK_DATA = {
    activitySummary: {
        title: '500 ZRX will be removed from Binance Pool in 10 days',
        subtitle: 'Your tokens will need to be manually withdrawn once they are removed ',
        avatarSrc: 'https://static.cryptotips.eu/wp-content/uploads/2019/05/binance-bnb-logo.png',
        icon: 'clock',
    },
    stakes: [
        {
            title: 'Binance Staking Pool',
            subtitle: 'https://binance.com',
            avatarSrc: 'https://static.cryptotips.eu/wp-content/uploads/2019/05/binance-bnb-logo.png',
            rewards: '95%',
            fees: '0.03212 ETH',
            staked: '52%',
            userData: {
                amount: 213425,
                rewards: 0.0342,
            },
            timeRemaining: '5 days', // Maybe this would be in another format and need a convert method in the component
        },
        {
            title: 'Coinbase Staking Pool',
            subtitle: 'https://coinbase.com',
            avatarSrc: 'https://static.cryptotips.eu/wp-content/uploads/2019/05/binance-bnb-logo.png',
            rewards: '23%',
            fees: '0.00236 ETH',
            staked: '12%',
            userData: {
                amount: 12345,
                rewards: 0.01134,
            },
            timeRemaining: '14 days', // Maybe this would be in another format and need a convert method in the component
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
    const [isApplyModalOpen, toggleApplyModal] = React.useState(false);

    return (
        <StakingPageLayout title="0x Staking | Account">
            <HeaderWrapper>
                <Inner>
                    <AccountDetail
                        accountAddress="0x123451234512345"
                        avatarSrc="https://static.cryptotips.eu/wp-content/uploads/2019/05/binance-bnb-logo.png"
                    />

                    <Figures>
                        <AccountFigure
                            label="Wallet balance"
                            headerComponent={() => (
                                <div data-tip={true} data-for="walletBalance">
                                    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.7">
                                            <path d="M3.61176 0.888889C3.61176 1.10367 3.43765 1.27778 3.22287 1.27778C3.0081 1.27778 2.83398 1.10367 2.83398 0.888889C2.83398 0.674111 3.0081 0.5 3.22287 0.5C3.43765 0.5 3.61176 0.674111 3.61176 0.888889Z" fill="white" stroke="#5C5C5C"/>
                                            <path d="M1 4.88867H3.66667V11.9998" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M1 12H6.33333" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                    </svg>

                                    <ReactTooltip id="walletBalance">
                                        This is the amount available for delegation starting in the next Epoch
                                    </ReactTooltip>
                                </div>
                            )}
                        >
                            21,000,000 ZRX
                        </AccountFigure>

                        <AccountFigure
                            label="Staked balance"
                            headerComponent={() => (
                                <div data-tip={true} data-for="walletBalance">
                                    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.7">
                                            <path d="M3.61176 0.888889C3.61176 1.10367 3.43765 1.27778 3.22287 1.27778C3.0081 1.27778 2.83398 1.10367 2.83398 0.888889C2.83398 0.674111 3.0081 0.5 3.22287 0.5C3.43765 0.5 3.61176 0.674111 3.61176 0.888889Z" fill="white" stroke="#5C5C5C"/>
                                            <path d="M1 4.88867H3.66667V11.9998" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M1 12H6.33333" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                    </svg>

                                    <ReactTooltip id="walletBalance">
                                        This is the amount available for delegation starting in the next Epoch
                                    </ReactTooltip>
                                </div>
                            )}
                        >
                            1,322,000 ZRX
                        </AccountFigure>

                        <AccountFigure
                            label="Rewards"
                            headerComponent={() => (
                                <Button
                                    isWithArrow={true}
                                    isTransparent={true}
                                    fontSize="17px"
                                    color={colors.brandLight}
                                >
                                    Withdraw
                                </Button>
                            )}
                        >
                            .000213 ETH
                        </AccountFigure>

                        {/* <FigureItem>
                            <header>
                                Staked Balance

                                <button>
                                    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.7">
                                            <path d="M3.61176 0.888889C3.61176 1.10367 3.43765 1.27778 3.22287 1.27778C3.0081 1.27778 2.83398 1.10367 2.83398 0.888889C2.83398 0.674111 3.0081 0.5 3.22287 0.5C3.43765 0.5 3.61176 0.674111 3.61176 0.888889Z" fill="white" stroke="#5C5C5C"/>
                                            <path d="M1 4.88867H3.66667V11.9998" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M1 12H6.33333" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                    </svg>
                                </button>
                            </header>

                            1,322,000 ZRX
                        </FigureItem> */}
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

                    <Button
                        isWithArrow={true}
                        isTransparent={true}
                        to="/account/activity"
                    >
                        Show all activity
                    </Button>
                </SectionHeader>

                <AccountActivitySummary
                    title={MOCK_DATA.activitySummary.title}
                    subtitle={MOCK_DATA.activitySummary.subtitle}
                    avatarSrc={MOCK_DATA.activitySummary.avatarSrc}
                    icon={MOCK_DATA.activitySummary.icon}
                >
                    <StatFigure
                        label="Withdraw date"
                        value="9/19/29"
                    />
                </AccountActivitySummary>

                <AccountActivitySummary
                    title="Your ZRX is unlocked and ready for withdrawal"
                    subtitle="6,000 ZRX  →  0x12345...12345"
                    avatarSrc={MOCK_DATA.activitySummary.avatarSrc}
                    icon="check"
                >
                    <Button
                        to="/"
                        color={colors.brandLight}
                        bgColor={colors.white}
                        fontSize="17px"
                        fontWeight="300"
                        padding="15px 35px"
                    >
                        Withdraw ZRX
                    </Button>
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

                    <Button
                        isWithArrow={true}
                        isTransparent={true}
                        onClick={() => toggleApplyModal(true)}
                    >
                        Apply to create a staking pool
                    </Button>
                </SectionHeader>

                <CallToAction
                    icon="revenue"
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

            <AccountApplyModal
                isOpen={isApplyModalOpen}
                onDismiss={() => toggleApplyModal(false)}
            />
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
    @media (max-width: 1200px) {
        padding-top: 24px;
    }

    @media (min-width: 768px) {
        display: flex;
    }
`;

const FigureItem = styled.div`
    background-color: #fff;
    padding: 20px;
    width: 252px;
    height: 94px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 20px;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 17px;
        color: #999;
        font-weight: 200;
    }

    button {
        border: 0;
        font-size: 17px;
        font-weight: 200;

        svg {
            height: 13px;
        }
    }

    @media (min-width: 768px) {
        & + & {
            margin-left: 12px;
        }
    }

    @media (max-width: 768px) {
        width: 100%;
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

    @media (max-width: 768px) {
        h3 {
            font-size: 28px;
        }

        a, button {
            display: none;
        }
    }
`;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;
