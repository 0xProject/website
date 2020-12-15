import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'react-use';

import { Section } from 'ts/components/newLayout';
import { Heading } from 'ts/components/text';
import { Button } from 'ts/components/button';

const useIsMobile = () => {
    const { width } = useWindowSize();
    if (width < 600) {
        return true;
    }
    return false;
};

export const SectionLandingClients = () => {
    const isMobile = useIsMobile();
    return (
        <Section maxWidth={'940px'} isTextCentered={true}>
            <Heading size="medium">Best in class performance</Heading>
            <Description style={{ maxWidth: 660, textAlign: 'center', margin: '0 auto 60px auto' }}>
                Better prices, faster response times, and lower revert rates than any other aggregator on the market.{' '}
                {isMobile && <br />}
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
            {/* On mobile, need to wrap in one more container and control width, then center that container, then align left on all stats */}
            <StatsGridContainer>
                <StatsGrid>
                    <StatWrapper>
                        <StatHeader>
                            99.9<StatHeaderUnit>%</StatHeaderUnit>
                        </StatHeader>
                        <StatCaption>Uptime</StatCaption>
                        <StatCaptionDescription> Available when you need it</StatCaptionDescription>
                    </StatWrapper>

                    <StatWrapper>
                        <StatHeader>
                            2<StatHeaderUnit>%</StatHeaderUnit>
                        </StatHeader>
                        <StatCaption>Revert Rate</StatCaption>
                        <StatCaptionDescription>10x lower than competitors</StatCaptionDescription>
                    </StatWrapper>

                    <StatWrapper>
                        <StatHeader>
                            1.5<StatHeaderUnit>s</StatHeaderUnit>
                        </StatHeader>
                        <StatCaption>Response Time</StatCaption>
                        <StatCaptionDescription>2.7% faster than competitors</StatCaptionDescription>
                    </StatWrapper>
                </StatsGrid>
            </StatsGridContainer>
        </Section>
    );
};

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

const StatsGridContainer = styled.div`
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        display: flex;
    }
`;

const StatsGrid = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
        & ${StatWrapper} {
            margin-bottom: 42px;
        }
    }
`;

const StatHeader = styled.div`
    font-size: 100px;
    line-height: 100px;
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
