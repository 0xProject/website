import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { BigNumber } from '@0x/utils';

import { LiquidityMarketSelect } from 'ts/pages/mesh/liquidity_market_select';

import { configs } from 'ts/utils/configs';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { formatNumber, formatPercent } from 'ts/utils/format_number';
import { utils } from 'ts/utils/utils';

import { SignedOrder } from '@0x/types';

interface OrderbookRecord {
    order: SignedOrder;
    metaData: {
        orderHash: string;
        remainingFillableTakerAssetAmount: string;
    };
}

interface OrderData {
    order: SignedOrder;
    price: BigNumber;
    size: BigNumber;
    slippage?: BigNumber;
}

type Operation = 'ask' | 'bid';

const PLACEHOLDER = '-';
const ORDER_COUNT = 5;

const orderbookBaseUrl = configs.API_BASE_PROD_URL;
const orderbookPath = '/sra/v3/orderbook';

const fetchOrders = async (baseAssetData: string, quoteAssetData: string) =>
    fetchUtils.requestAsync(orderbookBaseUrl, orderbookPath, { baseAssetData, quoteAssetData });

const markets = [
    {
        title: 'ETH/DAI',
        quoteAsset: '0xf47261b00000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
        baseAsset: '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        getPrice: (order: SignedOrder, op: Operation) => {
            let price;
            const takerAssetAmount = new BigNumber(order.takerAssetAmount);
            const makerAssetAmount = new BigNumber(order.makerAssetAmount);

            // tslint:disable-next-line:switch-default
            switch (op) {
                case 'ask':
                    price = takerAssetAmount.div(makerAssetAmount);
                    break;
                case 'bid':
                    price = makerAssetAmount.div(takerAssetAmount);
                    break;
            }

            return price;
        },
        getSize: (order: SignedOrder, op: Operation) => {
            let size;
            const takerAssetAmount = new BigNumber(order.takerAssetAmount);
            const makerAssetAmount = new BigNumber(order.makerAssetAmount);
            const constant = new BigNumber('1.0e18');

            // tslint:disable-next-line:switch-default
            switch (op) {
                case 'ask':
                    size = takerAssetAmount.div(constant);
                    break;
                case 'bid':
                    size = makerAssetAmount.div(constant);
            }

            return size;
        },
    },
    {
        title: 'ETH/USDC',
        quoteAsset: '0xf47261b0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        baseAsset: '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        getPrice: (order: SignedOrder, op: Operation) => {
            let price;
            const takerAssetAmount = new BigNumber(order.takerAssetAmount);
            const makerAssetAmount = new BigNumber(order.makerAssetAmount);
            const constant = new BigNumber('1.0e12');

            // tslint:disable-next-line:switch-default
            switch (op) {
                case 'ask':
                    price = takerAssetAmount.div(makerAssetAmount).times(constant);
                    break;
                case 'bid':
                    price = makerAssetAmount.div(takerAssetAmount).times(constant);
                    break;
            }

            return price;
        },
        getSize: (order: SignedOrder, op: Operation) => {
            let size;
            const takerAssetAmount = new BigNumber(order.takerAssetAmount);
            const makerAssetAmount = new BigNumber(order.makerAssetAmount);
            const constant = new BigNumber('1.0e6');

            // tslint:disable-next-line:switch-default
            switch (op) {
                case 'ask':
                    size = takerAssetAmount.div(constant);
                    break;
                case 'bid':
                    size = makerAssetAmount.div(constant);
                    break;
            }

            return size;
        },
    },
    {
        title: 'SNX/ETH',
        baseAsset: '0xf47261b0000000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
        quoteAsset: '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        getPrice: (order: SignedOrder, op: Operation) => {
            let price;
            const takerAssetAmount = new BigNumber(order.takerAssetAmount);
            const makerAssetAmount = new BigNumber(order.makerAssetAmount);

            // tslint:disable-next-line:switch-default
            switch (op) {
                case 'ask':
                    price = takerAssetAmount.div(makerAssetAmount);
                    break;
                case 'bid':
                    price = makerAssetAmount.div(takerAssetAmount);
                    break;
            }

            return price;
        },
        getSize: (order: SignedOrder, op: Operation) => {
            let size;
            const takerAssetAmount = new BigNumber(order.takerAssetAmount);
            const makerAssetAmount = new BigNumber(order.makerAssetAmount);
            const constant = new BigNumber('1.0e18');

            // tslint:disable-next-line:switch-default
            switch (op) {
                case 'ask':
                    size = takerAssetAmount.div(constant);
                    break;
                case 'bid':
                    size = makerAssetAmount.div(constant);
            }

            return size;
        },
    },
];

