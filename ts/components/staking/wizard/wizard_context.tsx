import React from 'react';
import { RouterWizardSteps } from 'ts/pages/staking/wizard/wizard';

const WizardContext = React.createContext<RouterWizardSteps>(null);
WizardContext.displayName = 'WizardContext';

export {
    WizardContext,
};
