import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';

import { constants } from 'ts/utils/constants';
import { formatZrx } from 'ts/utils/format_number';

import { PoolWithStats, StakingPoolRecomendation } from 'ts/types';

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
        // TODO(johnrjj) - Refactor to use BigNumber exclusively
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
            zrxAmount: formatZrx(stakingDecisions[poolId], { removeComma: true }).roundedValue,
        }), []);

        // Sort desc
        const orderedRecs = _.orderBy(recs, (p => p.zrxAmount), ['desc']);
        // Need to use BigNumbers here when validating reconciliation
        // example: JS normal addition of 1400.09 + 1400.09 + 1400.09 = 4200.2699999999995 , need to use bignumber!
        const currentTotalSoFar = BigNumber.sum(...orderedRecs.map(x => new BigNumber(x.zrxAmount)));
        // Need to round again as we can end up with 0.010000000000019327 as the reconcile amount
        const reconciliationAmount = formatZrx((new BigNumber(amountZrxToStake).minus(currentTotalSoFar))).roundedValue;
        // Sometimes the algorithm will be short by 0.01 to 0.02 ZRX (due to combination of floating point + rounding)
        // We'll just deposit the difference into the most preferred pool.
        if (reconciliationAmount && orderedRecs.length > 0) {
            orderedRecs[0].zrxAmount = formatZrx(new BigNumber(orderedRecs[0].zrxAmount).plus(reconciliationAmount)).roundedValue;
        }
        return orderedRecs;
    },
};
