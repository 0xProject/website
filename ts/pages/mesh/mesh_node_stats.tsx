import * as React from 'react';
import styled from 'styled-components';

import { Heading } from 'ts/components/text';
import { colors } from 'ts/style/colors';
import { formatNumber } from 'ts/utils/format_number';
import { utils } from 'ts/utils/utils';

export interface NodeDetails {
    peerId: string;
    numOrders: number;
    numPeers: number;
    ip: string;
    country: string;
    city: string;
}

interface NodeStatsProps {
    isVisible: boolean;
    data?: NodeDetails;
}

export const NodeStats: React.FC<NodeStatsProps> = ({ isVisible, data }) => {
    if (!isVisible) {
        return null;
    }

    const formattedAddress = `Node ${utils.getAddressBeginAndEnd(data.peerId, 3, 5)}`;
    const location = data.city ? `${data.city}, ${data.country}` : data.country;

    return (
        <Wrap>
            <Heading asElement="h5" size="small" marginBottom="16px">
                {formattedAddress}
            </Heading>
            <ListWrap>
                <Item>
                    <Label>order count</Label>
                    <Value>{formatNumber(data.numOrders).formatted}</Value>
                </Item>
                <Item>
                    <Label>peer count</Label>
                    <Value>{data.numPeers}</Value>
                </Item>
                <Item>
                    <Label>ip</Label>
                    <Value>{data.ip}</Value>
                </Item>
                <Item>
                    <Label>location</Label>
                    <Value>{location}</Value>
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
