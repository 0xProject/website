// import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {Decimal as BigNumber } from 'decimal.js'; // need to use decimal.js as bignumber doesn't 
import { PoolWithStats, StakingPoolRecomendation } from '../types';

import { constants } from './constants';
import { configs } from 'ts/utils/configs';

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
    // getRecommendedStakingPools: (amountZrxToStake: number, pools: PoolWithStats[], opts?: Partial<GetRecommendedStakingPoolsOptions>): StakingPoolRecomendation[] => {
    //     if (!pools || !amountZrxToStake) {
    //         return [];
    //     }
    //     const { alpha, numIterations } = {
    //         alpha: constants.COBBS_DOUGLAS_ALPHA,
    //         numIterations: 3,
    //         ...opts,
    //     };
    //     const poolsSummary: PoolStatSummary[] = pools.map(pool => ({
    //         poolId: pool.poolId,
    //         operatorShare: pool.nextEpochStats.operatorShare,
    //         sevenDayProtocolFeesGeneratedInEth: pool.sevenDayProtocolFeesGeneratedInEth,
    //         zrxStaked: pool.nextEpochStats.zrxStaked,
    //     }));
    //     const stakingDecisions: { [poolId: string]: number } = {};
    //     for (let i = 0; i < numIterations; i++) {
    //         const totalStake = _.sumBy(poolsSummary, p => p.zrxStaked);
    //         const totalProtocolFees = _.sumBy(poolsSummary, p => p.sevenDayProtocolFeesGeneratedInEth);
    //         const adjustedStakeRatios: number[] = [];
    //         for (const pool of poolsSummary) {
    //             const stakeRatio = (pool.zrxStaked / totalStake) / (totalProtocolFees > 0 ? pool.sevenDayProtocolFeesGeneratedInEth / totalProtocolFees : 1);
    //             const adjStakeRatio = Math.pow(((1 - alpha) / (1 - pool.operatorShare)), (1 / alpha)) * stakeRatio;
    //             adjustedStakeRatios.push(adjStakeRatio);
    //         }
    //         const bestPoolIndex = adjustedStakeRatios.indexOf(_.min(adjustedStakeRatios));
    //         const bestPool = poolsSummary[bestPoolIndex];
    //         stakingDecisions[bestPool.poolId] = stakingDecisions[bestPool.poolId] || 0;
    //         stakingDecisions[bestPool.poolId] += amountZrxToStake / numIterations;
    //         bestPool.zrxStaked += (amountZrxToStake / numIterations);
    //     }
    //     const recs = Object.keys(stakingDecisions).map(poolId => ({
    //         pool: pools.find(pool => pool.poolId === poolId),
    //         zrxAmount: stakingDecisions[poolId],
    //     }), []);
    //     return recs;
    // },
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

            // const totalStake: BigNumber = BigNumber.sum(...poolsSummary.map(p => new BigNumber(p.zrxStaked || 0)));
            // const totalStake: BigNumber = _.sumBy(poolsSummary, p => p.zrxStaked);
            const protocolFeesAsBigNumbers: BigNumber[] = poolsSummary.map(p => new BigNumber(p.sevenDayProtocolFeesGeneratedInEth));
            const totalProtocolFees = protocolFeesAsBigNumbers.reduce((acc, current) => acc.add(current), new BigNumber(0));
            // const totalProtocolFees: BigNumber = BigNumber.sum(...poolsSummary.map(p => new BigNumber(p.sevenDayProtocolFeesGeneratedInEth)));
            // const totalProtocolFees: BigNumber = _.sumBy(poolsSummary, p => p.sevenDayProtocolFeesGeneratedInEth);
            const adjustedStakeRatios: BigNumber[] = [];
            for (const pool of poolsSummary) {
                const poolZrxStakedBigNumber = new BigNumber(pool.zrxStaked);
                const sevenDayProtocolFeesGeneratedInEthBigNumber = new BigNumber(pool.sevenDayProtocolFeesGeneratedInEth);
                const poolOperatorShareBigNumber = new BigNumber(pool.operatorShare);

                const divisor = totalProtocolFees.greaterThan(0) ? sevenDayProtocolFeesGeneratedInEthBigNumber.div(totalProtocolFees) : new BigNumber(1);
                const stakeRatioBigNumber: BigNumber = (poolZrxStakedBigNumber.div(totalStake)).div(divisor);
                // const stakeRatio: BigNumber = (pool.zrxStaked / totalStake) / (totalProtocolFees > 0 ? pool.sevenDayProtocolFeesGeneratedInEth / totalProtocolFees : 1);
                // const stakeRatio = (pool.zrxStaked / totalStake) / (totalProtocolFees > 0 ? pool.sevenDayProtocolFeesGeneratedInEth / totalProtocolFees : 1);
                const adjStakeRatioBaseBigNumber: BigNumber = (new BigNumber(1).minus(alpha)).div((new BigNumber(1).minus(poolOperatorShareBigNumber)));
                const adjStakeRatioExponentBigNumber: BigNumber = (new BigNumber(1).div(alpha)).mul(stakeRatioBigNumber);
                const adjStakeRatioBigNumber: BigNumber = adjStakeRatioBaseBigNumber.pow(adjStakeRatioExponentBigNumber);
                // const adjStakeRatioBigNumber: BigNumber = adjStakeRatioBaseBigNumber.sqrt(adjStakeRatioExponentBigNumber);


                // const adjStakeRatio: BigNumber = Math.pow(((1 - alpha) / (1 - pool.operatorShare)), (1 / alpha)) * stakeRatio;
                // const adjStakeRatio = Math.pow(((1 - alpha) / (1 - pool.operatorShare)), (1 / alpha)) * stakeRatio;
                adjustedStakeRatios.push(adjStakeRatioBigNumber);
            }
            const bestPoolIndex = adjustedStakeRatios.indexOf(_.min(adjustedStakeRatios));
            const bestPool = poolsSummary[bestPoolIndex];
            stakingDecisions[bestPool.poolId] = stakingDecisions[bestPool.poolId] || new BigNumber(0);
            stakingDecisions[bestPool.poolId] = stakingDecisions[bestPool.poolId].plus((new BigNumber(amountZrxToStake).div(numIterations)));
            // stakingDecisions[bestPool.poolId] += amountZrxToStake / numIterations;
            bestPool.zrxStaked += (amountZrxToStake / numIterations);
            bestPool.zrxStaked =  (amountZrxToStake / numIterations);

        }

        console.log(stakingDecisions);
        const recs = Object.keys(stakingDecisions).map(poolId => ({
            pool: pools.find(pool => pool.poolId === poolId),
            zrxAmount: Number(stakingDecisions[poolId].toFixed(configs.AMOUNT_DISPLAY_PRECSION)),
        }), []);
        return recs;
    },
};
