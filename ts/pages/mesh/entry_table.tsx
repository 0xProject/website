import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';

import { colors } from 'ts/style/colors';
import { constants } from 'ts/utils/constants';

interface TableLinkProps extends LinkValue {}

type DataCellValue = string | boolean | LinkValue;

interface LinkValue {
    href: string;
    title: string;
}

interface TableEntry {
    [key: string]: DataCellValue;
}

const rows = [
    {
        id: 'runAs',
        title: 'Who runs it?',
    },
    {
        id: 'aim',
        title: 'Choose this for...',
    },
    {
        id: 'limitations',
        title: 'Limitations',
    },
    {
        id: 'link',
        title: 'Get Started',
    },
    {
        id: 'isOpenSource',
        title: 'Open Source',
    },
    {
        id: 'operationCost',
        title: 'Est. operation cost',
    },
    {
        id: 'usedBy',
        title: 'Used By',
    },
];

const entryTableData: TableEntry[] = [
    {
        title: 'Mesh Browser Node',
        runAs: 'Your users',
        aim: 'maximum decentralization, serverless setup',
        limitations: 'Warm-up time order permanence',
        link: {
            href: constants.URL_MESH_GUIDE_BROWSER,
            title: 'Mesh Guide',
        },
        isOpenSource: true,
        operationCost: 'Free',
        usedBy: 'Augur, etc',
    },
    {
        title: 'Mesh Node',
        runAs: 'You',
        aim: 'Node service and lean infra setup',
        limitations: 'None',
        link: {
            href: constants.URL_MESH_GUIDE_NODE,
            title: 'Mesh Guide',
        },
        isOpenSource: true,
        operationCost: '$5-10 / month (based on our own DigitalOcean instances)',
        usedBy: 'example, example example',
    },
    {
        title: '0x API endpoints',
        runAs: '0x Core team',
        aim: 'Ready to use service',
        limitations: 'Rate limiting, token blacklist',
        link: {
            href: constants.URL_MESH_0X_API,
            title: 'API specs 0xConnect',
        },
        isOpenSource: true,
        operationCost: 'Free',
        usedBy: 'Matcha, etc, etc, etc',
    },
];

export const EntryTable: React.FC = () => (
    <StyledTable>
        <thead>
            <tr>
                <td>&nbsp;</td>
                {entryTableData.map(item => (
                    <th key={item.title.toString()} scope="col">
                        {item.title}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map(row => (
                <tr key={`row-${row.id}`}>
                    <th scope="row">{row.title}</th>
                    {entryTableData.map((item, index) => (
                        <DataCell key={`row-${row.id}-cell-${index}`} id={row.id} value={item[row.id]} />
                    ))}
                </tr>
            ))}
        </tbody>
    </StyledTable>
);

interface DataCellProps {
    id: string;
    value: DataCellValue;
}

const DataCell: React.FC<DataCellProps> = ({ id, value }) => {
    switch (id) {
        case 'link':
            return (
                <td>
                    <TableLink href={value.href} title={value.title} />
                </td>
            );
        case 'isOpenSource':
            return <td>{value ? <Checkmark /> : null}</td>;
        default:
            return <td>{value}</td>;
    }
};

const TableLink: React.FC<TableLinkProps> = props => (
    <Button isWithArrow={true} isAccentColor={true} fontSize="inherit" href={props.href} target="_blank">
        {props.title}
    </Button>
);

const Checkmark: React.FC = () => (
    <svg id="checkmark-icon" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 1L6 12L1 7" stroke="#00AE99" strokeWidth="1.4" />
    </svg>
);

const StyledTable = styled.table`
    tr {
        height: 90px;
    }

    th,
    td {
        padding: 12px 22px;

        font-weight: 300;
        font-size: 17px;
        line-height: 1.353;

        text-align: center;
        vertical-align: middle;
    }

    tbody tr td {
        background-color: #0d1413;
    }

    tbody tr:nth-child(even) td {
        background-color: ${colors.backgroundDark};
    }

    th:not(:first-child):not(:last-child),
    td:not(:first-child):not(:last-child) {
        border-right: 12px solid ${colors.backgroundBlack};
    }

    th[scope='col'] {
        height: 115px;
        width: 26%;

        font-size: 24px;
        line-height: 1.345;

        font-feature-settings: 'tnum' on, 'lnum' on;
        background-color: ${colors.brandDark};
    }

    th[scope='row'] {
        width: 246px;

        border: 1px solid #2f4644;
        border-right: none;

        font-size: 19px;
        line-height: 1.345;
        text-align: right;

        font-feature-settings: 'tnum' on, 'lnum' on;
    }
`;
