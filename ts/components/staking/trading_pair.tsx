import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

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
    url: string;
}

const Container = styled.a`
    display: flex;
    width: 260px;
    align-items: center;
    margin-bottom: 20px;
`;

const TradingPairIcons = styled.ol`
    background-color: #f3f3f3;
    display: block;
    width: 50%;
    padding: 10px;
`;

const TradingPairIcon = styled.img`
    width: 50px;
    height: 50px;
    background-color: ${colors.brandLight};
    text-align: center;
    color: ${colors.white};
    font-weight: 300;
    display: inline-block;
    margin-right: 10px;
    overflow: hidden;
    &:last-child {
        margin-right: 0;
    }
`;

const TradingPairInfo = styled.div`
    width: 50%;
    padding: 10px 0 10px 20px;
`;

const TradingPairName = styled.span`
    display: block;
    font-size: 20px;
    line-height: 1.3;
`;

const Price = styled.span`
    color: #898989;
    display: block;
    line-height: 1.3;
    font-size: 17px;
    font-weight: 300;
    font-feature-settings: 'tnum' on, 'lnum' on;
`;

export const TradingPair: React.FC<TradingPairProps> = ({ firstCurrency, secondCurrency, price, url, currency }) => {
    return (
        <Container href={url}>
            <TradingPairIcons>
                <TradingPairIcon src={firstCurrency.iconUrl} alt={firstCurrency.name} />
                <TradingPairIcon src={secondCurrency.iconUrl} alt={firstCurrency.name} />
            </TradingPairIcons>
            <TradingPairInfo>
                <TradingPairName>
                    {firstCurrency.name} - {secondCurrency.name}
                </TradingPairName>
                <Price>{price} {currency}</Price>
            </TradingPairInfo>
        </Container>
    );
};
