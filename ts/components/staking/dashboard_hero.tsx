import * as React from 'react';
import styled from 'styled-components';

import { Tab, Tabs } from 'ts/components/tabs';

import { colors } from 'ts/style/colors';

interface DashboardHeroProps {

}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

const Wrapper = styled.div<WrapperProps>`
    margin-bottom: 40px;
`;

const Inner = styled.div<InnerProps>`
    background-color: ${colors.backgroundLightGrey};
    @media (min-width: 768px) {
        padding: 60px;
    }
`;

const Row = styled.div<RowProps>`
    max-width: 1152px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const Column = styled.div`
    padding: 30px;
    width: 50%;
    @media (min-width: 768px) {
        padding: 60px;
        &:first-child {
            padding-left: 0;
        }
        &:last-child {
            padding-right: 0;
        }
    }
`;

const Metrics = styled(Column)`
    max-width: 460px;
    background-color: red;
    padding: 0;
    @media (min-width: 768px) {
        padding: 0;
    }
`;

const Title = styled.h1`
    font-size: 46px;
    line-height: 1.2;
    font-weight: 300;
    margin-bottom: 20px;
    display: none;
    @media (min-width: 768px) {
        font-size: 50px;
        display: block;
    }
`;

export const DashboardHero: React.FC<DashboardHeroProps> = props => {
    const { title, titleMobile, description, actions } = props;

    return (
        <Wrapper>
            <Inner>
                <Row>
                    <Column>
                        Left
                    </Column>
                    <Metrics>
                    <Tabs>
                        <Tab
                            isSelected={true}
                            onClick={() => {}}
                        >
                            Current Epoch
                        </Tab>
                        <Tab
                            isSelected={false}
                            onClick={() => {}}
                        >
                            All Time
                        </Tab>
                    </Tabs>
                    </Metrics>
                </Row>
            </Inner>
        </Wrapper>
    );
};
