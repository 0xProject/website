import { BigNumber } from '@0x/utils';
import * as React from 'react';
import styled from 'styled-components';

import { Text } from 'ts/components/ui/text';

import { colors } from 'ts/style/colors';
import { formatEther, formatZrx } from 'ts/utils/format_number';
import { stakingUtils } from 'ts/utils/staking_utils';

interface CurrentEpochOverviewProps {
    nextEpochStartDate?: Date;
    currentEpochRewards?: BigNumber;
    numMarketMakers?: number;
    zrxStaked?: number;
}

const WrapperRow = styled.div`
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid ${colors.border};

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const OverviewItem = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding-bottom: 60px;

    @media (max-width: 768px) {
        padding-bottom: 20px;
        flex-direction: column-reverse;
    }
`;

const Metric = styled(Text).attrs({
    fontWeight: '300',
    fontFamily: 'Formular, monospace',
})`
    font-size: 42px;

    @media (max-width: 768px) {
        font-size: 34px;
    }
`;

const Explanation = styled(Text).attrs({
    fontSize: '18px',
    fontWeight: '300',
    fontFamily: 'Formular, monospace',
    fontColor: '#999999',
    textAlign: 'center',
    width: '100%',
})``;

export const CurrentEpochOverview: React.FC<CurrentEpochOverviewProps> = ({
    nextEpochStartDate,
    currentEpochRewards,
    numMarketMakers,
    zrxStaked,
}) => {
    return (
        <WrapperRow>
            <OverviewItem>
                <Metric>{zrxStaked ? formatZrx(zrxStaked, { bigUnitPostfix: true }).formatted : '-'}</Metric>
                <Explanation>ZRX Staked</Explanation>
            </OverviewItem>
            <OverviewItem>
                <Metric>{stakingUtils.getTimeToEpochDate(nextEpochStartDate)}</Metric>
                <Explanation>Epoch ends</Explanation>
            </OverviewItem>
            <OverviewItem>
                <Metric>{currentEpochRewards ? formatEther(currentEpochRewards, { decimals: 2 }).full : '-'}</Metric>
                <Explanation>Current epoch rewards</Explanation>
            </OverviewItem>
            <OverviewItem>
                <Metric>{numMarketMakers ? numMarketMakers : '-'}</Metric>
                <Explanation>Staking Pools</Explanation>
            </OverviewItem>
        </WrapperRow>
    );
};
