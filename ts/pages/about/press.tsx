import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { AboutPageLayout } from 'ts/components/aboutPageLayout';
import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { Column, FlexWrap } from 'ts/components/newLayout';
import { Paragraph } from 'ts/components/text';
import { documentConstants } from 'ts/utils/document_meta_constants';

interface HighlightProps {
    logo: string;
    outlet: Outlets;
    text: string;
    href: string;
    date: string;
    buttonText?: string;
}

interface HighlightItemProps {
    highlight: HighlightProps;
}

type Outlets =
    | 'Forbes'
    | 'TechCrunch'
    | 'VentureBeat'
    | 'Decrypt'
    | 'CoinDesk'
    | 'CoinTelegraph'
    | 'The Block'
    | 'Fortune'
    | 'Bloomberg';

type Dimensions = {
    [O in Outlets]: { width: number; height: number };
};

const dimensions: Dimensions = {
    Forbes: {
        width: 84,
        height: 22,
    },
    TechCrunch: {
        width: 166,
        height: 29,
    },
    VentureBeat: {
        width: 141,
        height: 18,
    },
    Decrypt: {
        width: 110,
        height: 41,
    },
    CoinDesk: { width: 134, height: 26 },
    CoinTelegraph: {
        width: 160,
        height: 39,
    },
    Fortune: {
        width: 100,
        height: 25,
    },
    Bloomberg: {
        width: 120,
        height: 30,
    },
    'The Block': {
        width: 139,
        height: 25,
    },
};

const highlights: HighlightProps[] = [
    {
        logo: '/images/press/bloomberg.png',
        outlet: 'Bloomberg',
        text: '0x Labs raises $70M led by Greylock. Clip from interview with Greylock Partner, Sarah Guo',
        href: 'https://vimeo.com/manage/videos/709190667',
        date: 'April 27, 2022',
        buttonText: 'Watch Video',
    },
    {
        logo: '/images/press/logo-forbes.png',
        outlet: 'Forbes',
        text: 'Coinbase NFT partner 0x Labs raises $70 million from Greylock Partners, Jump Crypto, and Jared Leto',
        href:
            'https://www.forbes.com/sites/ninabambysheva/2022/04/26/coinbase-nft-partner-0x-labs-raises-70-million-from-greylock-partners-jump-crypto-and-jared-leto',
        date: 'April 26, 2022',
    },
    {
        logo: '/images/press/the-block.png',
        outlet: 'The Block',
        text: 'Coinbase NFT marketplace goes live in beta for select customers',
        href: 'https://www.theblockcrypto.com/post/142684/coinbase-nft-marketplace-beta-launch',
        date: 'April 20, 2022',
    },
    {
        logo: '/images/press/decrypt.png',
        outlet: 'Decrypt',
        text: 'Latest version of 0x to allow NFT swaps on Ethereum, Avalanche, Fantom, and others',
        href: 'https://decrypt.co/91603/latest-version-0x-allow-nft-swaps-ethereum-avalanche-fantom-others',
        date: 'January 31, 2022',
    },
    {
        logo: '/images/press/cointelegraph_e.png',
        outlet: 'CoinTelegraph',
        text: '0x expands partnership with Celo to distribute $4.5M to DAO ecosystem',
        href: 'https://cointelegraph.com/news/0x-expands-partnership-with-celo-to-distribute-4-5m-to-dao-ecosystem',
        date: 'December 3, 2021',
    },
    {
        logo: '/images/press/cointelegraph_e.png',
        outlet: 'CoinTelegraph',
        text: '0x takes initial steps toward decentralizing governance',
        href: 'https://cointelegraph.com/news/amm-aggregator-0x-takes-initial-steps-towards-decentralizing-governance',
        date: 'February 12, 2021',
    },
    {
        logo: '/images/press/coindesk_e.png',
        outlet: 'CoinDesk',
        text: '0x Labs closes $15M fundraising round as ZRX finds DeFi market fit',
        href:
            'https://www.coindesk.com/business/2021/02/05/0x-labs-closes-15m-fundraising-round-as-zrx-finds-defi-market-fit/',
        date: 'February 5, 2021',
    },
    {
        logo: '/images/press/decrypt.png',
        outlet: 'Decrypt',
        text: 'Polygon, 0x spend $10.5 million in Ethereum DeFi developer push',
        href: 'https://decrypt.co/73250/polygon-10-million-ethereum-defi-developer-push',
        date: 'January 10, 2021',
    },
    {
        logo: '/images/press/decrypt.png',
        outlet: 'Decrypt',
        text: 'Matcha: 0x is looking to give decentralized exchanges a makeover',
        href: 'https://decrypt.co/34023/matcha-0x-is-looking-to-give-decentralized-exchanges-a-makeover',
        date: 'January 30, 2020',
    },
    {
        logo: '/images/press/logo-forbes.png',
        outlet: 'Forbes',
        text: '0x launches Instant, delivers an easy and flexible way to buy crypto tokens',
        href:
            'https://www.forbes.com/sites/rebeccacampbell1/2018/12/06/0x-launches-instant-delivers-an-easy-and-flexible-way-to-buy-crypto-tokens/#bfb73a843561',
        date: 'December 6, 2018',
    },
    {
        logo: '/images/press/logo-venturebeat.png',
        outlet: 'VentureBeat',
        text: '0x leads the way for ‘tokenization’ of the world, and collectible game items are next',
        href:
            'https://venturebeat.com/2018/09/24/0x-leads-the-way-for-tokenization-of-the-world-and-collectible-game-items-are-next/',
        date: 'September 24, 2018',
    },
    {
        logo: '/images/press/logo-fortune.png',
        outlet: 'Fortune',
        text: 'Security tokens get a boost as PayPal vet joins 0x board',
        href: 'http://fortune.com/2018/09/06/0x-harbor-blockchain/',
        date: 'September 6, 2018',
    },
    {
        logo: '/images/press/logo-techcrunch.png',
        outlet: 'TechCrunch',
        text: '0x lets any app be the Craigslist of cryptocurrency',
        href: 'https://techcrunch.com/2018/07/16/0x/',
        date: 'July 16, 2018',
    },
];

