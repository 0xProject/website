import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/cjs/styles/hljs/vs2015';
import styled from 'styled-components';

import { AnimatedChatIcon } from 'ts/components/animatedChatIcon';
import { AnimatedCompassIcon } from 'ts/components/animatedCompassIcon';
import { AnimationLoader } from 'ts/components/animations/animation_loader';
import { BlockIconLink } from 'ts/components/blockIconLink';
import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { Hero } from 'ts/components/hero';
import { Icon } from 'ts/components/icon';
import { Section } from 'ts/components/newLayout';
import { SectionApiQuote } from 'ts/components/sections/landing/apiQuote';
import { SiteWrap } from 'ts/components/siteWrap';

import { colors } from 'ts/utils/colors';
import { constants } from 'ts/utils/constants';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { trackEvent } from 'ts/utils/google_analytics';
import { Translate } from 'ts/utils/translate';

import { WebsitePaths } from 'ts/types';

const trackZeroExApiAdConversion = () => {
    trackEvent('conversion', {
        send_to: constants.ZEROEX_API_GOOGLE_ADWORDS_CAMPAIGN,
    });
};

export interface ApiPageProps {
    location: Location;
    translate: Translate;
}

const OrderSourceViz = () => {
    return (
        <OrderExamplesVizContainer>
            <OrderExampleFrontOrder>
                <OrderExampleFlexContainer>
                    <OrderExampleTopRow>
                        <OrderExampleLabel>Sell 1,500 DAI for ETH</OrderExampleLabel>
                        <OrderExampleBestPriceLabel>Best price!</OrderExampleBestPriceLabel>
                    </OrderExampleTopRow>
                    <OrderExampleRoutingBreakdownRow>
                        <OrderVizMesh>
                            <OrderVizLabel>50% Balancer</OrderVizLabel>
                            <OrderVizBarBalancer />
                        </OrderVizMesh>
                        <OrderVizKyber>
                            <OrderVizLabel>25% 0x Mesh</OrderVizLabel>
                            <OrderVizBarMesh />
                        </OrderVizKyber>
                        <OrderVizUniswap>
                            <OrderVizLabel>25% Uniswap</OrderVizLabel>
                            <OrderVizBarUniswap />
                        </OrderVizUniswap>
                    </OrderExampleRoutingBreakdownRow>
                </OrderExampleFlexContainer>
            </OrderExampleFrontOrder>
            <OrderExampleBackingOrder />
        </OrderExamplesVizContainer>
    );
};

export const OrderRoutingSection = () => {
    return (
        <>
            <FlexColumnContainerWithMobileMargins>
                <SmallerTitle>
                    Focus on your product.
                    <br />
                    Let 0x find the best prices.
                </SmallerTitle>
                <Description style={{ marginBottom: 0, maxWidth: 524 }}>
                    Our smart order routing splits up your transaction across decentralized exchange networks to be
                    filled with the lowest slippage possible.
                </Description>
            </FlexColumnContainerWithMobileMargins>
            <FlexColumnContainer style={{ minHeight: 170 }}>
                <OrderSourceViz />
            </FlexColumnContainer>
        </>
    );
};

