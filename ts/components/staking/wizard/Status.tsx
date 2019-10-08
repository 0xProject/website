import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';

import { colors } from 'ts/style/colors';

interface StatusProps {
    icon?: React.ReactNode;
    title: string;
    linkText?: string;
    linkUrl?: string;
}

const StatusContainer = styled.div`
    padding: 60px;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid #dddddd;
`;

const Title = styled.h2`
    font-size: 28px;
    line-height: 1.38;
`;

const Link = styled(Button)`
    margin-top: 30px;
    @media (max-width: 500px) {
        && {
            white-space: pre-wrap;
            line-height: 1.3;
        }
    }
`;

export const Status: React.FC<StatusProps> = props => {
    const { icon, title, linkText, linkUrl } = props;
    return (
        <StatusContainer>
            <Title>{title}</Title>
            <Link href="/" isWithArrow={true} color={colors.brandLight}>
                or explore market maker list
            </Link>
        </StatusContainer>
    );
};
