import * as _ from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { State } from 'ts/redux/reducer';

import { Button } from 'ts/components/button';
import { CFLMetrics } from 'ts/pages/cfl/cfl_metrics';

import { StakingConfirmationDialog } from 'ts/components/dialogs/staking_confirmation_dialog';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { StakingPoolDetailRow } from 'ts/components/staking/staking_pool_detail_row';

import { StakingHero } from 'ts/components/staking/hero';
import { Heading } from 'ts/components/text';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { PoolWithStats, ScreenWidths, WebsitePaths } from 'ts/types';

const sortByProtocolFeesDesc = (a: PoolWithStats, b: PoolWithStats) => {
    return b.currentEpochStats.totalProtocolFeesGeneratedInEth - a.currentEpochStats.totalProtocolFeesGeneratedInEth;
};

export interface StakingIndexProps {}
export const StakingIndex: React.FC<StakingIndexProps> = props => {
    const [isStakingConfirmationOpen, setStakingConfirmationOpen] = React.useState(false);
    const [stakingPools, setStakingPools] = React.useState<PoolWithStats[] | undefined>(undefined);
    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);

    React.useEffect(() => {
        const fetchAndSetPoolsAsync = async () => {
            const resp = await apiClient.getStakingPoolsAsync();
            setStakingPools(resp.stakingPools);
        };
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetPoolsAsync();
    }, [apiClient]);

    const sortedStakingPools: PoolWithStats[] | undefined = React.useMemo(() => {
        if (!stakingPools) {
            return undefined;
        }
        return [...stakingPools.sort(sortByProtocolFeesDesc)];
    }, [stakingPools]);

    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <StakingConfirmationDialog
                isOpen={isStakingConfirmationOpen}
                onDismiss={() => setStakingConfirmationOpen(false)}
            />
            <StakingHero
                title="Start staking your ZRX tokens"
                titleMobile="Start staking your tokens"
                description="Use one pool of capital across multiple relayers to trade against a large group"
                figure={<CFLMetrics />}
                videoId="-UMhhM5z7cc"
                actions={
                    <Button to={WebsitePaths.StakingWizard} isInline={true} color={colors.white}>
                        Get Started
                    </Button>}
            />
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
                                name={pool.metaData.name || `Staking Pool #${pool.poolId}`}
                                thumbnailUrl={pool.metaData.logoUrl}
                                isVerified={pool.metaData.isVerified}
                                address={pool.operatorAddress}
                                totalFeesGeneratedInEth={pool.currentEpochStats.totalProtocolFeesGeneratedInEth}
                                stakeRatio={pool.nextEpochStats.approximateStakeRatio}
                                rewardsSharedRatio={1 - pool.nextEpochStats.operatorShare}
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

    & + & {
        margin-top: 90px;
    }
`;
