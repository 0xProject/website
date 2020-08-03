import * as React from 'react';
import styled from 'styled-components';

import { Heading } from 'ts/components/text';
import { colors } from 'ts/style/colors';
import { formatNumber } from 'ts/utils/format_number';
import { utils } from 'ts/utils/utils';

import { MeshNodeMetaData } from './types';

interface NodeStatsProps {
    isVisible: boolean;
    data?: MeshNodeMetaData;
}

export const NodeStats: React.FC<NodeStatsProps> = ({ isVisible, data }) => {
    if (!isVisible) {
        return null;
    }

    const formattedAddress = `Node ${utils.getAddressBeginAndEnd(data.peerId, 3, 5)}`;
    const numOrders = data.stats?.numOrders_number ? formatNumber(data.stats.numOrders_number).formatted : '-';
    const numPeers = data.stats?.numPeers_number ? formatNumber(data.stats.numPeers_number).formatted : '-';

    return (
        <Wrap>
            <Heading asElement="h5" size="small" marginBottom="16px">
                {formattedAddress}
            </Heading>
            <ListWrap>
                <Item>
                    <Label>order count</Label>
                    <Value>{numOrders}</Value>
                </Item>
                <Item>
                    <Label>peer count</Label>
                    <Value>{numPeers}</Value>
                </Item>
                <Item>
                    <Label>country</Label>
                    <Value>{data.geo?.country}</Value>
                </Item>
                <Item>
                    <Label>city</Label>
                    <Value>{data.geo?.city ? data.geo?.city : data.geo?.country}</Value>
                </Item>
            </ListWrap>
        </Wrap>
    );
};

const Wrap = styled.div`
    padding: 32px;
    border: 1px solid ${colors.brandDark};
    background-color: #000;
`;

const ListWrap = styled.ul``;

const Item = styled.li`
    &:not(:last-child) {
        margin-bottom: 16px;
    }
`;

const Label = styled.header`
    font-size: 17px;
    line-height: 23px;
    font-weight: 300;
    color: #898990;

    margin-bottom: 4px;
`;

const Value = styled.span`
    font-size: 18px;
    line-height: 26px;
    font-weight: 300;
`;