export const LiquidityMarket: React.FC = () => {
    const [selectedMarketIdx, setSelectedMarketIdx] = useState(0);
    const [bids, setBids] = useState<OrderData[]>([]);
    const [asks, setAsks] = useState<OrderData[]>([]);
    const [spread, setSpread] = useState<BigNumber>();

    const resetData = () => {
        setBids([]);
        setAsks([]);
        setSpread(undefined);
    };

    useEffect(() => {
        const fetchData = async () => {
            const market = markets[selectedMarketIdx];
            const orders = await fetchOrders(market.baseAsset, market.quoteAsset);

            const _bids = parseOrders(orders.bids.records, 'bid');
            const _asks = parseOrders(orders.asks.records, 'ask');

            const midPrice = calcMidPrice(_bids, _asks);

            calcSlippage(_bids, midPrice);
            calcSlippage(_asks, midPrice);

            const _spread = calcSpread(_bids, _asks);

            // Reverse asks for display (price descending order)
            _asks.reverse();

            setBids(_bids);
            setAsks(_asks);
            setSpread(_spread);
        };

        resetData();

        // tslint:disable-next-line:no-floating-promises
        fetchData();
    }, [selectedMarketIdx]);

    const parseOrders = (records: OrderbookRecord[], op: Operation) => {
        const { getPrice, getSize } = markets[selectedMarketIdx];

        return records.slice(0, ORDER_COUNT).map(({ order }) => ({
            order,
            price: getPrice(order, op),
            size: getSize(order, op),
        }));
    };

    const calcMidPrice = (_bids: OrderData[], _asks: OrderData[]) => {
        const highestBidPrice = _bids[0].price;
        const lowestAskPrice = _asks[0].price;

        return highestBidPrice.plus(lowestAskPrice).dividedBy(2);
    };

    const calcSlippage = (orders: OrderData[], midPrice: BigNumber) => {
        return orders.map(order => {
            order.slippage = order.price.minus(midPrice).dividedBy(midPrice).multipliedBy(100);
            return order;
        });
    };

    const calcSpread = (_bids: OrderData[], _asks: OrderData[]) => {
        const highestBidSlippage = _bids.reduce((max, order) => {
            return max.lt(order.slippage) ? order.slippage : max;
        }, _bids[0].slippage);

        const lowestAskSlippage = _asks.reduce((min, order) => {
            return min.gt(order.slippage) ? order.slippage : min;
        }, _asks[0].slippage);

        return highestBidSlippage.minus(lowestAskSlippage).abs();
    };

    const handleSelectItem = (index: number) => {
        setSelectedMarketIdx(index);
    };

    const hasData = asks.length > 0 && bids.length > 0;

    return (
        <>
            <LiquidityMarketSelect items={markets} selectedItem={selectedMarketIdx} onSelectItem={handleSelectItem} />

            <Table>
                <thead>
                    <tr>
                        <th>Maker</th>
                        <th>Price</th>
                        <th>Size</th>
                        <th>Slippage</th>
                    </tr>
                </thead>
                <tbody>
                    <Records orders={asks} operation="ask" />
                    <Spread value={spread} />
                    <Records orders={bids} operation="bid" />
                </tbody>
            </Table>
        </>
    );
};

interface RecordsProps {
    orders: OrderData[];
    operation: Operation;
}

const formatPrice = (price: BigNumber) => formatNumber(price, { decimals: 4 }).formatted;
const formatSize = (size: BigNumber) => formatNumber(size, { decimals: 4 }).formatted;
const formatSlippage = (size: BigNumber) => formatPercent(size, { decimals: 3 }).full;

const Records: React.FC<RecordsProps> = ({ orders, operation }) => {
    const emptyRows = ORDER_COUNT - orders.length;

    return (
        <>
            {operation === 'ask' && emptyRows > 0 && <EmptyRecords count={emptyRows} operation={operation} />}
            {orders.map(order => {
                return (
                    <tr key={order.order.signature} className={operation}>
                        <td>{utils.getAddressBeginAndEnd(order.order.makerAddress, 5, 2)}</td>
                        <td>{formatPrice(order.price)}</td>
                        <td>{formatSize(order.size)}</td>
                        <td>{formatSlippage(order.slippage)}</td>
                    </tr>
                );
            })}
            {operation === 'bid' && emptyRows > 0 && <EmptyRecords count={emptyRows} operation={operation} />}
        </>
    );
};

const EmptyRecords: React.FC<{ count: number; operation: Operation }> = ({ count, operation }) => (
    <>
        {[...Array(count)].map((_e, i) => (
            <tr key={`empty-${operation}-${i}`} className="empty">
                <td>{PLACEHOLDER}</td>
                <td>{PLACEHOLDER}</td>
                <td>{PLACEHOLDER}</td>
                <td>{PLACEHOLDER}</td>
            </tr>
        ))}
    </>
);

const Spread: React.FC<{ value: BigNumber }> = ({ value }) => (
    <tr className="spread">
        <td colSpan={3}>Spread</td>
        <td>{value ? formatPercent(value, { decimals: 3 }).full : PLACEHOLDER}</td>
    </tr>
);

const Table = styled.table`
    table-layout: fixed;

    margin: 40px auto 0;
    width: calc(100% - 10px);

    th {
        padding-bottom: 7px;

        font-weight: 300;
        font-size: 17px;
        line-height: 23px;

        color: #ffffff;
        opacity: 0.7;

        text-align: left;

        &:last-child {
            width: 16%;
        }
    }

    tr td {
        font-size: 20px;
        line-height: 27px;
        /* identical to box height */

        font-feature-settings: 'tnum' on, 'lnum' on;
        color: #ffffff;

        padding: 8px 40px 8px 0;

        &:last-child {
            padding-right: 0;
        }
    }

    tr.ask td:not(:first-child) {
        color: #f46036;
    }

    tr.bid td:not(:first-child) {
        color: #a2f5eb;
    }

    tr.spread td {
        color: #ffffff;
        opacity: 0.7;

        &:first-child {
            text-align: right;
        }
    }

    tr.empty td {
        text-align: center;
    }
`;
