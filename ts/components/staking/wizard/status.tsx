import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';

import { colors } from 'ts/style/colors';

interface StatusProps {
    iconName?: string;
    title: string;
    linkText?: string;
    linkUrl?: string;
    to?: string;
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
        min-height: 500px;
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
    const { title, linkText, linkUrl, to, iconName } = props;
    const target = linkUrl && !to ? '_blank' : undefined;
    return (
        <StatusContainer>
            {iconName && <StatusIcon color={colors.brandLight} name={iconName} size={145} />}
            <Title>{title}</Title>
            {linkText && (linkUrl || to) &&
                <Link href={linkUrl} to={to} isWithArrow={true} color={colors.brandLight} target={target}>
                    {linkText}
                </Link>
            }
        </StatusContainer>
    );
};
