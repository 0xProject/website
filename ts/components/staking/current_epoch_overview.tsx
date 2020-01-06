import { BigNumber } from '@0x/utils';
import { differenceInCalendarDays } from 'date-fns';
import * as React from 'react';
import styled from 'styled-components';

import { Text } from 'ts/components/ui/text';
import { colors } from 'ts/style/colors';
import { formatEther } from 'ts/utils/format_number';

interface CurrentEpochOverviewProps {
    currentEpochEndDate?: Date;
    currentEpochRewards?: BigNumber;
    numMarketMakers?: number;
}

const WrapperRow = styled.div`
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid ${colors.border};

    @media (max-width: 768px) {
        display: none;
    }
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 60px;
`;

const Metric = styled(Text).attrs({
    fontSize: '50px',
    fontWeight: '300',
    fontFamily: 'Formular, monospace',
})``;

const Explanation = styled(Text).attrs({
    fontSize: '18px',
    fontWeight: '300',
    fontFamily: 'Formular, monospace',
    fontColor: '#999999',
})``;

export const CurrentEpochOverview: React.FC<CurrentEpochOverviewProps> = ({
    currentEpochEndDate,
    currentEpochRewards,
    numMarketMakers,
}) => {
    const now = new Date();

    return (
        <WrapperRow>
            <OverviewItem>
                <Metric>
                    {currentEpochEndDate ? `${differenceInCalendarDays(currentEpochEndDate, now)} days` : '-'}
                </Metric>
                <Explanation>Epoch ends</Explanation>
            </OverviewItem>
            <OverviewItem>
                <Metric>{currentEpochRewards ? formatEther(currentEpochRewards).full : '-'}</Metric>
                <Explanation>Current epoch rewards</Explanation>
            </OverviewItem>
            <OverviewItem>
                <Metric>{numMarketMakers ? numMarketMakers : '-'}</Metric>
                <Explanation>Market makers</Explanation>
            </OverviewItem>
        </WrapperRow>
    );
};
