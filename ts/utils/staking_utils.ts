import { BigNumber } from '@0x/utils';
import { formatDistanceStrict, isPast } from 'date-fns';
import * as _ from 'lodash';

import { Decimal } from 'decimal.js';
import { constants } from 'ts/utils/constants';
import { formatZrx } from 'ts/utils/format_number';

import { EpochWithFees, PoolWithStats, StakingPoolRecomendation } from 'ts/types';

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

interface ExpectedRewardsSummary {
    expectedTotalReward: BigNumber;
    expectedOperatorReward: BigNumber;
    expectedMemberReward: BigNumber;
    totalWeightedStake: BigNumber;
    operatorAddress: string;
    operatorZrxStaked: BigNumber;
    memberZrxStaked: BigNumber;
}

interface ExpectedPoolRewards {
    [poolId: string]: ExpectedRewardsSummary;
}

export const stakingUtils = {
    getRecommendedStakingPools: (
        amountZrxToStake: number,
        pools: PoolWithStats[],
        opts?: Partial<GetRecommendedStakingPoolsOptions>,
    ): StakingPoolRecomendation[] => {
        if (!pools || !amountZrxToStake) {
            return [];
        }
        const { alpha, numIterations } = {
            alpha: constants.COBBS_DOUGLAS_ALPHA,
            numIterations: 3,
            ...opts,
        };
        const poolsSummary: PoolStatSummary[] = pools.map((pool) => ({
            poolId: pool.poolId,
            operatorShare: pool.nextEpochStats.operatorShare,
            sevenDayProtocolFeesGeneratedInEth: pool.sevenDayProtocolFeesGeneratedInEth,
            zrxStaked: pool.nextEpochStats.zrxStaked,
        }));
        // TODO(johnrjj) - Refactor to use BigNumber exclusively
        const stakingDecisions: { [poolId: string]: number } = {};
        for (let i = 0; i < numIterations; i++) {
            const totalStake = _.sumBy(poolsSummary, (p) => p.zrxStaked);
            const totalProtocolFees = _.sumBy(poolsSummary, (p) => p.sevenDayProtocolFeesGeneratedInEth);
            const adjustedStakeRatios: number[] = [];
            for (const pool of poolsSummary) {
                const stakeRatio =
                    pool.zrxStaked /
                    totalStake /
                    (totalProtocolFees > 0 ? pool.sevenDayProtocolFeesGeneratedInEth / totalProtocolFees : 1);
                const adjStakeRatio = Math.pow((1 - alpha) / (1 - pool.operatorShare), 1 / alpha) * stakeRatio;
                adjustedStakeRatios.push(adjStakeRatio);
            }
            const bestPoolIndex = adjustedStakeRatios.indexOf(_.min(adjustedStakeRatios));
            const bestPool = poolsSummary[bestPoolIndex];
            stakingDecisions[bestPool.poolId] = stakingDecisions[bestPool.poolId] || 0;
            stakingDecisions[bestPool.poolId] += amountZrxToStake / numIterations;
            bestPool.zrxStaked += amountZrxToStake / numIterations;
        }
        const recs = Object.keys(stakingDecisions).map(
            (poolId) => ({
                pool: pools.find((pool) => pool.poolId === poolId),
                zrxAmount: formatZrx(stakingDecisions[poolId], { removeComma: true }).roundedValue,
            }),
            [],
        );

        // Sort desc
        const orderedRecs = _.orderBy(recs, (p) => p.zrxAmount, ['desc']);
        // Need to use BigNumbers here when validating reconciliation
        // example: JS normal addition of 1400.09 + 1400.09 + 1400.09 = 4200.2699999999995 , need to use bignumber!
        const currentTotalSoFar = BigNumber.sum(...orderedRecs.map((x) => new BigNumber(x.zrxAmount)));
        // Need to round again as we can end up with 0.010000000000019327 as the reconcile amount
        const reconciliationAmount = formatZrx(new BigNumber(amountZrxToStake).minus(currentTotalSoFar)).roundedValue;
        // Sometimes the algorithm will be short by 0.01 to 0.02 ZRX (due to combination of floating point + rounding)
        // We'll just deposit the difference into the most preferred pool.
        if (reconciliationAmount && orderedRecs.length > 0) {
            orderedRecs[0].zrxAmount = formatZrx(
                new BigNumber(orderedRecs[0].zrxAmount).plus(reconciliationAmount),
            ).roundedValue;
        }
        return orderedRecs;
    },

    getExpectedPoolRewards(
        pools: PoolWithStats[],
        currentEpoch: EpochWithFees,
        currentRewardBalance: BigNumber,
        scaledToEndOfEpoch: boolean,
    ): ExpectedPoolRewards {
        const alpha = constants.COBBS_DOUGLAS_ALPHA;
        const delegatorStakeWeight = constants.DELEGATOR_STAKE_WEIGHT;
        const epochLengthInDays = constants.STAKING_EPOCH_LENGTH_IN_DAYS;
        const SECONDS_IN_A_DAY = 86400;
        const epochLengthInSeconds = epochLengthInDays * SECONDS_IN_A_DAY;

        // Determine the scale factor b/t data at this point and the end of the epoch
        // Scale can be set to 1 with scaledToEndOfEpoch = false, making the esimate what would
        // happen if the epoch ended now with no future projection
        const now = new Date();
        const epochStart = new Date(currentEpoch.epochStart.timestamp);

        const timeElapsed = (now.getTime() - epochStart.getTime()) / 1000;
        const scaleFactor = scaledToEndOfEpoch
            ? new BigNumber(epochLengthInSeconds).dividedBy(new BigNumber(timeElapsed))
            : new BigNumber(1);

        // --Expected total rewards--
        // Rewards can include non-fee items like rollover and subsidies
        // Fees will be projected forward, the other items will not be scaled
        const currentEpochProtocolFees = new BigNumber(currentEpoch.protocolFeesGeneratedInEth);
        const nonFeeRewards = currentRewardBalance.minus(currentEpochProtocolFees);
        const projectedCurrentEpochProtocolFees = currentEpochProtocolFees.multipliedBy(scaleFactor);
        const projectedRewards = nonFeeRewards.plus(projectedCurrentEpochProtocolFees);

        // --Other totals--
        // To calculate expected rewards, we also need:
        // 1. total protocol fees assignable to pools
        // 2. total weighted stake
        let totalWeightedStake = new BigNumber(0);
        let totalPoolProtocolFees = new BigNumber(0);
        for (const pool of pools) {
            totalWeightedStake = totalWeightedStake.plus(pool.currentEpochStats.operatorZrxStaked);
            totalWeightedStake = totalWeightedStake.plus(pool.currentEpochStats.memberZrxStaked * delegatorStakeWeight);
            totalPoolProtocolFees = totalPoolProtocolFees.plus(pool.currentEpochStats.totalProtocolFeesGeneratedInEth);
        }

        const expectedPoolRewards: ExpectedPoolRewards = {};
        // --Calculate Rewards by Pool--
        for (const pool of pools) {
            const poolFees = new BigNumber(pool.currentEpochStats.totalProtocolFeesGeneratedInEth);
            const memberZrxStaked = new BigNumber(pool.currentEpochStats.memberZrxStaked);
            const operatorZrxStaked = new BigNumber(pool.currentEpochStats.operatorZrxStaked);
            const poolWeightedStake = memberZrxStaked.multipliedBy(delegatorStakeWeight).plus(operatorZrxStaked);

            // BigNumber can't handle fractional exponents, so bringing in the big guns--Decimal.js
            const feeTerm = new BigNumber(
                new Decimal(poolFees.dividedBy(totalPoolProtocolFees).toString()).pow(alpha).toString(),
            );
            const stakeTerm = new BigNumber(
                new Decimal(poolWeightedStake.dividedBy(totalWeightedStake).toString()).pow(1 - alpha).toString(),
            );

            // This follows the reward calculation laid out at:
            // https://github.com/0xProject/0x-protocol-specification/blob/master/staking/staking-specification.md#paying-liquidity-rewards-finalization
            const expectedTotalReward = projectedRewards.multipliedBy(feeTerm).multipliedBy(stakeTerm);

            expectedPoolRewards[pool.poolId] = {
                expectedTotalReward,
                expectedOperatorReward: expectedTotalReward.multipliedBy(pool.currentEpochStats.operatorShare),
                expectedMemberReward: expectedTotalReward.multipliedBy(1 - pool.currentEpochStats.operatorShare),
                totalWeightedStake: poolWeightedStake,
                operatorAddress: pool.operatorAddress,
                operatorZrxStaked,
                memberZrxStaked,
            };
        }

        return expectedPoolRewards;
    },

    getPoolDisplayName({ poolId, metaData }: { poolId: string; metaData?: { name?: string } }): string {
        const name = metaData && metaData.name;

        if (!name) {
            return `Pool ${poolId}`;
        }

        if (name.length <= 40) {
            return name;
        }

        return `${name.slice(0, 37).trim()}...`;
    },

    isPoolActive: (pool: PoolWithStats) => {
        return pool.currentEpochStats.totalProtocolFeesGeneratedInEth > 0 || pool.avgMemberRewardInEth > 0;
    },

    getTimeToEpochDate: (epochDate?: Date): string => {
        if (!epochDate || isPast(epochDate)) {
            return '-';
        }

        const now = new Date();
        return formatDistanceStrict(epochDate, now, { roundingMethod: 'ceil' });
    },

    sortByStakedDesc: (a: PoolWithStats, b: PoolWithStats): number =>
        b.nextEpochStats.approximateStakeRatio - a.nextEpochStats.approximateStakeRatio,

    sortByProtocolFeesDesc: (a: PoolWithStats, b: PoolWithStats): number => {
        return (
            b.currentEpochStats.totalProtocolFeesGeneratedInEth - a.currentEpochStats.totalProtocolFeesGeneratedInEth
        );
    },
    sortByAPYDesc: (a: PoolWithStats, b: PoolWithStats): number => {
        return b.apy - a.apy;
    },

    sortByRewardsSharedDesc: (a: PoolWithStats, b: PoolWithStats): number => {
        return b.avgMemberRewardInEth - a.avgMemberRewardInEth;
    },
};
