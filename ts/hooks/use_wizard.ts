import qs from 'query-string';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from 'ts/hooks/use_query';

import { UserStakingChoice, WebsitePaths } from 'ts/types';

// These are the primary states (controlled by routing).
// Within these, there are substates.
// We do this to control routing/back/forward in the wizard
export enum WizardRouterSteps {
    Start = 'start',
    Stake = 'stake',
}

export interface IUSeWizardResult {
    currentStep: WizardRouterSteps;
    next: (nextStep: WizardRouterSteps) => void;
    back: () => void;
}

const DEFAULT_STEP = WizardRouterSteps.Start;

const useStakingWizard = (selectedStakingPools?: UserStakingChoice[]): IUSeWizardResult => {
    const { step, ...restOfQueryParams } = useQuery<{
        poolId: string | undefined;
        step: WizardRouterSteps | undefined;
    }>();
    const history = useHistory();

    // Default to initial step if none/invalid one provided
    // OR if a user loads a url directly to mid-progress wizard without requied data, redirect back to start page
    useEffect(() => {
        if (!step || (step !== WizardRouterSteps.Start && !selectedStakingPools)) {
            return history.replace(
                `${WebsitePaths.StakingWizard}?${qs.stringify({
                    ...restOfQueryParams,
                    step: DEFAULT_STEP,
                })}`,
            );
        }
    }, [step, history, selectedStakingPools, restOfQueryParams]);

    // Right now, user-space will determine what the next step is.
    const goToNextStep = useCallback(
        nextStep => {
            if (!nextStep) {
                return;
            }
            history.push(
                `${WebsitePaths.StakingWizard}?${qs.stringify({
                    ...restOfQueryParams,
                    step: nextStep,
                })}`,
            );
        },
        [history, restOfQueryParams],
    );

    const goToPreviousStep = useCallback(() => {
        history.goBack();
    }, [history]);

    return {
        currentStep: step || DEFAULT_STEP,
        next: goToNextStep,
        back: goToPreviousStep,
    };
};

export { useStakingWizard };
