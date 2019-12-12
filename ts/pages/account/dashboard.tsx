import { BigNumber, hexUtils, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { CallToAction } from 'ts/components/call_to_action';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading } from 'ts/components/text';
import { InfoTooltip } from 'ts/components/ui/info_tooltip';
import { StatFigure } from 'ts/components/ui/stat_figure';
import { AccountActivitySummary } from 'ts/pages/account/account_activity_summary';
import { AccountApplyModal } from 'ts/pages/account/account_apply_modal';
import { AccountDetail } from 'ts/pages/account/account_detail';
import { AccountFigure } from 'ts/pages/account/account_figure';
import { AccountStakeOverview } from 'ts/pages/account/account_stake_overview';
import { AccountVote } from 'ts/pages/account/account_vote';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { AccountReady, StakingAPIDelegatorResponse, WebsitePaths } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

import { useAPIClient } from 'ts/hooks/use_api_client';
import { useStake } from 'ts/hooks/use_stake';

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
            name: 'Binance Staking Pool',
            websiteUrl: 'https://binance.com',
            logoUrl: 'https://static.cryptotips.eu/wp-content/uploads/2019/05/binance-bnb-logo.png',
            rewardsShared: '95%',
            feesGenerated: '0.03212 ETH',
            totalStaked: '52%',
            userData: {
                amountInEth: 213425,
                rewardsReceived: 0.0342,
            },
            isVerified: true,
            approximateTimestamp: 778435, // Maybe this would be in another format and need a convert method in the component
        },
    ],
    voteHistory: [
        {
            title: 'StaticCallAssetProxy',
            zeip: 39,
            vote: 'yes',
            summary:
                'This ZEIP adds support for trading arbitrary bundles of assets to 0x protocol. Historically, only a single asset could be traded per each....',
        },
        {
            title: 'AssetProxy',
            zeip: 40,
            vote: 'no',
            summary:
                'This ZEIP adds support for trading arbitrary bundles of assets to 0x protocol. Historically, only a single asset could be traded per each....',
        },
        {
            title: 'TestVoteTitle',
            zeip: 41,
            vote: 'yes',
            summary:
                'This ZEIP adds support for trading arbitrary bundles of assets to 0x protocol. Historically, only a single asset could be traded per each....',
        },
    ],
};

interface AvailableZrxBalanceProps {
    account?: AccountReady;
    delegatorData?: StakingAPIDelegatorResponse;
}

const AvailableZrxBalance = ({ account, delegatorData }: AvailableZrxBalanceProps) => {
    let availableBalance: BigNumber = new BigNumber(0);
    if (account && account.zrxBalanceBaseUnitAmount) {
        availableBalance = account.zrxBalanceBaseUnitAmount;
    }

    if (delegatorData) {
        const depositedBalance = new BigNumber(delegatorData.forCurrentEpoch.zrxDeposited).shiftedBy(
            constants.DECIMAL_PLACES_ZRX,
        );
        availableBalance = availableBalance.plus(depositedBalance);
    }

    return <span>{`${utils.getFormattedAmount(availableBalance, constants.DECIMAL_PLACES_ZRX)} ZRX`}</span>;
};

interface DelegatorDataProps {
    delegatorData?: StakingAPIDelegatorResponse;
}

const StakedZrxBalance = ({ delegatorData }: DelegatorDataProps) => {
    let balance = new BigNumber(0);

    if (delegatorData) {
        balance = new BigNumber(delegatorData.forCurrentEpoch.zrxStaked);
    }

    return <span>{`${utils.getFormattedUnitAmount(balance)} ZRX`}</span>;
};

interface PoolToRewardsMap {
    [key: string]: BigNumber;
}
interface PoolReward {
    poolId: string;
    rewardsInEth: BigNumber;
}

// NOTE: TESTING ONLY! REMOVE THIS BEFORE MERGING
const ADDRESS_OVERRIDE = '0xe36ea790bc9d7ab70c55260c66d52b1eca985f84';

