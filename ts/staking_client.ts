import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';

import { DetailedStakingPoolStats, StakingDelegatorStats, StakingPoolStats, StakingStats } from './staking_types';

const STANDARD_STAKING_API_ENDPOINTS = {
    STAKING: '/staking',
    STAKING_POOL: '/staking-pools',
    STAKING_EPOCHS: '/staking-epochs',
    STAKING_POOL_EPOCHS: '/staking-pool-epochs',
    STAKING_DELEGATOR: '/staking-delegator',
    STAKING_DELEGATOR_EPOCHS: '/staking-delegator-epochs',
    STAKING_EVENTS: '/staking-events',
    TRADING_PAIRS: '/trading-pairs',
    NEXT_STAKING_POOL_EPOCH: '/staking-pool-next-epoch',
    RECOMMEND_STAKING_POOL: '/recommend-staking-pool',
};

export const stakingClient = {
    // if no delegatorAddress is passed, returns all staking pool staked in 0x contracts
    async getStakingPoolsAsync(delegatorAddress?: string): Promise<StakingPoolStats[]> {
        return [];
    },
    /**
     * this hits the server 3 times
     * 1. Get StakingPoolStats for specified poolId from /staking-pools
     * 2. Get all epoch data from /staking-pool-epochs
     * 3. Get all neccessary metadata related to trading pairs from /trading-pairs
     */
    async getDetailedStakingPoolStatsAsync(poolId: string): Promise<DetailedStakingPoolStats> {
        return {};
    },
    /**
     * Gets aggregate statistics of the 0x staking system
     */
    async getStakingStatsAsync(): Promise<StakingStats> {
        return {};
    },
    /**
     * Gets delegator staking information and StakingPoolStats related to staked pools
     */
    async getStakingDelegatorStatsAsync(delegatorAddress?: string): Promise<StakingDelegatorStats> {
        return {};
    },
    /**
     * Recommends staking pools for the amount of zrxStateAmount given
     */
    async getRecommendedStakingPoolAsync(delegatorAddress: string, zrxStakeAmount: BigNumber): Promise<StakingPoolStats[]> {
        return {};
    },
    /**
     * TODO(dave4506) add event types
     */
    async getStakingDelegatorActivityAsync(delegatorAddress: string): Promise<any> {
        return {};
    },
    /**
     * TODO(dave4506) add event types
     */
    async getStakingPoolActivityAsync(poolId: string): Promise<any> {
        return {};
    },
    /**
     * TODO(dave4506) add event types
     */
    async getStakingActivityAsync(): Promise<any> {
        return {};
    },
};
