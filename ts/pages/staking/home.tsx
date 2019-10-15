import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { Button } from 'ts/components/button';
import { CFLMetrics } from 'ts/pages/cfl/cfl_metrics';

import { StakingConfirmationDialog } from 'ts/components/dialogs/staking_confirmation_dialog';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { StakingPoolDetailRow } from 'ts/components/staking/staking_pool_detail_row';

import { ScreenWidths } from 'ts/types';

import { StakingHero } from 'ts/components/staking/hero';
import { Heading } from 'ts/components/text';

export interface StakingIndexProps {}
export const StakingIndex: React.FC<StakingIndexProps> = props => {
    const [isApplyModalOpen, toggleApplyModal] = React.useState(true);
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <StakingConfirmationDialog
              isOpen={isApplyModalOpen}
              onDismiss={() => toggleApplyModal(false)}
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
              <Heading
                  asElement="h3"
                  fontWeight="400"
                  isNoMargin={true}
              >
                  Your voting history
              </Heading>
              <StakingPoolDetailRow
                  name="Staking 01"
                  thumbnailUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
                  feesCollectedEth={0.03281}
                  stakingPercent={2000}
                  rewardsSharePercent={100}
                  ethAddress="234 CALIFORNIA"
              />
              <StakingPoolDetailRow
                  name="Staking 02"
                  thumbnailUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
                  feesCollectedEth={0.03281}
                  stakingPercent={2000}
                  rewardsSharePercent={100}
                  ethAddress="235 CALIFORNIA staking.com"
              />
              <StakingPoolDetailRow
                  name="Staking 03"
                  thumbnailUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
                  feesCollectedEth={0.03281}
                  stakingPercent={2000}
                  rewardsSharePercent={100}
                  ethAddress="236 CALIFORNIA"
              />
              <StakingPoolDetailRow
                  name="Staking 04"
                  thumbnailUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
                  feesCollectedEth={0.03281}
                  stakingPercent={2000}
                  rewardsSharePercent={100}
                  ethAddress="237 CALIFORNIA"
              />
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
