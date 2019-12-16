import * as _ from 'lodash';

import { PoolWithStats, StakingPoolRecomendation } from '../types';

import { constants } from './constants';

interface PoolStatSummary {
    poolId: string;
    operatorShare: number;
    zrxStaked: number;
    sevenDayProtocolFeesGeneratedInEth: number;
}

interface GetRecommendedStakingPoolsOptions {
    alpha: number;
    numIterations: number;
}

export const stakingUtils = {
    getRecommendedStakingPools: (amountZrxToStake: number, pools: PoolWithStats[], opts?: Partial<GetRecommendedStakingPoolsOptions>): StakingPoolRecomendation[] => {
        if (!pools || !amountZrxToStake) {
            return [];
        }
        const { alpha, numIterations } = {
            alpha: constants.COBBS_DOUGLAS_ALPHA,
            numIterations: 3,
            ...opts,
        };
        const poolsSummary: PoolStatSummary[] = pools.map(pool => ({
            poolId: pool.poolId,
            operatorShare: pool.nextEpochStats.operatorShare,
            sevenDayProtocolFeesGeneratedInEth: pool.sevenDayProtocolFeesGeneratedInEth,
            zrxStaked: pool.nextEpochStats.zrxStaked,
        }));
        const stakingDecisions: { [poolId: string]: number } = {};
        for (let i = 0; i < numIterations; i++) {
            const totalStake = _.sumBy(poolsSummary, p => p.zrxStaked);
            const totalProtocolFees = _.sumBy(poolsSummary, p => p.sevenDayProtocolFeesGeneratedInEth);
            const adjustedStakeRatios: number[] = [];
            for (const pool of poolsSummary) {
                const stakeRatio = (pool.zrxStaked / totalStake) / (totalProtocolFees > 0 ? pool.sevenDayProtocolFeesGeneratedInEth / totalProtocolFees : 1);
                const adjStakeRatio = Math.pow(((1 - alpha) / (1 - pool.operatorShare)), (1 / alpha)) * stakeRatio;
                adjustedStakeRatios.push(adjStakeRatio);
            }
            const bestPoolIndex = adjustedStakeRatios.indexOf(_.min(adjustedStakeRatios));
            const bestPool = poolsSummary[bestPoolIndex];
            stakingDecisions[bestPool.poolId] = stakingDecisions[bestPool.poolId] || 0;
            stakingDecisions[bestPool.poolId] += amountZrxToStake / numIterations;
            bestPool.zrxStaked += (amountZrxToStake / numIterations);
        }
        const recs = Object.keys(stakingDecisions).map(poolId => ({
            pool: pools.find(pool => pool.poolId === poolId),
            zrxAmount: stakingDecisions[poolId],
        }), []);
        return recs;
    },
};
