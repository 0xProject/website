import * as React from 'react';
import styled from 'styled-components';
import { animated, useTransition } from 'react-spring-latest';

import { Button } from 'ts/components/button';
import { Hero } from 'ts/components/hero';
import { LandingAnimation } from 'ts/components/heroImage';

import { AnimationLoader } from 'ts/components/animations/animation_loader';

import { WebsitePaths } from 'ts/types';

export interface SectionlandingHeroProps {}

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
    }, []);

    return (
        <span>
            The liquidity endpoint for DeFi on
            <div
                style={{
                    height: '90px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    position: 'absolute',
                    width: '80%',
                }}
            >
                {transitions((style, i) => {
                    return (
                        <animated.span
                            style={{
                                ...style,
                                position: 'absolute',
                                marginLeft: '1rem',
                                color: slides[i].color,
                            }}
                        >
                            {slides[i].label}
                        </animated.span>
                    );
                })}
            </div>
        </span>
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
            <Button to={WebsitePaths.ZeroExApiDocs} isInline={true}>
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
