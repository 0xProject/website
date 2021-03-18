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
        hideMobile: true,
    },
    {
        id: 'aim',
        title: 'Choose this for...',
        hideMobile: false,
    },
    {
        id: 'limitations',
        title: 'Limitations',
        hideMobile: true,
    },
    {
        id: 'link',
        title: 'Get Started',
        hideMobile: false,
    },
    {
        id: 'isOpenSource',
        title: 'Open Source',
        hideMobile: true,
    },
    {
        id: 'operationCost',
        title: 'Est. operation cost',
        hideMobile: true,
    },
    {
        id: 'usedBy',
        title: 'Used By',
        hideMobile: false,
    },
];

const entryTableData: TableEntry[] = [
    {
        title: 'Mesh Browser Node',
        runAs: 'Your users',
        aim: 'Maximum decentralization, serverless setup',
        limitations: 'Warm-up time order permanence',
        link: {
            href: constants.URL_MESH_GUIDE_BROWSER,
            title: 'Mesh Browser Guide',
        },
        isOpenSource: true,
        operationCost: 'Free',
        usedBy: 'Augur',
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
        operationCost: '$5-10 / month (based on DigitalOcean instances)',
        usedBy: '1Inch, TokenTrove',
    },
    {
        title: '0x API',
        runAs: '0x Core team',
        aim: 'Ready to use service',
        limitations: 'Rate limiting, token blacklist',
        link: {
            href: constants.URL_MESH_0X_API,
            title: '0x API SRA specifications',
        },
        isOpenSource: true,
        operationCost: 'Free',
        usedBy: 'Microsponsors, aco.finance, opynmonitor',
    },
];

interface DefinitionProps {
    id: string;
    value: DataCellValue;
}

const TableLink: React.FC<TableLinkProps> = (props) => (
    <Button isWithArrow={true} isAccentColor={true} fontSize="inherit" href={props.href} target="_blank">
        {props.title}
    </Button>
);

const Checkmark: React.FC = () => (
    <svg id="checkmark-icon" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 1L6 12L1 7" stroke="#00AE99" strokeWidth="1.4" />
    </svg>
);

const Definition: React.FC<DefinitionProps> = ({ id, value }) => {
    switch (id) {
        case 'link':
            const link = value as LinkValue;
            return (
                <dd>
                    <TableLink href={link.href} title={link.title} />
                </dd>
            );
        case 'isOpenSource':
            return <dd>{value ? <Checkmark /> : null}</dd>;
        default:
            return <dd>{value}</dd>;
    }
};

export const EntryTable: React.FC = () => (
    <Wrapper>
        {entryTableData.map((item) => (
            <Column key={item.title.toString()}>
                <Title>{item.title}</Title>
                <dl>
                    {rows.map((row) => (
                        <React.Fragment key={row.title.toString()}>
                            <dt className={row.hideMobile ? 'mobileHidden' : ''}>{row.title}</dt>
                            <Definition id={row.id} value={item[row.id]} />
                        </React.Fragment>
                    ))}
                </dl>
            </Column>
        ))}
    </Wrapper>
);

const Wrapper = styled.div`
    @media (min-width: 768px) {
        display: flex;
        justify-content: center;

        margin-left: 246px; /* offset row headings */
    }
`;

const Column = styled.div`
    dt,
    dd {
        padding: 12px 22px;
    }

    dt {
        font-size: 14px;
        line-height: 1.345;
        text-align: left;
        font-feature-settings: 'tnum' on, 'lnum' on;
    }

    dd {
        background-color: #0d1413;

        font-weight: 300;
        font-size: 17px;
        line-height: 1.353;
        text-align: center;

        display: flex;
        align-items: center;
        justify-content: center;

        &:nth-of-type(even) {
            background-color: ${colors.backgroundDark};
        }
    }

    @media (max-width: 768px) {
        margin-bottom: 12px;

        .mobileHidden,
        .mobileHidden + dd {
            display: none;
        }
    }

    @media (min-width: 768px) {
        position: relative;
        flex-basis: 33%;

        &:not(:last-child) {
            margin-right: 12px;
        }

        &:not(:first-child) dt {
            display: none;
        }

        dt,
        dd {
            height: 90px;
            padding: 12px 22px;
        }

        dt {
            position: absolute;
            width: 246px;
            left: -246px;

            display: flex;
            align-items: center;
            justify-content: flex-end;

            border: 1px solid #2f4644;
            border-right: none;

            font-size: 19px;
            text-align: right;
        }
    }
`;

const Title = styled.h4`
    font-size: 22px;
    line-height: 1.345;

    font-feature-settings: 'tnum' on, 'lnum' on;
    background-color: ${colors.brandDark};

    padding: 12px 22px;

    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
        height: 115px;
        font-size: 24px;
    }
`;
