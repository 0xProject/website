import * as React from 'react';
import styled from 'styled-components';

import { DashboardHero } from 'ts/components/staking/dashboard_hero';
import { HistoryChart } from 'ts/components/staking/history_chart';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { TradingPair } from 'ts/components/staking/trading_pair';

export interface MarketMakerProfileProps {}

const Container = styled.div`
    max-width: 1152px;
    margin: 0 auto;
    padding: 0 20px;
`;

const Heading = styled.h2`
    font-size: var(--defaultHeading);
    line-height: 1.35;
    margin-bottom: 20px;
`;

const GraphHeading = styled(Heading)`
    margin-bottom: 60px;
`;

const TradingPairContainer = styled.div`
    display: inline-block;
    width: 330px;
`;

const tradingPairs = [
    {
        id: '29n5c290cn0cc2943cn239',
        price: '1,200',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        price: '1,200',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
    {
        id: '29n5c290cn0cc2943cn239',
        url: 'trading-pairs/29n5c290cn0cc2943cn239',
        price: '1,200',
        currency: 'USD',
        firstCurrency: {
            name: 'AIR',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    },
];

export const MarketMakerProfile: React.FC<MarketMakerProfileProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="Market Maker Profile">
            <DashboardHero />
            <Container>
                <GraphHeading>Historical Details</GraphHeading>
                <HistoryChart
                    fees={[40, 41, 40, 41, 40, 41, 40, 41, 40, 41, 40, 41]}
                    rewards={[30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31]}
                    epochs={[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]}
                    labels={['1 July', '5 July', '10 July', '15 July', '20 July', '25 July', '30 July']}
                />
                <Heading>Trading Pairs</Heading>
                <div>
                    {tradingPairs.map(({ price, currency, firstCurrency, secondCurrency, id, url }) => {
                        return (
                            <TradingPairContainer key={id}>
                                <TradingPair
                                    key={id}
                                    id={id}
                                    url={url}
                                    price={price}
                                    currency={currency}
                                    firstCurrency={firstCurrency}
                                    secondCurrency={secondCurrency}
                                />
                            </TradingPairContainer>
                        );
                    })}
                </div>
            </Container>
        </StakingPageLayout>
    );
};
