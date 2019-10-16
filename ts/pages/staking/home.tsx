import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { Button } from 'ts/components/button';
import { CFLMetrics } from 'ts/pages/cfl/cfl_metrics';

import { StakingConfirmationDialog } from 'ts/components/dialogs/staking_confirmation_dialog';
import { ModalConnect } from 'ts/components/modals/modal_connect';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { StakingPoolDetailRow } from 'ts/components/staking/staking_pool_detail_row';

import { ScreenWidths } from 'ts/types';

import { StakingHero } from 'ts/components/staking/hero';
import { Heading } from 'ts/components/text';

const stakingPools = [
  {
    id: '29n5c290cn0cc2943cn239',
    name: 'Staking 01',
    thumbnailUrl: 'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg',
    feesCollectedEth: 0.03281,
    stakingPercent: 2000,
    rewardsSharePercent: 100,
    location: '234 CALIFORNIA'
  },
  {
    id: '29n5c290cn0cc2943cn230',
    name: 'Staking 02',
    thumbnailUrl: 'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg',
    feesCollectedEth: 0.03281,
    stakingPercent: 2000,
    rewardsSharePercent: 100,
    location: '234 CALIFORNIA'
  },
  {
    id: '29n5c290cn0cc2943cn240',
    name: 'Staking 03',
    thumbnailUrl: 'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg',
    feesCollectedEth: 0.03281,
    stakingPercent: 2000,
    rewardsSharePercent: 100,
    location: '234 CALIFORNIA'
  }
]

export interface StakingIndexProps {}
export const StakingIndex: React.FC<StakingIndexProps> = props => {
    const [isStakingConfirmationOpen, toggleStakingConfirmation] = React.useState(false);
    const [isModalConnectOpen, toggleModalConnect] = React.useState(false);
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <StakingConfirmationDialog
              isOpen={isStakingConfirmationOpen}
              onDismiss={() => toggleStakingConfirmation(false)}
            />

            <ModalConnect
              isOpen={isModalConnectOpen}
              onDismiss={() => toggleModalConnect(false)}
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
                  Staking Pools
              </Heading>
              {stakingPools.map(({ id, name, thumbnailUrl, feesCollectedEth, stakingPercent, rewardsSharePercent, location }) => {
                  return (
                    <StakingPoolDetailRow
                      key={id}
                      name={name}
                      thumbnailUrl={thumbnailUrl}
                      totalFeesGeneratedInEth={feesCollectedEth}
                      totalZrxStaked={stakingPercent}
                      rewardsSharePercent={rewardsSharePercent}
                      location={location}
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
