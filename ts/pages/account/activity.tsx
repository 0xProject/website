import * as _ from 'lodash';
import * as React from 'react';
// import styled from 'styled-components';

import { Breadcrumb } from 'ts/components/ui/breadcrumb';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

export const AccountActivity: React.FC = () => {
    const crumbs = [
        {
            label: '0x12345344345',
            url: '/account',
        },
        {
            label: 'Activity',
        },
    ];

    return (
    <StakingPageLayout title="0x Staking | Activity">
        <Breadcrumb crumbs={crumbs} />

        Account activity page
    </StakingPageLayout>
 );
};
