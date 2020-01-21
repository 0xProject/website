import React from 'react';

import { PoolsListSortingParameter } from 'ts/types';

interface PoolsListSortingSelectorProps {
    setPoolSortingParam: (sortingParam: PoolsListSortingParameter) => void;
}
export const PoolsListSortingSelector: React.FC<PoolsListSortingSelectorProps> = ({ setPoolSortingParam }) => {
    return (
        <select
            onChange={e => {
                const selected = e.target.value as PoolsListSortingParameter;
                setPoolSortingParam(selected);
            }}
        >
            <option value={PoolsListSortingParameter.Staked}>Staked</option>
            <option value={PoolsListSortingParameter.RewardsShared}>RewardsShared</option>
            <option value={PoolsListSortingParameter.ProtocolFees} selected>
                ProtocolFees
            </option>
        </select>
    );
};
