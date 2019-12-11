import { ChainId } from '@0x/contract-addresses';
import { addMilliseconds } from 'date-fns';
import { useEffect, useState } from 'react';

import { useAllowance } from 'ts/hooks/use_allowance';
import { useStake } from 'ts/hooks/use_stake';

import { ProviderState } from 'ts/types';

export interface Config {
    networkId: ChainId;
    providerState: ProviderState;
}

const useStakingWizard = ({
    networkId,
    providerState,
}: Config) => {

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
        estimatedAllowanceTransactionFinishTime,
        estimatedStakingTransactionFinishTime,
    };
};

export {
    useStakingWizard,
};
