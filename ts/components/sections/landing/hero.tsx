import * as React from 'react';
import { animated, useTransition } from 'react-spring-latest';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Hero } from 'ts/components/hero';
import { LandingAnimation } from 'ts/components/heroImage';

import { AnimationLoader } from 'ts/components/animations/animation_loader';

export interface SectionlandingHeroProps {}

const AnimatedTitleWrap = styled.div`
    height: 90px;
    overflow: hidden;
    display: inline-block;
    position: absolute;
    width: 80%;
    padding-left: 1rem;

    @media (max-width: 768px) {
        height: 50px;
        display: inline;
        position: relative;
        width: auto;
    }

    @media (max-width: 650px) {
        height: 50px;
        display: flex;
        position: relative;
        justify-content: center;
        width: 100%;
    }
`;

const AnimatedHeroTitle: React.FC<{}> = () => {
    const [index, set] = React.useState(0);

    const slides = [
        {
            label: 'Ethereum',
            color: '#7694FF',
        },
        {
            label: 'Polygon',
            color: '#794FDD',
        },
        { label: 'BSC', color: '#F5AA15' },
        { label: 'Avalanche', color: '#FF3500' },
        { label: 'Fantom', color: '#a2f5eb' },
        { label: 'Celo', color: '#14b094' },
        { label: 'Optimism', color: '#FF3500' },
    ];

    const transitions = useTransition(index, {
        key: index,
        from: {
            transform: 'translate3d(0,50px,0)',
            opacity: 0,
        },
        enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
        leave: { transform: 'translate3d(0,-50px,0)', opacity: 0 },
    });

    React.useEffect(() => {
        const t = setInterval(() => {
            set((state) => {
                return (state + 1) % slides.length;
            });
        }, 1500);
        return () => clearTimeout(t);
    }, [slides.length]);

    return (
        <div>
            The liquidity endpoint for DeFi on
            <AnimatedTitleWrap>
                {transitions((style, i) => {
                    return (
                        <animated.span
                            style={{
                                ...style,
                                position: 'absolute',
                                color: slides[i].color,
                            }}
                        >
                            {slides[i].label}
                        </animated.span>
                    );
                })}
            </AnimatedTitleWrap>
        </div>
    );
};

export const SectionLandingHero: React.FC<SectionlandingHeroProps> = () => {
    return (
        <>
            <Hero
                title={<AnimatedHeroTitle />}
                isLargeTitle={true}
                isFullWidth={true}
                maxWidth={'1280px'}
                sectionPadding={'120px 0 40px 0'}
                maxWidthFigure="850px"
                alignItems={'flex-start'}
                hideFigureOnMobile={true}
                showFigureBottomMobile={false}
                description="0x API is a professional grade liquidity aggregator enabling the future of DeFi applications"
                figure={
                    <LandingAnimation
                        image={
                            <AnimationContainer>
                                <AnimationLoader name={'depth'} shouldLoop={false} />
                            </AnimationContainer>
                        }
                    />
                }
                actions={<HeroActions />}
            />
        </>
    );
};

interface HeroActionsProps {}

const HeroActions: React.FC<HeroActionsProps> = () => {
    return (
        <>
            <Button href={'https://docs.0x.org/'} isInline={true} target={'_blank'}>
                Start Building
            </Button>

            <Button href={'https://matcha.xyz'} target={'_blank'} isTransparent={true} isInline={true}>
                Try it with Matcha
            </Button>
        </>
    );
};

const AnimationContainer = styled.div`
    /* max-height: 375px; */
    width: 100%;
    margin-bottom: 35px;
`;
