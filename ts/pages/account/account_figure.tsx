import * as React from 'react';
import styled from 'styled-components';

interface AccountFigureProps {
    label: string;
    headerComponent?: () => React.ReactNode;
    children: React.ReactNode;
}

export const AccountFigure: React.FC<AccountFigureProps> = ({ label, headerComponent, children }) => {
    return (
        <FigureItem>
            <header>
                {label}
                {headerComponent()}
            </header>

            {children}
        </FigureItem>
    );
};

const FigureItem = styled.div`
    background-color: #fff;
    padding: 20px;
    width: 252px;
    height: 94px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 20px;

    header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 17px;
        color: #999;
        font-weight: 200;
    }

    button {
        border: 0;
        font-size: 17px;
        font-weight: 200;

        svg {
            height: 13px;
        }
    }

    @media (min-width: 768px) {
        & + & {
            margin-left: 12px;
        }
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;
