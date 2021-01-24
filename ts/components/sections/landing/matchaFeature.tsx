import * as React from 'react';
import { animated, useTransition } from 'react-spring';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Section } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';

import { Icon } from 'ts/components/icon';

const Wrap = styled.div`
    position: relative;
    width: calc(50%);
    min-height: 260px;
    padding: 45px 0;
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.darkBgColor};

    @media (max-width: 900px) {
        width: 100%;
        margin-top: 30px;
    }
`;

const AbsoluteWrap = styled.div`
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
`;
const AniamtedAbsoluteWrap = animated(AbsoluteWrap);

const MatchaCupCopntainer = styled.div`
    padding: 0;
    align-items: center;
`;

enum PossibleFeatures {
    Matcha = 'matcha_feature',
    Metamask = 'metamask_feature',
    Shapeshift = 'shapeshift_feature',
    DeFiSaver = 'defisaver_feature',
    Rari = 'rari_feature',
    Prysm = 'prysm_feature',
    Zapper = 'zapper_feature',
}

interface FeatureMetadata {
    title: string;
    description: string;
    url: string;
    buttonText: string;
    iconName: string;
    feature: PossibleFeatures;
}

const featureMetadatas: { [s in PossibleFeatures]: FeatureMetadata } = {
    matcha_feature: {
        title: 'Matcha',
        description:
            'Matcha is the global search engine for liquidity and markets that enables users to trade tokens at the best price through a world class interface.',
        url: 'https://matcha.xyz',
        buttonText: 'Trade on Matcha',
        iconName: 'integrators/matcha',
        feature: PossibleFeatures.Matcha,
    },
    metamask_feature: {
        title: 'MetaMask',
        description:
            'MetaMask is your gateway to Web3. Buy, send and swap tokens globally and interact with dapps at lightning speed. Trusted by over 1MM users worldwide.',
        url: 'https://metamask.io/',
        buttonText: 'Visit MetaMask',
        iconName: 'integrators/metamask',
        feature: PossibleFeatures.Metamask,
    },
    shapeshift_feature: {
        title: 'ShapeShift',
        description: `Since 2014, ShapeShift has been pioneering self-custody for digital asset trading. The company's new web and mobile platform allows users to safely buy, hold, and trade digital assets.`,
        url: 'https://shapeshift.com/',
        buttonText: 'Visit ShapeShift',
        iconName: 'integrators/shapeshift',
        feature: PossibleFeatures.Shapeshift,
    },
    defisaver_feature: {
        title: 'DeFi Saver',
        description:
            'DeFi Saver is a portfolio management app for lending protocols such as MakerDAO, Compound and Aave with advanced and automated leverage management features.',
        url: 'https://defisaver.com',
        buttonText: 'Visit DeFi Saver',
        iconName: 'integrators/defi-saver',
        feature: PossibleFeatures.DeFiSaver,
    },
    rari_feature: {
        title: 'Rari',
        description:
            'Rari Capital is a non-custodial DeFi robo-advisor that uses the 0x API to swap between stablecoins to optimize for the highest yield.',
        url: 'https://rari.capital',
        buttonText: 'Visit Rari',
        iconName: 'integrators/rari',
        feature: PossibleFeatures.Rari,
    },
    prysm_feature: {
        title: 'Prysm',
        description:
            'Prysm is a next generation social trading network. Prysm helps traders discover and execute their next trade while helping Creators monetize trade ideas and other products.',
        url: 'https://prysm.xyz',
        buttonText: 'Visit Prysm',
        iconName: 'integrators/prysm',
        feature: PossibleFeatures.Prysm,
    },
    zapper_feature: {
        title: 'Zapper',
        description:
            'Zapper is an asset management platform that allows users to deploy capital across multiple DeFi protocols with one click.',
        url: 'https://zapper.fi',
        buttonText: 'Visit Zapper',
        iconName: 'integrators/zapper',
        feature: PossibleFeatures.Zapper,
    },
};

// logos
const ResponsiveColumnSection = styled(Section)`
    justify-content: center;
    @media (min-width: 768px) {
        justify-content: center;
    }
`;

const LogosUsingZeroExApiContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const LogoIconContainer = styled.div<{ active: boolean }>`
    padding: 27px 28px;
    @media (max-width: 900px) {
        padding: 10px 20px;
    }
    cursor: pointer;
    transition: opacity 0.15s ease-in-out;
    opacity: ${(props) => (props.active ? 1 : 0.4)};
    :hover {
        opacity: ${(props) => (props.active ? 1 : 0.8)};
    }
`;

const LogoExternalLink = styled.div``;

const LogoSectionColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
`;

const SectionFeatures = () => {
    const [activeFeature, setactiveFeature] = React.useState<PossibleFeatures>(PossibleFeatures.Matcha);

    const transitions = useTransition(activeFeature, (i) => i, {
        from: {
            transform: 'translate3d(0,8px,0)',
            opacity: 0,
        },
        enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
        leave: { transform: 'translate3d(0,-8px,0)', opacity: 0 },
    });

    const activeFeatureMetadata = featureMetadatas[activeFeature];

    return (
        <>
            {/* active feature */}
            <Section bgColor="dark" isFlex={true} maxWidth="1170px" marginBottom={'15px'} padding={'42px 0 40px 0'}>
                <Wrap style={{ padding: '40px 0 0 0' }}>
                    {transitions.map(({ item: featureKeyTransitioning, key, props }) => {
                        const featureKeyTransitioningMetadata = featureMetadatas[featureKeyTransitioning];
                        return (
                            <AniamtedAbsoluteWrap
                                key={key}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '20px 0 10px 0',
                                    ...props,
                                }}
                            >
                                <div>
                                    <Heading asElement={'h3'} size={34}>
                                        {featureKeyTransitioningMetadata?.title}{' '}
                                        {featureKeyTransitioning === PossibleFeatures.Matcha && (
                                            <span style={{ color: '#8F8F8F' }}> by 0x</span>
                                        )}
                                    </Heading>
                                    <div style={{ maxWidth: 565 }}>
                                        <Paragraph fontSize={'22px'} color={'#8F8F8F'}>
                                            {featureKeyTransitioningMetadata?.description}
                                        </Paragraph>
                                    </div>
                                </div>

                                <div style={{ width: 248 }}>
                                    <Button
                                        isFullWidth={true}
                                        shouldUseAnchorTag={true}
                                        target={'_blank'}
                                        href={featureKeyTransitioningMetadata?.url ?? '#'}
                                    >
                                        {featureKeyTransitioningMetadata.buttonText}
                                    </Button>
                                </div>
                            </AniamtedAbsoluteWrap>
                        );
                    })}
                </Wrap>

                <Wrap style={{ minHeight: 316 }}>
                    {transitions.map(({ item: featureKeyTransitioning, key, props }) => {
                        return (
                            <AniamtedAbsoluteWrap
                                key={key}
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...props }}
                            >
                                <MatchaCupCopntainer style={{ padding: '0 8px' }}>
                                    <Icon name={featureKeyTransitioning} size={'natural'} />
                                </MatchaCupCopntainer>
                            </AniamtedAbsoluteWrap>
                        );
                    })}
                </Wrap>
            </Section>
            {/* logos */}
            <ResponsiveColumnSection
                justifyContent={'center'}
                bgColor="black"
                isFlex={true}
                maxWidth="1420px"
                padding={'0px 0px 66px 0px'}
                marginBottom={'20px'}
                paddingMobile={'64px 0 40px 0'}
            >
                <div>
                    <LogoSectionColumnContainer>
                        <LogosUsingZeroExApiContainer>
                            {Object.values(featureMetadatas).map((feature) => {
                                return (
                                    <LogoExternalLink
                                        key={feature.feature}
                                        onClick={() => setactiveFeature(feature.feature)}
                                    >
                                        <LogoIconContainer active={feature.feature === activeFeatureMetadata.feature}>
                                            <Icon name={feature.iconName} size={'natural'} />
                                        </LogoIconContainer>
                                    </LogoExternalLink>
                                );
                            })}
                        </LogosUsingZeroExApiContainer>
                    </LogoSectionColumnContainer>
                </div>
            </ResponsiveColumnSection>
        </>
    );
};

export { SectionFeatures };
