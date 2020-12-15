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
                title={<span>Liquidity Infrastructure<br/>for DeFi</span>}
                isLargeTitle={true}
                isFullWidth={true}
                maxWidth={'1280px'}
                sectionPadding={'120px 0 40px 0'}
                maxWidthFigure="850px"
                alignItems={'flex-start'}
                hideFigureOnMobile={true}
                showFigureBottomMobile={false}
                description="0x is a powerful liquidity aggregation API that allows you to access both on and off-chain DEX liquidity"
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