const ZeroExApi: React.FC<ApiPageProps> = () => {
    return (
        <SiteWrap theme="dark" shouldShowDisclaimerInFooter={true}>
            <DocumentTitle {...documentConstants.API} />
            <Hero
                title="Access all DEX liquidity through one API"
                isLargeTitle={false}
                labelText={'0x API'}
                isFullWidth={true}
                sectionPadding={'60px 0 120px 0'}
                description={
                    <WrappedDescription>
                        Easily integrate with 0x API once to aggregate liquidity from 0x Mesh, Kyber, Uniswap, and more
                        and swap tokens at the best price.
                    </WrappedDescription>
                }
                showFigureBottomMobile={true}
                isCenteredMobile={true}
                figure={
                    <AnimationContainer>
                        <AnimationLoader name={'0xApi'} />
                    </AnimationContainer>
                }
                maxWidthFigure="500px"
                maxWidthContent="600px"
                actions={
                    <Button onClick={() => trackZeroExApiAdConversion()} to={WebsitePaths.DocsApi} isInline={true}>
                        View API Docs
                    </Button>
                    // tslint:disable-next-line:jsx-curly-spacing
                }
            />
            {/* First below the fold section (order viz) */}
            {/* marginBottom={'70px'} */}
            <Section bgColor="dark" isFlex={true} maxWidth="1170px">
                <OrderRoutingSection />
            </Section>
            {/* Partner Logos */}
            <ResponsiveColumnSection
                justifyContent={'center'}
                bgColor="black"
                isFlex={true}
                maxWidth="1170px"
                padding={'84px 0 66px 0'}
                paddingMobile={'64px 0 40px 0'}
            >
                <div>
                    <LogoSectionColumnContainer>
                        <LogosTitle>Powering the future of open finance</LogosTitle>
                        <LogosUsingZeroExApiContainer>
                            <LogoExternalLink href={'https://www.nuo.network'} target="_blank" rel="noopener">
                                <LogoIconContainer>
                                    <Icon name={'0x-api-logos/nuo'} size={'natural'} />
                                </LogoIconContainer>
                            </LogoExternalLink>
                            <LogoExternalLink href={'https://zerion.io'} target="_blank" rel="noopener">
                                <LogoIconContainer>
                                    <Icon name={'0x-api-logos/zerion'} size={'natural'} />
                                </LogoIconContainer>
                            </LogoExternalLink>
                            <LogoExternalLink href={'https://fulcrum.trade'} target="_blank" rel="noopener">
                                <LogoIconContainer>
                                    <Icon name={'0x-api-logos/bzx'} size={'natural'} />
                                </LogoIconContainer>
                            </LogoExternalLink>
                            <LogoExternalLink href={'https://defisaver.com'} target="_blank" rel="noopener">
                                <LogoIconContainer>
                                    <Icon name={'0x-api-logos/defi-saver'} size={'natural'} />
                                </LogoIconContainer>
                            </LogoExternalLink>
                            <LogoExternalLink href={'https://topo.finance'} target="_blank" rel="noopener">
                                <LogoIconContainer>
                                    <Icon name={'0x-api-logos/topo'} size={'natural'} />
                                </LogoIconContainer>
                            </LogoExternalLink>
                        </LogosUsingZeroExApiContainer>
                    </LogoSectionColumnContainer>
                </div>
            </ResponsiveColumnSection>

            <SectionApiQuote />
            {/* JavaScript Code Sample Section */}
            <Section bgColor="dark" isFlex={true} maxWidth="1170px">
                <VerticalFlow>
                    <SmallerTitle>Swap tokens in any product experience</SmallerTitle>
                    <CenteredDescription>
                        Call the API to get a quote, pass the order through your smart contracts,
                        <br />
                        and execute the trade at the best price possible.
                    </CenteredDescription>
                    <div style={{ width: '100%', maxWidth: 1040 }}>
                        <SwapCodeExampleContainer>
                            <SwapCodeExampleTitleRow>
                                <SwapCodeLabel>Fill order in JavaScript with MetaMask</SwapCodeLabel>
                                <SwapCodeExampleLaunchExampleContainer>
                                    <Button
                                        fontSize={'16px'}
                                        target={'_blank'}
                                        href="https://codepen.io/kimpers/pen/zYqMdxE"
                                        isWithArrow={true}
                                        isAccentColor={true}
                                    >
                                        Launch in CodePen
                                    </Button>
                                </SwapCodeExampleLaunchExampleContainer>
                            </SwapCodeExampleTitleRow>
                            <SyntaxHighlighterContainer>
                                <SyntaxHighlighter
                                    style={dark}
                                    PreTag={TypescriptCodeSamplePre}
                                    showLineNumbers={true}
                                    language={'typescript'}
                                >
                                    {`// Get a quote to sell 1 ETH to buy DAI
const response = await fetch(
  'https://api.0x.org/swap/v1/quote?sellToken=ETH&buyToken=DAI&sellAmount=1000000000000000000'
);
const quote = await response.json();
// Send to ethereum with your favorite Web3 Library
window.web3.eth.sendTransaction(quote, (err, txId) => {
  console.log('Success!', txId);
});
`}
                                </SyntaxHighlighter>
                            </SyntaxHighlighterContainer>
                        </SwapCodeExampleContainer>
                    </div>
                </VerticalFlow>
            </Section>
            {/* Examples/guides section */}
            <ResponsiveFlexSection bgColor="black" isFlex={true} maxWidth="1170px">
                <FlexColumnContainer style={{ flex: 'inherit', marginRight: 120, flexWrap: 'wrap' }}>
                    <Title style={{ wordBreak: 'normal' }}>Get Started</Title>
                </FlexColumnContainer>
                <FlexColumnWrapped>
                    <ExampleRowContainer>
                        <ExampleLeftContainer>
                            <ExampleLabel>Swap Tokens with 0x API</ExampleLabel>
                            <ExampleDescription>Complete a token swap with 0x API using web3</ExampleDescription>
                        </ExampleLeftContainer>
                        <ExampleLink>
                            <Button
                                onClick={() => trackZeroExApiAdConversion()}
                                href="/docs/guides/swap-tokens-with-0x-api"
                                isWithArrow={true}
                                isAccentColor={true}
                            >
                                View Guide
                            </Button>
                        </ExampleLink>
                    </ExampleRowContainer>
                    <ExampleRowContainer>
                        <ExampleLeftContainer>
                            <ExampleLabel>Use 0x API Liquidity in Your Smart Contracts</ExampleLabel>
                            <ExampleDescription>
                                Complete a token swap in your smart contracts with 0x API
                            </ExampleDescription>
                        </ExampleLeftContainer>
                        <ExampleLink>
                            <Button
                                onClick={() => trackZeroExApiAdConversion()}
                                href="/docs/guides/use-0x-api-liquidity-in-your-smart-contracts"
                                isWithArrow={true}
                                isAccentColor={true}
                            >
                                View Guide
                            </Button>
                        </ExampleLink>
                    </ExampleRowContainer>
                </FlexColumnWrapped>
            </ResponsiveFlexSection>
            {/* More info/CTA section  */}
            <Section isPadded={false} isFlex={true} maxWidth="auto" wrapWidth="100%" flexBreakpoint="900px">
                <BlockIconLink
                    iconComponent={<AnimatedCompassIcon />}
                    title="Ready to build on 0x?"
                    linkLabel="Get Started"
                    linkUrl={WebsitePaths.DocsApi}
                />
                <BlockIconLink
                    iconComponent={<AnimatedChatIcon />}
                    title="Want help from the 0x team?"
                    linkLabel="Get in Touch"
                    linkUrl={constants.URL_ZEROEX_CHAT}
                    isExternalLink={true}
                />
            </Section>
        </SiteWrap>
    );
};

