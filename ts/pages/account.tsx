import * as React from 'react';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

export interface AccountProps {}

export const Account: React.FC<AccountProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            Account page
        </StakingPageLayout>
    );
};
