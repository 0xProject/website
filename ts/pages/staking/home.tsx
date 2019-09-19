import * as React from 'react';

import { Button } from 'ts/components/button';
import { StakingHero } from 'ts/components/staking/hero';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { CFLMetrics } from 'ts/pages/cfl/cfl_metrics';

import { colors } from 'ts/style/colors';

export interface StakingIndexProps {}

export const StakingIndex: React.FC<StakingIndexProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <StakingHero
                title="Start staking your ZRX tokens"
                titleMobile="Start staking your tokens"
                description="Use one pool of capital across multiple relayers to trade against a large group"
                figure={<CFLMetrics />}
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
        </StakingPageLayout>
    );
};
