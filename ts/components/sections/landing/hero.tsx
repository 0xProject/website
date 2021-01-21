import * as React from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'react-use';
import { Button } from 'ts/components/button';
import { Hero } from 'ts/components/hero';
import { LandingAnimation } from 'ts/components/heroImage';

import { AnimationLoader } from 'ts/components/animations/animation_loader';

import { WebsitePaths } from 'ts/types';

export interface SectionlandingHeroProps {}

export const SectionLandingHero: React.FC<SectionlandingHeroProps> = () => {
    return (
        <>
            <Hero
                title={<span>The single endpoint for all DeFi liquidity</span>}
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
                                <AnimationLoader name={'depth'} loop={false} />
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
    const { width } = useWindowSize();
    const isMobile = width < 500;
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
}

const AnimationContainer = styled.div`
    /* max-height: 375px; */
    width: 100%;
    margin-bottom: 35px;
`;
