import { ChainId } from '@0x/contract-addresses';
import { addMilliseconds } from 'date-fns';
import { useEffect, useState } from 'react';

import { ProviderState } from 'ts/types';

import { useAllowance } from 'ts/hooks/use_allowance';
import { useStake } from 'ts/hooks/use_stake';

import { APIClient } from '../../../utils/api_client';

enum Steps {
    Initial,
    Confirm,
    WaitingForRemoval,
    WaitingForConfirmation,
    Done,
}

export interface Config {
    // stakingMode?: 'AUTO' | 'ADVANCED';
    networkId: ChainId;
    providerState: ProviderState;
}

const useStakingWizard = ({
    networkId,
    providerState,
}: Config) => {

    const [step, setStep] = useState<Steps>(Steps.Initial);

    const stake = useStake(networkId, providerState);
    const allowance = useAllowance();

    const [estimatedAllowanceTransactionFinishTime, setEstimatedAllowanceTransactionFinishTime] = useState<Date | undefined>(undefined);
    const [estimatedStakingTransactionFinishTime, setEstimatedStakingTransactionFinishTime] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (!stake.estimatedTimeMs) {
            return setEstimatedStakingTransactionFinishTime(undefined);
        }
        const estimate = addMilliseconds(new Date(), stake.estimatedTimeMs);
        setEstimatedStakingTransactionFinishTime(estimate);
    }, [stake.estimatedTimeMs]);

    useEffect(() => {
        if (!allowance.estimatedTimeMs) {
            return setEstimatedAllowanceTransactionFinishTime(undefined);
        }
        const estimate = addMilliseconds(new Date(), allowance.estimatedTimeMs);
        setEstimatedAllowanceTransactionFinishTime(estimate);
    }, [allowance.estimatedTimeMs]);

    return {
        stake,
        allowance,
        step,
        estimatedAllowanceTransactionFinishTime,
        estimatedStakingTransactionFinishTime,
    };
};

export {
    useStakingWizard,
};
