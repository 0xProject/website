import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import { StartRegistrationInfo, RegistrationSuccessInfo } from 'ts/components/governance/wizard_info';
import { VotingPowerInput, RegistrationSuccess } from 'ts/components/governance/wizard_flow';
import { VotingPowerWizardInfo } from 'ts/components/staking/wizard/wizard_info';
import { VotingPowerConfirmation } from 'ts/components/staking/wizard/wizard_flow';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { useStake } from 'ts/hooks/use_stake';
import { useRegisterWizard, RegisterRouterSteps } from 'ts/hooks/use_register_wizard';
import { State } from 'ts/redux/reducer';
import { AccountReady, EpochWithFees, Pool, PoolWithStats, ProviderState, StakingPoolRecomendation } from 'ts/types';
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

export const RegisterWizard: React.FC<IRegisterWizardProps> = (props) => {
  const { providerState, onOpenConnectWalletDialog } = props;
  const networkId = useSelector((state: State) => state.networkId);
  const stake = useStake(networkId, providerState);
  const apiClient = useAPIClient(networkId);
  const { currentStep, next } = useRegisterWizard();
  const [nextEpochStart, setNextEpochStart] = React.useState<Date | undefined>(undefined);
  const [stakingPools, setStakingPools] = React.useState<PoolWithStats[]>(undefined);
  const [selectedPool, setSelectedPool] = React.useState<StakingPoolRecomendation>();

  const { zrxBalanceBaseUnitAmount, address } = providerState.account as AccountReady;
  let zrxBalance: BigNumber | undefined;
  if (zrxBalanceBaseUnitAmount) {
      zrxBalance = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
  }

  let roundedZrxBalance;
  if(zrxBalance) {
      roundedZrxBalance = formatZrx(zrxBalance).roundedValue;
  }

  React.useEffect(() => {
    const fetchDelegatorData = async () => {
      const [epochsResponse, poolsResponse] = await Promise.all([
        apiClient.getStakingEpochsWithFeesAsync(),
        apiClient.getStakingPoolsAsync()
      ]);

      const epochStart = epochsResponse.nextEpoch && new Date(epochsResponse.nextEpoch.epochStart.timestamp);
      setNextEpochStart(epochStart);
      setStakingPools(poolsResponse.stakingPools);
    }
    fetchDelegatorData();
  }, []);

  const onNextButtonClick = (isDelegationFlow: boolean, selectedPool: PoolWithStats, zrxAmount: number) => {
    if(isDelegationFlow) {
      setSelectedPool({
        pool: selectedPool,
        zrxAmount,
      });
      next(RegisterRouterSteps.VotingPower)
    } else {
      next(RegisterRouterSteps.Success)
    }
  }

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
                  <VotingPowerConfirmation selectedStakingPools={selectedPool ? [selectedPool] : []}
                    providerState={providerState}
                    onGoToNextStep={() => next(RegisterRouterSteps.Success)}
                  />
                }
                {
                  currentStep === RegisterRouterSteps.Success &&
                  <RegistrationSuccess nextEpochStart={nextEpochStart} />
                }
              </>
            }
          />
        </Container>
    </StakingPageLayout>
  )
}