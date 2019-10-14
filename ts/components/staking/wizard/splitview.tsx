import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface SplitviewProps {
    leftComponent: React.ReactNode;
    rightComponent: React.ReactNode;
}

const SplitviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    @media (min-width: 900px) {
        flex-direction: row;
    }

    & > div {
        @media (min-width: 900px) {
            width: 50%;
        }
    }
`;

const Left = styled.div`
    padding: 100px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Right = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;

    @media (min-width: 768px) {
        background-color: ${colors.backgroundLightGrey};
    }
    @media (min-width: 900px) {
        padding: 60px;
    }
`;

export const Splitview: React.FC<SplitviewProps> = props => {
    const { leftComponent, rightComponent } = props;
    return (
        <SplitviewContainer>
            <Left>{leftComponent}</Left>
            <Right>{rightComponent}</Right>
        </SplitviewContainer>
    );
};
