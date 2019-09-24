import * as React from 'react';
import styled from 'styled-components';

interface Currency {
    name: string;
    iconUrl: string;
}

interface TradingPairProps {
    id: string;
    price: number;
    currency: string;
    firstCurrency: Currency;
    secondCurrency: Currency;
}

const Container = styled.div`

`;

const TradingPairIcons = styled.ol``;

const TradingPairIcon = styled.img``;

const TradingPairInfo = styled.div``;

const TradingPairName = styled.div``;

const Price = styled.div``;

export const TradingPair: React.FC<TradingPairProps> = ({ firstCurrency, secondCurrency, price }) => {
    return (
        <Container>
            <TradingPairIcons>
                <TradingPairIcon src={firstCurrency.iconUrl} alt={firstCurrency.name} />
                <TradingPairIcon src={secondCurrency.iconUrl} alt={firstCurrency.name} />
            </TradingPairIcons>
            <TradingPairInfo>
                <TradingPairName>
                    {firstCurrency.name} - {secondCurrency.name}
                </TradingPairName>
                <Price>{price}</Price>
            </TradingPairInfo>
        </Container>
    );
};
