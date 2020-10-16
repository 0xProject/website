import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { Section } from 'ts/components/newLayout';
import { Heading } from 'ts/components/text';
import { Button } from 'ts/components/button';

export const SectionLandingClients = () => (
    <Section isTextCentered={true}>
        <Heading size="medium">Best in class performance</Heading>
        <Description style={{ maxWidth: 660, textAlign: 'center', margin: '0 auto 60px auto' }}>
            Better prices, faster response times, and lower revet rates than any other aggregator on the market.{' '}
            <Button
                isInline={true}
                isWithArrow={true}
                isAccentColor={true}
                shouldUseAnchorTag={true}
                to={'https://matcha.xyz'}
                target={'_blank'}
                href={'https://matcha.xyz'}
            >
                See the data
            </Button>
        </Description>
        <StatsGrid>
            <StatWrapper>
                <StatHeader>
                    99<StatHeaderUnit>%</StatHeaderUnit>
                </StatHeader>
                <StatCaption>Uptime</StatCaption>
                <StatCaptionDescription>20% better than competitors</StatCaptionDescription>
            </StatWrapper>

            <StatWrapper>
                <StatHeader>
                    1<StatHeaderUnit>%</StatHeaderUnit>
                </StatHeader>
                <StatCaption>Revert Rate</StatCaption>
                <StatCaptionDescription>5% better than competitors</StatCaptionDescription>
            </StatWrapper>

            <StatWrapper>
                <StatHeader>
                    2<StatHeaderUnit>ms</StatHeaderUnit>
                </StatHeader>
                <StatCaption>Response Time</StatCaption>
            </StatWrapper>
        </StatsGrid>
    </Section>
);

const Description = styled.p`
    font-size: 22px;
    line-height: 31px;
    font-weight: 300;
    padding: 0;
    margin-bottom: 50px;
    color: ${props => props.theme.introTextColor};
`;

const StatWrapper = styled.div`
    display: flex;
    flex-direction: column;
    text-align: start;
    /* width: 180px; */
`;

const StatsGrid = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        & ${StatWrapper} {
            margin-bottom: 16px;
        }
    }
`;

const StatHeader = styled.div`
    font-size: 114px;
    line-height: 114px;
    font-feature-settings: 'tnum' on, 'lnum' on;
`;

const StatHeaderUnit = styled.span`
    font-size: 60px;
`;

const StatCaption = styled.div`
    font-weight: 300;
    font-size: 17px;
    line-height: 23px;
    margin-bottom: 6px;
`;

const StatCaptionDescription = styled.div`
    font-weight: 300;
    font-size: 14px;
    line-height: 19px;
    color: #8f8f8f;
`;
