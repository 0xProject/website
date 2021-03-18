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
    padding: 60px 15px 30px 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (min-width: 480px) {
        padding: 100px 15px;
    }

    @media (min-width: 768px) {
        padding: 100px 30px;
    }

    @media (min-width: 1140px) {
        padding: 100px 60px;
    }
`;

const Right = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px;

    @media (min-width: 768px) {
        padding: 30px;
        background-color: ${colors.backgroundLightGrey};
        max-height: 850px;
    }
    @media (min-width: 1140px) {
        padding: 60px;
    }
`;

export const Splitview: React.FC<SplitviewProps> = (props) => {
    const { leftComponent, rightComponent } = props;
    return (
        <SplitviewContainer>
            <Left>{leftComponent}</Left>
            <Right>{rightComponent}</Right>
        </SplitviewContainer>
    );
};
