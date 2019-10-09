import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';

import { colors } from 'ts/style/colors';

interface StatusProps {
    icon?: React.ReactNode;
    title: string;
    linkText?: string;
    linkUrl?: string;
}

const StatusContainer = styled.div`
    padding: 20px;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid #dddddd;

    @media (min-width: 768px) {
        padding: 60px;
    }
`;

const Title = styled.h2`
    font-size: 20px;
    line-height: 1.38;

    @media (min-width: 768px) {
        font-size: 28px;
    }
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

const StatusIcon = styled(Icon)`
    margin-bottom: 30px;
`;

export const Status: React.FC<StatusProps> = props => {
    const { icon, title, linkText, linkUrl } = props;
    return (
        <StatusContainer>
            <StatusIcon color={colors.brandLight} name="getStartedThin" size={145} />
            <Title>{title}</Title>
            {linkText != null && linkUrl != null &&
                <Link href={linkUrl} isWithArrow={true} color={colors.brandLight}>
                    {linkText}
                </Link>
            }
        </StatusContainer>
    );
};
