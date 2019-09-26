import * as React from 'react';
import styled from 'styled-components';

// import { colors } from 'ts/style/colors';

interface PairTabProps {
    isSelected: boolean;
}

const Container = styled.div`
    display: flex;
    border: ${props => `1px solid ${props.theme.lightBgColor}`};
    padding-right: 5px;
`;

export const Tab = styled.label<PairTabProps>`
    cursor: pointer;
    white-space: nowrap;
    background-color: ${props => (props.isSelected ? props.theme.lightBgColor : '')};
    opacity: ${props => (props.isSelected ? 1 : 0.5)};
    margin: 5px 0px 5px 5px;
    &:hover {
        background-color: ${props => props.theme.lightBgColor};
    }
    padding: 10px 17px;
    font-size: 12px;
    @media (min-width: 1024px) {
        padding: 15px 40px;
        font-size: 17px;
    }
`;

export const Tabs: React.FC = ({ children }) => {
    return (
        <Container>
            {children}
        </Container>
    );
};
