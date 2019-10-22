import * as React from 'react';
import styled from 'styled-components';

import { PanelHeader } from 'ts/components/ui/panel_header';

import { colors } from 'ts/style/colors';

interface AccountActivitySummaryProps {
    title: string;
    subtitle: string;
    avatarSrc?: string;
    children?: React.ReactNode;
    icon?: string;
}

const Wrap = styled.div`
    padding: 20px;
    background-color: ${colors.backgroundLightGrey};

    & + & {
        margin-top: 20px;
    }

    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    @media (max-width: 768px) {
        button {
            width: 100%;
        }
    }
`;

const ChildWrap = styled.div`
    flex-shrink: 0;

    @media (max-width: 768px) {
        margin-top: 30px;
    }
`;

export const AccountActivitySummary: React.StatelessComponent<AccountActivitySummaryProps> = ({
    title,
    subtitle,
    avatarSrc,
    icon,
    children,
}) => {
    return (
        <Wrap>
            <PanelHeader title={title} subtitle={subtitle} avatarSrc={avatarSrc} icon={icon} />

            <ChildWrap>{children}</ChildWrap>
        </Wrap>
    );
};
