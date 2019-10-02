import * as React from 'react';
import styled from 'styled-components';

import { PanelHeader } from 'ts/components/ui/panel_header';
import { colors } from 'ts/style/colors';

interface AccountActivitySummaryProps {}

const Wrap = styled.div`
    padding: 20px;
    background-color: ${colors.backgroundLightGrey};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const AccountActivitySummary: React.StatelessComponent<AccountActivitySummaryProps> = () => {
    return (
        <Wrap>
            <PanelHeader
                title="Lorem ipsum"
                subtitle="Dolor sit amet consequitur"
            />
        </Wrap>
    );
};
