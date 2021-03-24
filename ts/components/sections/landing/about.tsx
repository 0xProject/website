import _ from 'lodash';
import * as React from 'react';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { Link } from 'ts/components/link';
import { Section, WrapGrid } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';

const Wrap = styled.div`
    width: calc(50% - 4px);
    height: 450px;
    padding: 65px 45px 35px 45px;
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.darkBgColor};
    /* HACK(johnrjj) - Add a little more height to not overflow from 900 - 1400px */
    @media (max-width: 1400px) {
        height: 550px;
    }
    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        margin-top: 8px;
    }
`;

export const SectionLandingAbout = () => {
    const { width } = useWindowSize();
    const isMobile = width <= 769;

    return (
        <Section isPadded={false} isFlex={true} maxWidth="auto" wrapWidth="100%" flexBreakpoint="768px">
            <Wrap>
                <div>
                    <Heading marginBottom={'8px'} isCentered={true} asElement={'h3'} size={34}>
                        All the popular DEX networks
                    </Heading>
                    <Paragraph color={'#8F8F8F'} isCentered={true} marginBottom={'21px'}>
                        Don't ever worry about adding new sources, we have it covered.
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

            {!isMobile && (
                <MiddleContainerToAnchorPlus>
                    <MiddleContainerCircle>
                        <Icon width={'28px'} name={'plus-sign'} size={'natural'} />
                    </MiddleContainerCircle>
                </MiddleContainerToAnchorPlus>
            )}

            <Wrap>
                <div>
                    <Heading marginBottom={'34px'} isCentered={true} asElement={'h3'} size={34} textAlign={'center'}>
                        ...Plus exclusive 0x liquidity
                    </Heading>
                    {/* <Paragraph color={'#8F8F8F'} isCentered={true} isMuted={1} marginBottom={'36px'}>
                    Gain access to liquidity you can’t get anywhere else.
                </Paragraph> */}
                </div>

                <div>
                    <CheckboxOptionsGridContainer>
                        <ApiFeatureContainerRow>
                            <ApiFeatureIconContainer>
                                <Icon name={'market-maker'} size={'natural'} />
                            </ApiFeatureIconContainer>
                            <ApiFeatureDetailsColumn>
                                <ApiFeaturePrimaryText>Professional Market Makers</ApiFeaturePrimaryText>
                                <ApiFeatureSecondaryText>
                                    Offer competitive pricing through{' '}
                                    <span style={{ color: '#00AE99' }}>
                                        <Link
                                            href={`/docs/guides/rfqt-in-the-0x-api`}
                                            isNoArrow={true}
                                            isBlock={false}
                                            shouldOpenInNewTab={true}
                                            target="_blank"
                                        >
                                            0x's RFQ system{' '}
                                        </Link>
                                    </span>
                                </ApiFeatureSecondaryText>
                            </ApiFeatureDetailsColumn>
                        </ApiFeatureContainerRow>
                        <ApiFeatureContainerRow>
                            <ApiFeatureIconContainer>
                                <Icon name={'candles'} size={'natural'} />
                            </ApiFeatureIconContainer>
                            <ApiFeatureDetailsColumn>
                                <ApiFeaturePrimaryText>0x’s Open Orderbook</ApiFeaturePrimaryText>
                                <ApiFeatureSecondaryText>
                                    Enables free limit orders and true peer to peer liquidity
                                </ApiFeatureSecondaryText>
                            </ApiFeatureDetailsColumn>
                        </ApiFeatureContainerRow>
                        <ApiFeatureContainerRow>
                            <ApiFeatureIconContainer>
                                <Icon name={'liquidity'} size={'natural'} />
                            </ApiFeatureIconContainer>
                            <ApiFeatureDetailsColumn>
                                <ApiFeaturePrimaryText>Private Liquidity Pools</ApiFeaturePrimaryText>
                                <ApiFeatureSecondaryText>
                                    Access AMM liquidity that you can’t get anywhere else
                                </ApiFeatureSecondaryText>
                            </ApiFeatureDetailsColumn>
                        </ApiFeatureContainerRow>
                    </CheckboxOptionsGridContainer>
                </div>

                {/* <div style={{ margin: '0 auto' }}>
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
            </div> */}
            </Wrap>
        </Section>
    );
};

const MiddleContainerCircle = styled.div`
    height: 68px;
    width: 68px;
    border-radius: 100%;
    background-color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-30px);
    @media (max-width: 768px) {
        margin: 0 auto;
        transform: none;
    }
`;

const MiddleContainerToAnchorPlus = styled.div`
    height: 100%;
    width: 8px;
    position: relative;
    align-self: center;
    @media (max-width: 768px) {
        transform: none;
        width: 100%;
        margin-top: 30px;
    }
`;

const ApiFeatureIconContainer = styled.div`
    margin-right: 30px;
    @media (max-width: 768px) {
        margin-bottom: 14px;
        margin-right: 0px;
    }
`;

const CheckboxOptionsGridContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 550px;
    margin: 0 auto;
`;

const ApiFeatureContainerRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 32px;
    @media (max-width: 768px) {
        transform: none;
        width: 100%;
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 16px;
    }
`;

const ApiFeaturePrimaryText = styled.div`
    font-family: Formular;
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 26px;
    color: #ffffff;
    @media (max-width: 768px) {
        margin-bottom: 12px;
    }
`;

const ApiFeatureSecondaryText = styled(ApiFeaturePrimaryText as any)`
    font-weight: 300;
    font-size: 18px;
    line-height: 26px;
    color: #8f8f8f;
`;

const ApiFeatureDetailsColumn = styled.div`
    display: flex;
    flex-direction: column;
    @media (max-width: 768px) {
        align-items: center;
        max-width: 250px;
        text-align: center;
    }
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
        name: 'more',
        imageUrl: 'images/clients2/more.svg',
        persistOnMobile: true,
    },
];

const StyledProject = styled.div<StyledProjectInterface>`
    flex-shrink: 1;

    img {
        object-fit: contain;
        height: 100%;
    }

    @media (min-width: 768px) {
        width: auto;
        margin: 15px 20px;
    }

    @media (max-width: 1200px) {
        /* width: auto; */
        max-width: 38%;
        height: auto;
        margin: 10px 12px;
        display: ${(props) => !props.isOnMobile && 'none'};
    }
`;
