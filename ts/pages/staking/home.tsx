import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { Button } from 'ts/components/button';
import { CFLMetrics } from 'ts/pages/cfl/cfl_metrics';

import { StakingConfirmationDialog } from 'ts/components/dialogs/staking_confirmation_dialog';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { StakingPoolDetailRow } from 'ts/components/staking/staking_pool_detail_row';

import { StakingHero } from 'ts/components/staking/hero';
import { Heading } from 'ts/components/text';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { PoolWithStats, ScreenWidths } from 'ts/types';

export interface StakingIndexProps {}
export const StakingIndex: React.FC<StakingIndexProps> = props => {
    const [isStakingConfirmationOpen, toggleStakingConfirmation] = React.useState(false);
    const [stakingPools, setStakingPools] = React.useState<PoolWithStats[] | undefined>(undefined);
    const apiClient = useAPIClient();
    React.useEffect(() => {
        const fetchAndSetPoolsAsync = async () => {
            const resp = await apiClient.getStakingPoolsAsync();
            setStakingPools(resp.stakingPools);
        };
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetPoolsAsync();
    });
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <StakingConfirmationDialog
                isOpen={isStakingConfirmationOpen}
                onDismiss={() => toggleStakingConfirmation(false)}
            />
            <StakingHero
                title="Start staking your ZRX tokens"
                titleMobile="Start staking your tokens"
                description="Use one pool of capital across multiple relayers to trade against a large group"
                figure={<CFLMetrics />}
                // TODO(kimpers): Add correct video for staking portal
                videoId="c04eIt3FQ5I"
                actions={
                    <>
                        <Button href="/" isInline={true} color={colors.white}>
                            Get Started
                        </Button>
                        <Button
                            href="/"
                            isInline={true}
                            color={colors.brandLight}
                            isTransparent={true}
                            borderColor={colors.brandLight}
                        >
                            Learn more
                        </Button>
                    </>
                }
            />
            <SectionWrapper>
                <Heading asElement="h3" fontWeight="400" isNoMargin={true}>
                    Staking Pools
                </Heading>
                {stakingPools && stakingPools.map(
                    pool => {
                        return (
                            <StakingPoolDetailRow
                                key={pool.poolId}
                                name={pool.metaData.name}
                                thumbnailUrl={pool.metaData.logoUrl}
                                isVerified={pool.metaData.isVerified}
                                address={_.head(pool.nextEpochStats.makerAddresses)}
                                totalFeesGeneratedInEth={pool.currentEpochStats.protocolFeesGeneratedInEth}
                                stakeRatio={pool.nextEpochStats.stakeRatio}
                                rewardsSharedRatio={1 - pool.nextEpochStats.operatorShare}
                            />
                        );
                    },
                )}
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
