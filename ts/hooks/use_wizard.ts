import qs from 'query-string';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { usePreviousDistinct } from 'react-use';

import { useQuery } from 'ts/hooks/use_query';

import { WebsitePaths } from 'ts/types';

// These are the three primary wizard states (controlled by routing).
// SetupWizard handles connecting the wallet, selecting pools and staking amounts
// ApproveTokens handles token approval
// ReadyToStake handles the actual staking process as well as the success confirmation
// Each of these steps can have their own internal state, which allows flexible transitions.
export enum WizardRouterSteps {
    ConnectWallet = 'connect_wallet',
    SetupWizard = 'start',
    ApproveTokens = 'approve',
    ReadyToStake = 'stake',
}

export interface NextStepOptions {
    replace: boolean;
}

export interface IUSeWizardResult {
    currentStep: WizardRouterSteps;
    previousStep?: WizardRouterSteps;
    next: (nextStep: WizardRouterSteps, options?: NextStepOptions) => void;
    back: () => void;
}

export const isGoingForward = ({
    currentStep,
    previousStep,
}: {
    currentStep: WizardRouterSteps;
    previousStep?: WizardRouterSteps;
}) => {
    if (!previousStep) {
        return true;
    }
    const wizardStepsInOrders = Object.keys(WizardRouterSteps)
        .map(k => (WizardRouterSteps as any)[k as any])
        .map(v => v as WizardRouterSteps);
    const currentStepIndex = wizardStepsInOrders.findIndex(possibleStep => possibleStep === currentStep);
    const previousStepIndex = wizardStepsInOrders.findIndex(possibleStep => possibleStep === previousStep);
    if (currentStepIndex < previousStepIndex) {
        return false;
    }
    return true;
};

const DEFAULT_STEP = WizardRouterSteps.SetupWizard;

const useStakingWizard = (): IUSeWizardResult => {
    const { step, ...restOfQueryParams } = useQuery<{
        poolId: string | undefined;
        step: WizardRouterSteps | undefined;
    }>();

    // Store prev step in ref (more performant).
    const previousStep = useRef<WizardRouterSteps | undefined>(undefined);
    useLayoutEffect(() => {
        previousStep.current = step;
    }, [step]);

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
        previousStep: previousStep.current,
        next: goToNextStep,
        back: goToPreviousStep,
    };
};

export { useStakingWizard };
