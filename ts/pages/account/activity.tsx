import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading } from 'ts/components/text';
import { Breadcrumb } from 'ts/components/ui/breadcrumb';
import { Table } from 'ts/components/ui/table';
import { StakeStatus } from 'ts/components/ui/table_stake_status';

import { utils } from 'ts/utils/utils';

interface MockData {
    timestamp: string | number;
    statusId: string | number;
    amount: string | number;
    status: string;
    id: string;
}

interface ActivityStrings {
    title: string;
    subtitle: string;
}

interface Strings {
    [key: string]: ActivityStrings;
}

const columns = ['date', 'name', 'amount', 'status'];

const MOCK_DATA: MockData[] = [
    {
        timestamp: '12345',
        statusId: 1,
        amount: '200 ZRX',
        status: 'processed',
        id: '0x1723456',
    },
    {
        timestamp: '12345',
        statusId: 1,
        amount: '200 ZRX',
        status: 'locked',
        id: '0x1236456',
    },
    {
        timestamp: '12345',
        statusId: 1,
        amount: '200 ZRX',
        status: 'processed',
        id: '0x1234556',
    },
    {
        timestamp: '12345',
        statusId: 1,
        amount: '200 ZRX',
        status: 'processed',
        id: '0x12345d6',
    },
];

const strings: Strings = {
    1: {
        title: 'Locking your ZRX',
        subtitle: 'Your declared staking pool is going',
    },
    2: {
        title: 'Staking starts',
        subtitle: 'Your staking pool is included in the Market',
    },
    3: {
        title: 'First rewards',
        subtitle: 'You are going to receive first rewards',
    },
};

export const AccountActivity: React.FC = () => {
    const crumbs = [
        {
            label: utils.getAddressBeginAndEnd('0x12345344345', 7, 3),
            url: '/account',
        },
        {
            label: 'Activity',
        },
    ];

    return (
        <StakingPageLayout title="0x Staking | Activity">
            <Breadcrumb crumbs={crumbs} />

            <ContentWrap>
                <Heading
                    asElement="h1"
                    fontWeight="500"
                    marginBottom="60px"
                >
                    Activity
                </Heading>

                <Table columns={columns}>
                    {_.map(MOCK_DATA, row => {
                        const description = getDescription(`${row.statusId}`);

                        return (
                            <tr key={row.id}>
                                <td>
                                    {row.timestamp}
                                </td>
                                <td>
                                    <StakeStatus
                                        title={description.title}
                                        subtitle={description.subtitle}
                                    />
                                </td>
                                <td>
                                    {row.amount}
                                </td>
                                <td>
                                    <StakeStatus
                                        title={row.status}
                                        subtitle={row.id}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </Table>
            </ContentWrap>
        </StakingPageLayout>
    );
};

const getDescription = (id: string): ActivityStrings => {
    return strings[`${id}`];
};

const ContentWrap = styled.div`
    width: calc(100% - 40px);
    max-width: 1152px;
    margin: 90px auto 0 auto;

    @media (max-width: 768px) {
        h1 {
            font-size: 34px;
        }
    }
`;