const TypescriptCodeSamplePre = styled.pre`
    background: ${colors.black} !important;
    overflow: auto;
    width: 100%;
    height: 100%;
    code {
        background-color: inherit !important;
        border-radius: 0px;
        font-family: 'Roboto Mono', sans-serif;
        border: none;
        font-size: 16px;
        line-height: 200%;
    }
    & .react-syntax-highlighter-line-number {
        margin-right: 15px;
        opacity: 0.5;
    }
`;

const FlexColumnContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const FlexColumnWrapped = styled(FlexColumnContainer)`
    overflow: hidden;
    width: 100%;
    max-width: 1040px;
`;

const Title = styled.h1`
    font-size: 50px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 30px;
    @media (max-width: 1024px) {
        font-size: 60px;
    }
    @media (max-width: 768px) {
        font-size: 46px;
    }
`;

const SmallerTitle = styled.h3`
    font-size: 34px;
    font-weight: 300;
    line-height: 42px;
    margin-bottom: 30px;
`;

const Description = styled.p`
    font-size: 22px;
    line-height: 31px;
    font-weight: 300;
    padding: 0;
    margin-bottom: 50px;
    color: ${props => props.theme.introTextColor};
`;

const OrderVizMesh = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(50% - 10px);
    justify-content: space-between;
    margin-right: 10px;
`;

const OrderVizKyber = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(25% - 5px);
    justify-content: space-between;
    margin-right: 10px;
`;

const OrderVizUniswap = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(25% - 5px);
`;

const BaseOrderVizBar = styled.div`
    height: 15px;
    width: 100%;
