import { BigNumber, logUtils } from '@0x/utils';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Checkmark } from 'ts/components/checkmark';
import { Section } from 'ts/components/newLayout';

import { colors } from 'ts/utils/colors';
import { constants } from 'ts/utils/constants';
import { trackEvent } from 'ts/utils/google_analytics';
import { utils } from 'ts/utils/utils';

import { WebsitePaths } from 'ts/types';

import { State } from 'ts/redux/reducer';

const trackZeroExApiAdConversion = () => {
    trackEvent('conversion', {
        send_to: constants.ZEROEX_API_GOOGLE_ADWORDS_CAMPAIGN,
    });
};

export const SectionApiQuote = () => {
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
    const quoteEndpoint = `${API_BASE}/swap/v1/quote?sellAmount=${formattedTakerAmount}&buyToken=DAI&sellToken=USDC`;
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
        <Section bgColor="dark" isFlex={true} maxWidth="1170px" marginBottom={'40px'}>
            <FlexColumnContainer>
                <PadddedFlexColumnContainer>
                    <SmallerTitle style={{ maxWidth: 420 }}>Swap tokens with a few lines of code</SmallerTitle>
                    <Description style={{ marginBottom: 45, maxWidth: 460 }}>
                        Automatically create orders that can be passed directly through your smart contracts to be
                        settled on-chain.
                    </Description>
                    <AllValuePropsContainer>
                        <ValuePropContainer>
                            <Checkmark />
                            <ValuePropDescription>Fetch Quotes</ValuePropDescription>
                        </ValuePropContainer>
                        <ValuePropContainer>
                            <Checkmark />
                            <ValuePropDescription>Create Market & Limit Orders</ValuePropDescription>
                        </ValuePropContainer>
                        <ValuePropContainer>
                            <Checkmark />
                            <ValuePropDescription>Swap Arbitrary Tokens</ValuePropDescription>
                        </ValuePropContainer>
                    </AllValuePropsContainer>
                    <CallToActionContainer>
                        <Button
                            key={`dlink-docs-link`}
                            isInline={true}
                            // isWithArrow={true}
                            // isAccentColor={true}
                            to={WebsitePaths.DocsApi}
                            target={undefined}
                            onClick={() => trackZeroExApiAdConversion()}
                        >
                            Explore API Docs
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
                            <CurlEndpointText> https://api.0x.org/swap/v1/quote</CurlEndpointText>
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
                    <SyntaxHighlighter language={'json'} style={customJsonSyntaxStyle} PreTag={FadedJSONResponsePre}>
                        {quote ? JSON.stringify(quote, null, 2) : ''}
                    </SyntaxHighlighter>
                </ResponseContainer>
            </FlexColumnWrapped>
        </Section>
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

const SmallerTitle = styled.h3`
    font-weight: 300;
    font-size: 34px;
    line-height: 42px;
    margin-bottom: 30px;
`;

const Description = styled.p`
    font-size: 22px;
    line-height: 31px;
    font-weight: 300;
    padding: 0;
    margin-bottom: 50px;
    color: ${(props) => props.theme.introTextColor};
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

const PadddedFlexColumnContainer = styled(FlexColumnContainer)`
    padding-right: 80px;
    @media (max-width: 1024px) {
        padding-right: 60px;
    }
    @media (max-width: 768px) {
        padding-right: 40px;
    }
`;

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
