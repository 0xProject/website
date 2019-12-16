// Need to use decimal.js (more complete version of BigNumber) as bignumber doesn't allow for decimal exponents
import { Decimal as BigNumber } from 'decimal.js';
import * as _ from 'lodash';

import { PoolWithStats, StakingPoolRecomendation } from 'ts/types';

import { configs } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';

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
        const stakingDecisions: { [poolId: string]: BigNumber } = {};
        for (let i = 0; i < numIterations; i++) {
            const zrxStakedAsBigNumbers = poolsSummary.map(p => new BigNumber(p.zrxStaked || 0));
            const totalStake = zrxStakedAsBigNumbers.reduce((acc, current) => acc.add(current), new BigNumber(0));
            const protocolFeesAsBigNumbers: BigNumber[] = poolsSummary.map(p => new BigNumber(p.sevenDayProtocolFeesGeneratedInEth));
            const totalProtocolFees = protocolFeesAsBigNumbers.reduce((acc, current) => acc.add(current), new BigNumber(0));
            const adjustedStakeRatios: BigNumber[] = [];
            for (const pool of poolsSummary) {
                const poolZrxStaked = new BigNumber(pool.zrxStaked);
                const sevenDayProtocolFeesGeneratedInEth = new BigNumber(pool.sevenDayProtocolFeesGeneratedInEth);
                const poolOperatorShare = new BigNumber(pool.operatorShare);

                const divisor = totalProtocolFees.greaterThan(0) ? sevenDayProtocolFeesGeneratedInEth.div(totalProtocolFees) : new BigNumber(1);
                const stakeRatio: BigNumber = (poolZrxStaked.div(totalStake)).div(divisor);
                const adjStakeRatioBase: BigNumber = (new BigNumber(1).minus(alpha)).div((new BigNumber(1).minus(poolOperatorShare)));
                const adjStakeRatioExponent: BigNumber = (new BigNumber(1).div(alpha)).mul(stakeRatio);
                const adjStakeRatio: BigNumber = adjStakeRatioBase.pow(adjStakeRatioExponent);
                adjustedStakeRatios.push(adjStakeRatio);
            }
            const bestPoolIndex = getMinIdx(adjustedStakeRatios);
            const bestPool = poolsSummary[bestPoolIndex];
            stakingDecisions[bestPool.poolId] = stakingDecisions[bestPool.poolId] || new BigNumber(0);
            stakingDecisions[bestPool.poolId] = stakingDecisions[bestPool.poolId].plus((new BigNumber(amountZrxToStake).div(numIterations)));
            bestPool.zrxStaked += (amountZrxToStake / numIterations);
        }

        const recs = Object.keys(stakingDecisions).map(poolId => ({
            pool: pools.find(pool => pool.poolId === poolId),
            zrxAmount: Number(stakingDecisions[poolId].toFixed(configs.AMOUNT_DISPLAY_PRECSION)),
        }), []);
        return recs;
    },
};

const getMinIdx = (numArr: BigNumber[]): number | undefined => {
    let bestMinIdx: number | undefined;
    numArr.forEach((num, curIdx) => {
        if (bestMinIdx === undefined) {
            bestMinIdx = curIdx;
            return;
        }
        if (num.lessThan(numArr[bestMinIdx])) {
            bestMinIdx = curIdx;
            return;
        }
    });
    return bestMinIdx;
}