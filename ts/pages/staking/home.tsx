import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

export interface StakingIndexProps {}

export const StakingIndex: React.FC<StakingIndexProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
        </StakingPageLayout>
    );
};
