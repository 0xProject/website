import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon, InlineIconWrap } from 'ts/components/icon';
import { Column, FlexWrap, Section, WrapGrid } from 'ts/components/newLayout';
import { Paragraph, Heading } from 'ts/components/text';
import { Checkmark } from 'ts/components/checkmark';

import { WebsitePaths } from 'ts/types';
import { Header } from 'ts/components/header';
import _ from 'lodash';

interface FigureProps {
    value: string;
    description: string;
}

const Wrap = styled.div`
    width: calc(50% - 3px);
    height: 450px;
    padding: 65px 45px 70px 45px;
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.darkBgColor};

    @media (max-width: 900px) {
        width: 100%;
        margin-top: 30px;
    }
`;

export const SectionLandingAbout = () => (
    <Section isPadded={false} isFlex={true} maxWidth="auto" wrapWidth="100%" flexBreakpoint="900px">
        <Wrap style={{ justifyContent: 'space-between' }}>
            <div>
                <Heading isCentered={true} asElement={'h3'} size={34}>
                    All the popular DEX networks
                </Heading>
                <Paragraph color={'#8F8F8F'} isCentered={true}>
                    Don’t ever worry about another integration, we have it covered.
                </Paragraph>
            </div>

            <WrapGrid bgColor={'#8F8F8F'} isWrapped={true}>
                {_.map(projects, (item: ProjectLogo, index) => (
                    <StyledProject key={`client-${index}`} isOnMobile={item.persistOnMobile}>
                        <img src={item.imageUrl} alt={item.name} />
                    </StyledProject>
                ))}
            </WrapGrid>
        </Wrap>

        <MiddleContainerToAnchorPlus>
            <MiddleContainerCircle>
                <Icon name={'plus-sign'} size={'natural'} />
            </MiddleContainerCircle>
        </MiddleContainerToAnchorPlus>

        <Wrap style={{ justifyContent: 'space-between' }}>
            <div>
                <Heading isCentered={true} asElement={'h3'} size={34} textAlign={'center'}>
                    Plus, exclusive 0x liquidity
                </Heading>
                <Paragraph color={'#8F8F8F'} isCentered={true} isMuted={1} marginBottom={'0'}>
                    Gain access to liquidity you can’t get anywhere else.
                </Paragraph>
            </div>

            <div>
                <CheckboxOptionsGridContainer>
                    <CheckmarkOptionContainer>
                        <CheckmarkContainer>
                            <Checkmark />
                        </CheckmarkContainer>
                        Open Orderbook
                    </CheckmarkOptionContainer>
                    <CheckmarkOptionContainer>
                        <CheckmarkContainer>
                            <Checkmark />
                        </CheckmarkContainer>
                        Private Liquidity Pools
                    </CheckmarkOptionContainer>
                    <CheckmarkOptionContainer>
                        <CheckmarkContainer>
                            <Checkmark />
                        </CheckmarkContainer>
                        Something else
                    </CheckmarkOptionContainer>
                    <CheckmarkOptionContainer>
                        <CheckmarkContainer>
                            <Checkmark />
                        </CheckmarkContainer>
                        Professional Market Makers
                    </CheckmarkOptionContainer>
                </CheckboxOptionsGridContainer>
            </div>

            <div style={{ margin: '0 auto' }}>
                <Button
                    isInline={true}
                    isWithArrow={true}
                    isAccentColor={true}
                    shouldUseAnchorTag={true}
                    to={'https://matcha.xyz'}
                    target={'_blank'}
                    href={'https://matcha.xyz'}
                >
                    Learn more about 0x Liquidity
                </Button>
            </div>
        </Wrap>
    </Section>
);

const MiddleContainerCircle = styled.div`
    height: 68px;
    width: 68px;
    border-radius: 100%;
    background-color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    @media (max-width: 900px) {
        margin: 0 auto;
        transform: none;
    }
`;

const MiddleContainerToAnchorPlus = styled.div`
    height: 100%;
    width: 1px;
    position: relative;
    align-self: center;
    @media (max-width: 900px) {
        width: 100%;
        margin-top: 30px;
    }
`;

const CheckmarkContainer = styled.div`
    margin-right: 18px;
`;

const CheckboxOptionsGridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 550px;
    grid-row-gap: 20px;
    margin: 0 auto;
`;

const CheckmarkOptionContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface ProjectLogo {
    name: string;
    imageUrl?: string;
    persistOnMobile?: boolean;
}

interface StyledProjectInterface {
    isOnMobile?: boolean;
}

const projects: ProjectLogo[] = [
    {
        name: 'Uniswap',
        imageUrl: 'images/clients2/uniswap.svg',
        persistOnMobile: true,
    },
    {
        name: 'Oasis',
        imageUrl: 'images/clients2/oasis.svg',
        persistOnMobile: true,
    },
    {
        name: 'Dodo',
        imageUrl: 'images/clients2/dodo.svg',
    },
    {
        name: 'Balancer',
        imageUrl: 'images/clients2/balancer.svg',
    },
    {
        name: 'Mooniswap',
        imageUrl: 'images/clients2/mooniswap.svg',
        persistOnMobile: true,
    },
    {
        name: 'Curve',
        imageUrl: 'images/clients2/curve.svg',
        persistOnMobile: true,
    },
    {
        name: 'Bancor',
        imageUrl: 'images/clients2/bancor.svg',
        persistOnMobile: true,
    },
    {
        name: 'mStable',
        imageUrl: 'images/clients2/mstable.svg',
        persistOnMobile: true,
    },
    {
        name: 'Kyber',
        imageUrl: 'images/clients2/kyber.svg',
    },
];

const StyledProject = styled.div<StyledProjectInterface>`
    flex-shrink: 0;

    img {
        object-fit: contain;
        height: 100%;
    }

    @media (min-width: 768px) {
        width: auto;
        margin: 15px 20px;
    }

    @media (max-width: 768px) {
        width: auto;
        margin: 10px 15px;
        display: ${props => !props.isOnMobile && 'none'};
    }
`;
