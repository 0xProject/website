import * as React from 'react';
import styled from 'styled-components';

import { Heading } from 'ts/components/text';
import { colors } from 'ts/style/colors';

interface StatFigureProps {
    label: string;
    value: string;
    isNoBorder?: boolean;
    showZrxLabel?: boolean;
}

const Wrap = styled.div`
    font-size: 18px;

    @media (min-width: 768px) {
        padding: 0 15px;
        border-left: 1px solid ${colors.border};

        &.no-border {
            border-left: none;
        }
    }
`;

export const StatFigure: React.StatelessComponent<StatFigureProps> = ({
    label,
    value,
    isNoBorder,
    showZrxLabel,
}) => {
    return (
        <Wrap>
            <Heading size={14} marginBottom="8px">
                {label}
            </Heading>

            {value} {showZrxLabel ? 'ZRX': ''}
        </Wrap>
    );
};
