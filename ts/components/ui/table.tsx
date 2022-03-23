import { map } from 'lodash-es';
import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface TableProps {
    columns: string[];
    children: any;
}

export const Table: React.StatelessComponent<TableProps> = ({ columns, children }) => {
    return (
        <StyledTable>
            <thead>
                {map(columns, (label) => {
                    return <th key={label}>{label}</th>;
                })}
            </thead>

            <tbody>{children}</tbody>
        </StyledTable>
    );
};

const StyledTable = styled.table`
    width: 100%;
    text-align: left;

    th {
        text-transform: capitalize;
        font-size: 17px;
        color: ${colors.textDarkSecondary};
    }

    th,
    td {
        padding: 20px;
    }

    tr:nth-child(odd) {
        background-color: ${colors.backgroundLightGrey};
    }
`;
