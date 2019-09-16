import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

const ProgressBar = styled.div`
    max-width: 250px;
    padding: 5px;
`;

export interface StakingIndexProps {
}

export const StakingIndex: React.FC<StakingIndexProps> = props => {
  return (
      <StakingPageLayout isHome={true} title="0x Staking">
        Stake!
      </StakingPageLayout>
  );
};
