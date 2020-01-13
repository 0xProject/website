// tslint:disable: number-literal-format

import { BigNumber } from '@0x/utils';
import { sum } from 'lodash';

import { stakingUtils } from 'ts/utils/staking_utils';

import { createTestPool, SAMPLE_POOLS } from 'ts/test/fixtures/staking_pools';

const { getRecommendedStakingPools } = stakingUtils;

describe('getRecommendedStakingPools implementation', () => {
    test('should correctly calculate', () => {
        const pool1 = createTestPool({
            poolId: '1',
            operatorAddress: '1',
            currentEpochMockStats: {
                operatorShare: 0.005,
                zrxStaked: 1000,
                approximateStakeRatio: 0.02,
                totalProtocolFeesGeneratedInEth: 0.0,
            },
            nextEpochMockStats: {
                operatorShare: 0.005,
                zrxStaked: 1000,
                approximateStakeRatio: 0.02,
                totalProtocolFeesGeneratedInEth: 0.0,
            },
        });
        const pool2 = createTestPool({
            poolId: '2',
            operatorAddress: '2',
            currentEpochMockStats: {
                operatorShare: 0.007,
                zrxStaked: 2000,
                approximateStakeRatio: 0.07,
                totalProtocolFeesGeneratedInEth: 0.001,
            },
            nextEpochMockStats: {
                operatorShare: 0.007,
                zrxStaked: 2000,
                approximateStakeRatio: 0.07,
                totalProtocolFeesGeneratedInEth: 0.001,
            },
        });

        const AMOUNT_TO_STAKE = 10000;
        const recommendedPools = getRecommendedStakingPools(AMOUNT_TO_STAKE, [pool1, pool2]);

        // Assert on results..
        expect(recommendedPools).toHaveLength(2);

        expect(recommendedPools[0].zrxAmount).toEqual(6666.67);
        expect(recommendedPools[0].pool.poolId).toEqual('1');

        expect(recommendedPools[1].zrxAmount).toEqual(3333.33);
        expect(recommendedPools[1].pool.poolId).toEqual('2');
    });
});

describe('getRecommendedStakingPools rounding', () => {
    test('should not break on zero', () => {
        const totalRequestedToStake = 0;
        const recommendedPools = getRecommendedStakingPools(totalRequestedToStake, SAMPLE_POOLS);
        expect(recommendedPools).toHaveLength(0);
    });

    test('should correctly distribute the entire requested value (whole number)', () => {
        const totalRequestedToStake = 470;
        const recommendedPools = getRecommendedStakingPools(totalRequestedToStake, SAMPLE_POOLS);
        const actualTotalSum = BigNumber.sum(...recommendedPools.map(x => new BigNumber(x.zrxAmount))).toNumber();
        expect(actualTotalSum).toBe(totalRequestedToStake);
    });

    test('should correctly distribute the requested value (odd decimal)', () => {
        const totalRequestedToStake = 177.77;
        const recommendedPools = getRecommendedStakingPools(totalRequestedToStake, SAMPLE_POOLS);
        const actualTotalSum = BigNumber.sum(...recommendedPools.map(x => new BigNumber(x.zrxAmount))).toNumber();
        expect(actualTotalSum).toBe(totalRequestedToStake);
    });

    test('should correctly distribute the requested value (another odd decimal)', () => {
        const totalRequestedToStake = 4200.27;
        const recommendedPools = getRecommendedStakingPools(totalRequestedToStake, SAMPLE_POOLS);
        const actualTotalSum = BigNumber.sum(...recommendedPools.map(x => new BigNumber(x.zrxAmount))).toNumber();
        expect(actualTotalSum).toBe(totalRequestedToStake);
    });

    test('should add correctly with basic Number type', () => {
        const totalRequestedToStake = 422.77;
        const recommendedPools = getRecommendedStakingPools(totalRequestedToStake, SAMPLE_POOLS);
        const actualTotalSum = sum(recommendedPools.map(p => p.zrxAmount));
        expect(actualTotalSum).toBe(totalRequestedToStake);
    });

    test('should correctly distribute the requested value (very large number)', () => {
        const totalRequestedToStake = 123456789.12;
        const recommendedPools = getRecommendedStakingPools(totalRequestedToStake, SAMPLE_POOLS);
        const actualTotalSum = BigNumber.sum(...recommendedPools.map(x => new BigNumber(x.zrxAmount))).toNumber();
        expect(actualTotalSum).toBe(totalRequestedToStake);
    });

    test('should autoround if given more than two decimals', () => {
        const totalRequestedToStake = 1277.12999;
        const totalRequestedToStakeRounded = 1277.12;
        const recommendedPools = getRecommendedStakingPools(totalRequestedToStake, SAMPLE_POOLS);
        const actualTotalSum = BigNumber.sum(...recommendedPools.map(x => new BigNumber(x.zrxAmount))).toNumber();
        expect(actualTotalSum).toBe(totalRequestedToStakeRounded);
    });
});