export const NextAboutPress = () => (
    <AboutPageLayout
        title="Press Highlights"
        description={
            <>
                <Paragraph size="medium" marginBottom="60px" isMuted={0.65}>
                    Contact: <Link href="mailto:press@0x.org">press@0x.org</Link>
                </Paragraph>

                {_.map(highlights, (highlight, index) => (
                    <Highlight key={`highlight-${index}`} highlight={highlight} />
                ))}
            </>
        }
    >
        <DocumentTitle {...documentConstants.PRESS} />
    </AboutPageLayout>
);

export const Highlight: React.FunctionComponent<HighlightItemProps> = (props: HighlightItemProps) => {
    const { highlight } = props;
    return (
        <HighlightWrap>
            <Column>
                <div>
                    <HighlightDateText>{highlight.date}</HighlightDateText>
                    <img
                        src={highlight.logo}
                        alt={highlight.outlet}
                        height={dimensions[highlight.outlet].height}
                        width={dimensions[highlight.outlet].width}
                    />
                </div>
            </Column>

            <PressEntryColumn width="60%" maxWidth="560px">
                <Paragraph isMuted={false}>{highlight.text}</Paragraph>
                <Button href={highlight.href} isWithArrow={true} isNoBorder={true} target="_blank">
                    {highlight.buttonText || 'Read Article'}
                </Button>
            </PressEntryColumn>
        </HighlightWrap>
    );
};

const HighlightWrap = styled(FlexWrap)`
    border-top: 1px solid #eaeaea;
    padding: 30px 0;
`;

const PressEntryColumn = styled(Column)`
    @media (max-width: 768px) {
        width: 100%;

        &&& {
            margin-top: 20px;
        }
    }
`;

const HighlightDateText = styled('span')`
    display: block;
    margin-bottom: 12px;
    color: #474747;
    font-size: 14px;
`;

const Link = styled('a')`
    color: #00ae99;
    font-weight: 500;
`;
