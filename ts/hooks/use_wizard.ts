import qs from 'query-string';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from 'ts/hooks/use_query';

import { WebsitePaths } from 'ts/types';

// These are the three primary wizard states (controlled by routing).
// SetupWizard handles connecting the wallet, selecting pools and staking amounts
// ApproveTokens handles token approval
// ReadyToStake handles the actual staking process as well as the success confirmation
// Each of these steps can have their own internal state, which allows flexible transitions.
export enum WizardRouterSteps {
    SetupWizard = 'start',
    ApproveTokens = 'approve',
    ReadyToStake = 'stake',
}

export interface NextStepOptions {
    replace: boolean;
}

export interface IUSeWizardResult {
    currentStep: WizardRouterSteps;
    next: (nextStep: WizardRouterSteps, options?: NextStepOptions) => void;
    back: () => void;
}

const DEFAULT_STEP = WizardRouterSteps.SetupWizard;

const useStakingWizard = (): IUSeWizardResult => {
    const { step, ...restOfQueryParams } = useQuery<{
        poolId: string | undefined;
        step: WizardRouterSteps | undefined;
    }>();
    const history = useHistory();

    const reset = useCallback(() => {
        history.replace(
            `${WebsitePaths.StakingWizard}?${qs.stringify({
                ...restOfQueryParams,
                step: DEFAULT_STEP,
            })}`,
        );
    }, [history, restOfQueryParams]);

    // Right now we just start on the 'setup' step on app mount.
    // We currently don't support joining an in-progress stake
    // Ensure everyone starts on the 'setup' step.
    useEffect(() => {
        reset();
        // Only do this on mount (empty dep array for effect)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Right now, user-space will determine what the next step is.
    const goToNextStep = useCallback(
        (nextStep, { replace } = {}) => {
            if (!nextStep) {
                return;
            }
            const routingFn = replace ? history.replace : history.push;
            return routingFn(
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