`;

const OrderVizBarMesh = styled(BaseOrderVizBar)`
    background-color: #14b094;
`;

const OrderVizBarBalancer = styled(BaseOrderVizBar)`
    background-color: #f5aa15;
`;

const OrderVizBarUniswap = styled(BaseOrderVizBar)`
    background-color: #c86dde;
`;

const SwapCodeExampleContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: ${colors.black};
    overflow-y: auto;
`;

const SyntaxHighlighterContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: ${colors.black};
    overflow-y: auto;
    padding: 20px;
`;

const ExampleRowContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const ExampleLeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin-bottom: 10px;
`;

const ExampleLabel = styled.div`
    font-size: 20px;
    color: #ffffff;
    margin-bottom: 15px;
`;

const ExampleDescription = styled.div`
    font-size: 18px;
    color: #8f8f8f;
`;

const ExampleLink = styled.div`
    padding: 4px 0;
`;

const VerticalFlow = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
`;

const CenteredDescription = styled(Description)`
    text-align: center;
`;

const OrderExamplesVizContainer = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    height: 170px;
    min-height: 170px;
    max-height: 170px;
    min-width: 430px;
    margin-left: 80px;
    @media (max-width: 1024px) {
        margin-right: 0px;
        margin-left: 0px;
    }
    @media (max-width: 500px) {
        min-height: 200px;
        min-width: inherit;
    }
`;

const OrderExampleFrontOrder = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    z-index: 1;
    background-color: #111a19;
    border: 1px solid rgba(162, 245, 235, 0.2);
`;

const OrderExampleFlexContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px;
`;

const OrderExampleRoutingBreakdownRow = styled.div`
    display: flex;
    width: 100%;
    flex: 1;
    flex-direction: row;
`;

const OrderVizLabel = styled.div`
    font-weight: 300;
    font-size: 14px;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #ffffff;
    opacity: 0.7;
    margin-bottom: 12px;
`;

const OrderExampleTopRow = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 45px;
`;

const OrderExampleLabel = styled.div`
    font-weight: 300;
    font-size: 22px;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #ffffff;
`;

const OrderExampleBestPriceLabel = styled.div`
    font-weight: 300;
    font-size: 18px;
    text-align: right;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #a2f5eb;
`;

const OrderExampleBackingOrder = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0;
    right: 0;
    z-index: 0;
    border: 1px solid rgba(162, 245, 235, 0.2);
    transform: translate(10px, -10px);
`;

const FlexColumnContainerWithMobileMargins = styled(FlexColumnContainer)`
    @media (max-width: 1024px) {
        margin-bottom: 40px;
    }
`;

const SwapCodeExampleTitleRow = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 10px 25px;
    border-bottom: 2px solid #111a19;
`;

const SwapCodeLabel = styled.div`
    font-size: 16px;
    color: #898990;
    padding: 4px 0;
    /* This is to offset the arrow in the link on the other side of the row */
    display: flex;
    align-self: flex-end;
`;

const SwapCodeExampleLaunchExampleContainer = styled.div`
    padding: 4px 0;
`;

const AnimationContainer = styled.div`
    max-height: 375px;
    margin-bottom: 35px;
`;

const ResponsiveFlexSection = styled(Section)`
    @media (max-width: 1040px) {
        flex-direction: column;
    }
`;

const ResponsiveColumnSection = styled(Section)`
    justify-content: center;

    @media (min-width: 768px) {
        justify-content: center;
    }
    /* @media (max-width: 1040px) { */
    /* flex-direction: column; */
    /* } */
`;

const LogosUsingZeroExApiContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const LogoIconContainer = styled.div`
    padding: 30px;
`;

const LogosTitle = styled.div`
    font-family: Formular;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #898990;
    margin-bottom: 10px;
    @media (max-width: 768px) {
        margin-bottom: 20px;
    }
`;

const LogoExternalLink = styled.a``;

const LogoSectionColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
`;

// This is strictly for above-the-fold line break aesthetics.
// These values were manually calculated and don't have any specific meaning.
const WrappedDescription = styled.div`
    padding-right: 70px;
    @media (max-width: 768px) {
        padding-right: inherit;
    }
`;

// tslint:disable-next-line: max-file-line-count
export { ZeroExApi };
