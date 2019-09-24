import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { TradingPair } from 'ts/components/staking/trading_pair';

export interface MarketMakerProfileProps {}

const Container = styled.div`
    max-width: 1152px;
    margin: 0 auto;
    position: relative;
    height: 290px;
`;

const tradingPairs = [
    {
        id: '29n5c290cn0cc2943cn239',
        price: 1200,
        currency: 'USD',
        firstCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
        secondCurrency: {
            name: 'BAT',
            iconUrl: 'path/to/icon',
        },
    }

]

export const MarketMakerProfile: React.FC<MarketMakerProfileProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="Market Maker Profile">
            <Container>
                {tradingPairs.map(({ price, currency, firstCurrency, secondCurrency, id }) => {
                    return (
                        <TradingPair
                            key={id}
                            id={id}
                            price={price}
                            currency={currency}
                            firstCurrency={firstCurrency}
                            secondCurrency={secondCurrency}
                        />
                    );
                })}
            <Container />
        </StakingPageLayout>
    );
};