export const Account: React.FC<AccountProps> = () => {
    const [isApplyModalOpen, toggleApplyModal] = React.useState(false);
    const [isFetchingDelegatorData, setIsFetchingDelegatorData] = React.useState<boolean>(false);
    const [delegatorData, setDelegatorData] = React.useState<StakingAPIDelegatorResponse | undefined>(undefined);
    const [availableRewardsMap, setAvailableRewardsMap] = React.useState<PoolToRewardsMap>({});
    const [totalAvailableRewards, setTotalAvailableRewards] = React.useState<BigNumber>(new BigNumber(0));

    const apiClient = useAPIClient();
    const { stakingContract } = useStake();
    const account = useSelector((state: State) => state.providerState.account as AccountReady);

    React.useEffect(() => {
        const fetchDelegatorData = async () => {
            const response = await apiClient.getDelegatorAsync(ADDRESS_OVERRIDE);
            setDelegatorData(response);
        };

        if (!account.address || isFetchingDelegatorData) {
            return;
        }

        setIsFetchingDelegatorData(true);
        fetchDelegatorData()
            .then(() => {
                setIsFetchingDelegatorData(false);
            })
            .catch((err: Error) => {
                setDelegatorData(undefined);
                setIsFetchingDelegatorData(false);
                logUtils.warn(err);
            });
    }, [account.address, apiClient.networkId]);

    React.useEffect(() => {
        const fetchAvailableRewards = async () => {
            const poolsWithAllTimeRewards = delegatorData.allTime.poolData.filter(
                poolData => poolData.rewardsInEth > 0,
            );
            const poolRewards: PoolReward[] = await Promise.all(
                poolsWithAllTimeRewards.map(async poolData => {
                    const paddedHexPoolId = hexUtils.leftPad(hexUtils.toHex(poolData.poolId));

                    const availableRewardInEth = await stakingContract
                        .computeRewardBalanceOfDelegator(paddedHexPoolId, ADDRESS_OVERRIDE)
                        .callAsync();

                    // TODO(kimpers): There is some typing issue here, circle back later to remove the BigNumber conversion
                    return {
                        poolId: poolData.poolId,
                        rewardsInEth: Web3Wrapper.toUnitAmount(
                            new BigNumber(availableRewardInEth.toString()),
                            constants.DECIMAL_PLACES_ETH,
                        ),
                    };
                }),
            );

            const _availableRewardsMap: PoolToRewardsMap = poolRewards.reduce<PoolToRewardsMap>(
                (memo: PoolToRewardsMap, poolReward: PoolReward) => {
                    memo[poolReward.poolId] = poolReward.rewardsInEth;

                    return memo;
                },
                {},
            );

            const _totalAvailableRewards = poolRewards.reduce(
                (memo: BigNumber, poolReward: PoolReward) => memo.plus(poolReward.rewardsInEth),
                new BigNumber(0),
            );

            setAvailableRewardsMap(_availableRewardsMap);
            setTotalAvailableRewards(_totalAvailableRewards);
        };

        if (!stakingContract || !delegatorData || !account.address) {
            return;
        }

        fetchAvailableRewards().catch((err: Error) => {
            setTotalAvailableRewards(new BigNumber(0));
            logUtils.warn(err);
        });
    }, [stakingContract, delegatorData, account.address]);

    return (
        <StakingPageLayout title="0x Staking | Account">
            <HeaderWrapper>
                <Inner>
                    {account && account.address && <AccountDetail userEthAddress={account.address} />}

                    <Figures>
                        <AccountFigure
                            label="Available balance"
                            headerComponent={() => (
                                <InfoTooltip id="available-balance">
                                    This is the amount available for delegation starting in the next Epoch
                                </InfoTooltip>
                            )}
                        >
                            <AvailableZrxBalance account={account} delegatorData={delegatorData} />
                        </AccountFigure>

                        <AccountFigure
                            label="Staked balance"
                            headerComponent={() => (
                                <InfoTooltip id="staked-balance">
                                    This is the amount currently delegated to a pool
                                </InfoTooltip>
                            )}
                        >
                            <StakedZrxBalance delegatorData={delegatorData} />
                        </AccountFigure>

                        <AccountFigure
                            label="Rewards"
                            headerComponent={() => {
                                if (totalAvailableRewards.gt(0)) {
                                    return (
                                        <Button
                                            isWithArrow={true}
                                            isTransparent={true}
                                            fontSize="17px"
                                            color={colors.brandLight}
                                        >
                                            Withdraw
                                        </Button>
                                    );
                                }

                                return null;
                            }}
                        >
                            <span>{`${utils.getFormattedUnitAmount(totalAvailableRewards)} ETH`}</span>
                        </AccountFigure>
                    </Figures>
                </Inner>
            </HeaderWrapper>

            <SectionWrapper>
                <SectionHeader>
                    <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                        Activity
                    </Heading>

                    <Button
                        color={colors.brandDark}
                        isWithArrow={true}
                        isTransparent={true}
                        to={WebsitePaths.AccountActivity}
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
                    <StatFigure label="Withdraw date" value="9/19/29" />
                </AccountActivitySummary>

                <AccountActivitySummary
                    title="Your ZRX is unlocked and ready for withdrawal"
                    subtitle="6,000 ZRX  →  0x12345...12345"
                    avatarSrc={MOCK_DATA.activitySummary.avatarSrc}
                    icon="checkmark"
                >
                    <Button
                        to="/"
                        color={colors.brandLight}
                        bgColor={colors.white}
                        borderColor={colors.border}
                        fontSize="17px"
                        fontWeight="300"
                        padding="15px 35px"
                        isFullWidth={true}
                    >
                        Withdraw ZRX
                    </Button>
                </AccountActivitySummary>
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>
                    <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                        Your staking pools
                    </Heading>

                    <Button
                        color={colors.brandDark}
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
                    return <AccountStakeOverview key={`stake-${index}`} {...item} />;
                })}
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>
                    <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
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

            <AccountApplyModal isOpen={isApplyModalOpen} onDismiss={() => toggleApplyModal(false)} />
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

        a,
        button {
            display: none;
        }
    }
`;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;
