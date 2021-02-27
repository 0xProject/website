import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RegistrationSuccess, VotingPowerInput } from 'ts/components/governance/wizard_flow';
import { RegistrationSuccessInfo, StartRegistrationInfo } from 'ts/components/governance/wizard_info';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import { StartStaking, VotingPowerConfirmation } from 'ts/components/staking/wizard/wizard_flow';
import { ConfirmationWizardInfo, VotingPowerWizardInfo } from 'ts/components/staking/wizard/wizard_info';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { useStake } from 'ts/hooks/use_stake';
import { RegisterRouterSteps, useRegisterWizard } from 'ts/hooks/use_register_wizard';
import { State } from 'ts/redux/reducer';
import { AccountReady, Epoch, PoolWithStats, ProviderState, StakingPoolRecomendation } from 'ts/types';
import { DEFAULT_POOL_ID } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { formatZrx } from 'ts/utils/format_number';

interface IRegisterWizardProps {
  providerState: ProviderState;
  onOpenConnectWalletDialog: () => void;
}

const Container = styled.div`
    max-width: 1390px;
    margin: 0 auto;
    position: relative;
`;

export const RegisterWizard: React.FC<IRegisterWizardProps> = props => {
  const { providerState, onOpenConnectWalletDialog } = props;
  const networkId = useSelector((state: State) => state.networkId);
  const apiClient = useAPIClient(networkId);
  const { currentStep, next } = useRegisterWizard();
  const [nextEpochStart, setNextEpochStart] = React.useState<Date | undefined>(undefined);
  const [stakingPools, setStakingPools] = React.useState<PoolWithStats[]>(undefined);
  const [selectedPool, setSelectedPool] = React.useState<StakingPoolRecomendation>({ pool: undefined, zrxAmount: undefined});
  const [nextEpochStats, setNextEpochStats] = React.useState<Epoch | undefined>(undefined);
  const stake = useStake(networkId, providerState);

  const { zrxBalanceBaseUnitAmount, address } = providerState.account as AccountReady;
  let zrxBalance: BigNumber | undefined;
  if (zrxBalanceBaseUnitAmount) {
      zrxBalance = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
  }

  let roundedZrxBalance;
  if (zrxBalance) {
      roundedZrxBalance = formatZrx(zrxBalance).roundedValue;
  }

  React.useEffect(() => {
    // tslint:disable-next-line: no-floating-promises
    (async () => {
      const [epochsResponse, poolsResponse] = await Promise.all([
        apiClient.getStakingEpochsWithFeesAsync(),
        apiClient.getStakingPoolsAsync(),
      ]);

      const epochStart = epochsResponse.nextEpoch && new Date(epochsResponse.nextEpoch.epochStart.timestamp);
      setNextEpochStats(epochsResponse.nextEpoch);
      setNextEpochStart(epochStart);
      setStakingPools(poolsResponse.stakingPools);
    })();
  }, []);

  const onNextButtonClick = async (isDelegationFlow: boolean, pool: PoolWithStats, zrxAmount: number) => {
    if (isDelegationFlow) {
      setSelectedPool({
        pool,
        zrxAmount,
      });
      next(RegisterRouterSteps.VotingPower);
    } else {
      try {
        await stake.depositAndStake(
          [{
            poolId: DEFAULT_POOL_ID,
            zrxAmount,
          }],
        );
        next(RegisterRouterSteps.Success);
      } catch(error) {
        console.log(error);
      }
    }
  };

  return (
    <StakingPageLayout isHome={false} title="Register to Vote">
        <Container>
          <Splitview
            leftComponent={
              <>
                {
                  currentStep === RegisterRouterSteps.Start &&
                  <StartRegistrationInfo />
                }
                {
                  currentStep === RegisterRouterSteps.VotingPower &&
                  <VotingPowerWizardInfo />
                }
                {currentStep === RegisterRouterSteps.ReadyToStake && (
                  <ConfirmationWizardInfo nextEpochStats={nextEpochStats} />
                )}
                {
                  currentStep === RegisterRouterSteps.Success &&
                  <RegistrationSuccessInfo />
                }
              </>
            }
            rightComponent={
              <>
                {
                  currentStep === RegisterRouterSteps.Start &&
                  <VotingPowerInput
                    userZRXBalance={roundedZrxBalance}
                    onOpenConnectWalletDialog={onOpenConnectWalletDialog}
                    address={address}
                    onNextButtonClick={onNextButtonClick}
                    stakingPools={stakingPools}
                    nextEpochStart={nextEpochStart}
                  />
                }
                {
                  currentStep === RegisterRouterSteps.VotingPower &&
                  <VotingPowerConfirmation
                    selectedStakingPools={selectedPool ? [selectedPool] : []}
                    providerState={providerState}
                    onGoToNextStep={() => next(RegisterRouterSteps.ReadyToStake)}
                  />
                }
                {currentStep === RegisterRouterSteps.ReadyToStake && (
                  <StartStaking
                      stake={stake}
                      nextEpochStats={nextEpochStats}
                      providerState={providerState}
                      selectedStakingPools={[selectedPool]}
                  />
                )}
                {
                  currentStep === RegisterRouterSteps.Success &&
                  <RegistrationSuccess nextEpochStart={nextEpochStart} />
                }
              </>
            }
          />
        </Container>
    </StakingPageLayout>
  );
};
