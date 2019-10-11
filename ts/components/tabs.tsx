import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface TabsProps {
    isLight?: boolean;
}

interface TabProps {
    isSelected: boolean;
    isLight?: boolean;
}

interface ContainerProps {
    isLight: boolean;
}

const Container = styled.div<ContainerProps>`
    display: flex;
    border: ${props => `1px solid ${props.isLight ? '#D7D7D7' : props.theme.lightBgColor}`};
    padding-right: 5px;
`;

export const Tab = styled.label<TabProps>`
    cursor: pointer;
    white-space: nowrap;
    flex: 1;
    text-align: center;
    background-color: ${props => props.isSelected ? (props.isLight ? '#F6F6F6' : props.theme.lightBgColor) : ''};
    opacity: ${props => (props.isSelected ? 1 : 0.5)};
    margin: 5px 0px 5px 5px;
    &:hover {
        background-color: ${props => props.isLight ? '#F6F6F6' : props.theme.lightBgColor};
    }
    padding: 10px 17px;
    font-size: 12px;
    @media (min-width: 768px) {
        background-color: ${props => props.isSelected ? (props.isLight ? colors.white : props.theme.lightBgColor) : ''};
        &:hover {
            background-color: ${props => props.isLight ? colors.white : props.theme.lightBgColor};
        }
    }
    @media (min-width: 1024px) {
        padding: 15px 40px;
        font-size: 17px;
    }
`;

export const Tabs: React.FC<TabsProps> = ({ children, isLight }) => {
    return (
        <Container isLight={isLight}>
            {children}
        </Container>
    );
};
