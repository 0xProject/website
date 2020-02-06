import { BigNumber, logUtils } from '@0x/utils';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
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
import { SiteWrap } from 'ts/components/siteWrap';

import { colors } from 'ts/utils/colors';
import { constants } from 'ts/utils/constants';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { trackEvent } from 'ts/utils/google_analytics';
import { Translate } from 'ts/utils/translate';
import { utils } from 'ts/utils/utils';

import { WebsitePaths } from 'ts/types';

import { State } from 'ts/redux/reducer';

// tslint:disable-next-line: no-empty
const noop = () => {};

const trackZeroExApiAdConversion = () => {
    trackEvent('conversion', {
        send_to: constants.ZEROEX_API_GOOGLE_ADWORDS_CAMPAIGN,
        event_callback: noop,
    });
};

export interface ApiPageProps {
    location: Location;
    translate: Translate;
}

const ZeroExApi: React.FC<ApiPageProps> = () => {
    const networkId = useSelector((state: State) => state.networkId);
    const [isCopied, setIsCopied] = React.useState<boolean>(false);
    const copyButtonText = isCopied ? 'Copied!' : 'Copy to clipboard';

    const handleCopyClick = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
    };

    const [quote, setQuote] = useState<any | undefined>();

    const takerAmount = new BigNumber(100000000); // 100$ in usdc (USDC == 6 digits)
    const formattedTakerAmount = takerAmount.dividedToIntegerBy(1).toString();

    const API_BASE = utils.getAPIBaseUrl(networkId || 1);
    const quoteEndpoint = `${API_BASE}/swap/v0/quote?sellAmount=${formattedTakerAmount}&buyToken=DAI&sellToken=USDC`;
    // Surround endpoint in quotes so users can directly curl this (otherwise the ampersands escape out when pasting into terminal)
    const copyableQuoteEndpoint = `"${quoteEndpoint}"`;

    React.useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch(quoteEndpoint);
                const fetchedQuote = await res.json();
                setQuote(fetchedQuote);
            } catch (e) {
                logUtils.warn('Error fetching quote for 0x API markeing page', e);
            }
        };
        // tslint:disable-next-line: no-floating-promises
        fetchQuote();
    }, [quoteEndpoint]);

    return (
        <SiteWrap theme="dark">
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
                figureMaxWidth="500px"
                maxWidth="600px"
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
                <FlexColumnContainerWithMobileMargins>
                    <SmallerTitle>
                        Focus on your product.
                        <br />
                        Let 0x find the best prices.
                    </SmallerTitle>
                    <Description style={{ marginBottom: 0, maxWidth: 524 }}>
                        Smart order routing splits up your transaction across decentralized exchange networks to be
                        filled with the lowest slippage possible.
                    </Description>
                </FlexColumnContainerWithMobileMargins>
                <FlexColumnContainer style={{ minHeight: 170 }}>
                    <OrderExamplesVizContainer>
                        <OrderExampleFrontOrder>
                            <OrderExampleFlexContainer>
                                <OrderExampleTopRow>
                                    <OrderExampleLabel>Sell 1,500 DAI for ETH</OrderExampleLabel>
                                    <OrderExampleBestPriceLabel>Best price!</OrderExampleBestPriceLabel>
                                </OrderExampleTopRow>
                                <OrderExampleRoutingBreakdownRow>
                                    <OrderVizMesh>
                                        <OrderVizLabel>50% 0x Mesh</OrderVizLabel>
                                        <OrderVizBarMesh />
                                    </OrderVizMesh>
                                    <OrderVizKyber>
                                        <OrderVizLabel>25% Kyber</OrderVizLabel>
                                        <OrderVizBarKyber />
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
                </FlexColumnContainer>
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

            {/* Get a quote section - API curl & request/response JSON */}
            <Section bgColor="dark" isFlex={true} maxWidth="1170px" marginBottom={'40px'}>
                <FlexColumnContainer>
                    <PadddedFlexColumnContainer>
                        <SmallerTitle>Easily get a quote</SmallerTitle>
                        <Description style={{ marginBottom: 45, maxWidth: 460 }}>
                            0x API automatically creates an order that can be passed directly to your smart contracts to
                            be settled on-chain. No API key required.
                        </Description>
                        <AllValuePropsContainer>
                            <ValuePropContainer>
                                <Checkmark />
                                <ValuePropDescription>Liquidity is always getting better</ValuePropDescription>
                            </ValuePropContainer>
                            <ValuePropContainer>
                                <Checkmark />
                                <ValuePropDescription>Fast response times and low revert rates</ValuePropDescription>
                            </ValuePropContainer>
                            <ValuePropContainer>
                                <Checkmark />
                                <ValuePropDescription>Open source, flexible integration</ValuePropDescription>
                            </ValuePropContainer>
                        </AllValuePropsContainer>
                        <CallToActionContainer>
                            <Button
                                key={`dlink-docs-link`}
                                isWithArrow={true}
                                isAccentColor={true}
                                to={WebsitePaths.DocsApi}
                                target={undefined}
                                onClick={() => trackZeroExApiAdConversion()}
                            >
                                View API Documentation
                            </Button>
                        </CallToActionContainer>
                    </PadddedFlexColumnContainer>
                </FlexColumnContainer>
                <FlexColumnWrapped>
                    <RequestContainer>
                        <RequestLabelRow>
                            <Label>Get Price Quote</Label>
                            <CopyToClipboard text={copyableQuoteEndpoint} onCopy={handleCopyClick}>
                                <SecondaryLabel>{copyButtonText}</SecondaryLabel>
                            </CopyToClipboard>
                        </RequestLabelRow>
                        <RequestEndpointRow>
                            <EndpointLabel>
                                <CurlEndpointLabel>curl </CurlEndpointLabel>
                                <CurlEndpointText> https://api.0x.org/swap/v0/quote</CurlEndpointText>
                            </EndpointLabel>
                        </RequestEndpointRow>
                        <RequestConfigurationRow>
                            <RequestConfigurationDetail>
                                <RequestConfigurationDetailLabel>buyAmount</RequestConfigurationDetailLabel>
                                <RequestConfigurationDetailValue>100</RequestConfigurationDetailValue>
                            </RequestConfigurationDetail>
                            <RequestConfigurationDetail>
                                <RequestConfigurationDetailLabel>buyToken</RequestConfigurationDetailLabel>
                                <RequestConfigurationDetailValue>DAI</RequestConfigurationDetailValue>
                            </RequestConfigurationDetail>
                            <RequestConfigurationDetail>
                                <RequestConfigurationDetailLabel>sellToken</RequestConfigurationDetailLabel>
                                <RequestConfigurationDetailValue>USDC</RequestConfigurationDetailValue>
                            </RequestConfigurationDetail>
                        </RequestConfigurationRow>
                    </RequestContainer>
                    <ResponseContainer>
                        <SyntaxHighlighter
                            language={'json'}
                            style={customJsonSyntaxStyle}
                            PreTag={FadedJSONResponsePre}
                        >
                            {quote ? JSON.stringify(quote, null, 2) : ''}
                        </SyntaxHighlighter>
                    </ResponseContainer>
                </FlexColumnWrapped>
            </Section>
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
                                        href="https://codepen.io/fragosti/pen/xxbmgqy"
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
  'https://api.0x.org/swap/v0/quote?sellToken=ETH&buyToken=DAI&sellAmount=1000000000000000000'
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
                    {/* TODO(johnrjj) -- Uncomment when released */}
                    {/* <ExampleRowContainer>
                        <ExampleLeftContainer>
                            <ExampleLabel>Margin trading with 0x API</ExampleLabel>
                            <ExampleDescription>
                                Create a margin trading DeFi product using 0x API
                            </ExampleDescription>
                        </ExampleLeftContainer>
                        <ExampleLink>
                            <Button href="/docs/api" isWithArrow={true} isAccentColor={true}>
                                View Guide
                            </Button>
                        </ExampleLink>
                    </ExampleRowContainer> */}
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

const JSONResponsePre = styled.pre`
    background: ${colors.black} !important;
    margin: 0px;
    line-height: 100%;
    overflow: auto;
    width: 100%;
    height: 100%;
    code {
        background-color: inherit !important;
        border-radius: 0px;
        font-family: 'Roboto Mono', sans-serif;
        border: none;
        font-size: 14px;
        line-height: 200%;
    }
`;

const FadedJSONResponsePre = styled(JSONResponsePre)`
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 80px;
        background: linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 123.86%);
    }
`;

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

const customJsonSyntaxStyle = {
    'hljs-comment': {
        color: '#7e7887',
    },
    'hljs-quote': {
        color: '#7e7887',
    },
    'hljs-variable': {
        color: '#be4678',
    },
    'hljs-attribute': {
        color: '#ffffff',
    },
    // JSON keys
    'hljs-attr': {
        color: '#7CFFCB',
    },
    'hljs-number': {
        color: '#c994ff',
    },
    'hljs-literal': {
        color: '#aa573c',
    },
    'hljs-type': {
        color: '#aa573c',
    },
    'hljs-params': {
        color: '#aa573c',
    },
    'hljs-string': {
        color: '#ffffff',
    },
    'hljs-symbol': {
        color: '#2a9292',
    },
    hljs: {
        display: 'block',
        overflowX: 'auto',
        background: '#003831',
        color: '#7cffcb',
        fontSize: '16px',
    },
};

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
    background-color: #ffffff;
`;

const OrderVizBarKyber = styled(BaseOrderVizBar)`
    background-color: #60c39d;
`;

const OrderVizBarUniswap = styled(BaseOrderVizBar)`
    background-color: #c86dde;
`;

const Label = styled.div`
    font-style: normal;
    font-feature-settings: 'tnum' on, 'lnum' on;
    font-weight: 300;
    font-size: 16px;
    color: #898990;
`;

const SecondaryLabel = styled(Label)`
    font-size: 16px;
    cursor: pointer;
    text-align: right;
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

const RequestContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${colors.black};
    margin-bottom: 20px;
`;

const ResponseContainer = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: 350px;
    max-height: 350px;
    max-width: 600px;
    padding: 20px;
    overflow-y: auto;
    background-color: ${colors.black};
`;

const EndpointLabel = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    font-family: Formular Mono;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: ${colors.white};
`;

const RequestLabelRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px 12px 20px;
    border-bottom: 1px solid #111a19;
`;

const RequestEndpointRow = styled.div`
    padding: 20px 20px 0 20px;
    margin-bottom: 24px;
`;

const RequestConfigurationRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0px 20px 0 20px;
    margin-bottom: 20px;
    max-width: 440px;

    @media (max-width: 500px) {
        flex-direction: column;
    }
`;

const RequestConfigurationDetail = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 5px;

    @media (max-width: 500px) {
        margin-bottom: 20px;
    }
`;

const RequestConfigurationDetailLabel = styled.div`
    color: #8f8f8f;
    margin-bottom: 12px;
`;

const RequestConfigurationDetailValue = styled.div`
    font-family: Roboto Mono;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on;
    color: #ffffff;
`;

const AllValuePropsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
`;

const ValuePropContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 25px;
`;

const ValuePropDescription = styled.div`
    margin-left: 12px;
`;

const CallToActionContainer = styled.div`
    margin-bottom: 25px;
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

const PadddedFlexColumnContainer = styled(FlexColumnContainer)`
    padding-right: 80px;
    @media (max-width: 1024px) {
        padding-right: 60px;
    }
    @media (max-width: 768px) {
        padding-right: 40px;
    }
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

const Checkmark = () => (
    <svg id="checkmark-icon" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 1L6 12L1 7" stroke="#00AE99" strokeWidth="1.4" />
    </svg>
);

const CurlEndpointLabel = styled.div`
    color: #7cffcb;
    margin-right: 5px;
    font-size: 16px;
    @media (max-width: 500px) {
        font-size: 14px;
        margin-bottom: 5px;
    }
`;

const CurlEndpointText = styled.div`
    font-size: 16px;
    @media (max-width: 500px) {
        font-size: 14px;
        word-break: break-word;
    }
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
