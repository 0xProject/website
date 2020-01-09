import { logUtils } from '@0x/utils';
import * as _ from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { State } from 'ts/redux/reducer';

import { Button } from 'ts/components/button';
import { CFLMetrics } from 'ts/pages/cfl/cfl_metrics';

import { CurrentEpochOverview } from 'ts/components/staking/current_epoch_overview';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { StakingPoolDetailRow } from 'ts/components/staking/staking_pool_detail_row';

import { StakingHero } from 'ts/components/staking/hero';
import { Heading } from 'ts/components/text';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { useStake } from 'ts/hooks/use_stake';
import { errorReporter } from 'ts/utils/error_reporter';
import { stakingUtils } from 'ts/utils/staking_utils';

import { Epoch, PoolWithStats, ScreenWidths, WebsitePaths } from 'ts/types';

const sortByProtocolFeesDesc = (a: PoolWithStats, b: PoolWithStats) => {
    return b.currentEpochStats.totalProtocolFeesGeneratedInEth - a.currentEpochStats.totalProtocolFeesGeneratedInEth;
};

export interface StakingIndexProps {}
export const StakingIndex: React.FC<StakingIndexProps> = () => {
    const [stakingPools, setStakingPools] = React.useState<PoolWithStats[] | undefined>(undefined);
    const networkId = useSelector((state: State) => state.networkId);
    const providerState = useSelector((state: State) => state.providerState);

    const apiClient = useAPIClient(networkId);
    const { currentEpochRewards } = useStake(networkId, providerState);

    const [nextEpochStats, setNextEpochStats] = React.useState<Epoch | undefined>(undefined);
    const [currentEpochStats, setCurrentEpochStats] = React.useState<Epoch | undefined>(undefined);

    React.useEffect(() => {
        const fetchAndSetPoolsAsync = async () => {
            const poolsResponse = await apiClient.getStakingPoolsAsync();
            const activePools = (poolsResponse.stakingPools || []).filter(stakingUtils.isPoolActive);
            setStakingPools(activePools);
        };
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetPoolsAsync();
    }, [networkId, apiClient]);

    const sortedStakingPools: PoolWithStats[] | undefined = React.useMemo(() => {
        if (!stakingPools) {
            return undefined;
        }
        return [...stakingPools.sort(sortByProtocolFeesDesc)];
    }, [stakingPools]);

    // TODO(kimpers): centralize data fetching so we only fetch once
    React.useEffect(() => {
        const fetchAndSetEpochs = async () => {
            try {
                const epochsResponse = await apiClient.getStakingEpochsAsync();
                setNextEpochStats(epochsResponse.nextEpoch);
                setCurrentEpochStats(epochsResponse.currentEpoch);
            } catch (err) {
                logUtils.warn(err);
                setNextEpochStats(undefined);
                setCurrentEpochStats(undefined);
                errorReporter.report(err);
            }
        };
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetEpochs();
    }, [networkId, apiClient]);

    // Current epoch ends right before next one starts
    const currentEpochEndDate = nextEpochStats && new Date(nextEpochStats.epochStart.timestamp);

    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <StakingHero
                title={
                    <div>
                        Earn liquidity
                        <br />
                        rewards with ZRX
                    </div>
                }
                titleMobile="Earn liquidity rewards with ZRX"
                description={
                    <div>
                        Put your ZRX to work by staking
                        <br />
                        with 0x market makers to earn rewards.
                    </div>
                }
                figure={<CFLMetrics />}
                videoId="qP_oZAjRkTs"
                actions={
                    <Button to={WebsitePaths.StakingWizard} isInline={true} color={colors.white}>
                        Get Started
                    </Button>}
            />
            <SectionWrapper>
                <CurrentEpochOverview
                    zrxStaked={currentEpochStats && currentEpochStats.zrxStaked}
                    currentEpochEndDate={currentEpochEndDate}
                    currentEpochRewards={currentEpochRewards}
                    numMarketMakers={stakingPools && stakingPools.length}
                />
            </SectionWrapper>
            <SectionWrapper>
                <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                    Staking Pools
                </Heading>
                {sortedStakingPools &&
                    sortedStakingPools.map(pool => {
                        return (
                            <StakingPoolDetailRow
                                to={_.replace(WebsitePaths.StakingPool, ':poolId', pool.poolId)}
                                key={pool.poolId}
                                poolId={pool.poolId}
                                name={stakingUtils.getPoolDisplayName(pool)}
                                thumbnailUrl={pool.metaData.logoUrl}
                                isVerified={pool.metaData.isVerified}
                                address={pool.operatorAddress}
                                totalFeesGeneratedInEth={pool.currentEpochStats.totalProtocolFeesGeneratedInEth}
                                stakeRatio={pool.currentEpochStats.approximateStakeRatio}
                                rewardsSharedRatio={1 - pool.currentEpochStats.operatorShare}
                            />
                        );
                    })}
            </SectionWrapper>
        </StakingPageLayout>
    );
};

const SectionWrapper = styled.div`
    width: calc(100% - 100px);
    max-width: 1228px;
    margin: 0 auto;
    padding: 40px;

    @media (max-width: ${ScreenWidths.Lg}rem) {
        width: calc(100% - 20px);
        padding: 20px;
    }
`;
