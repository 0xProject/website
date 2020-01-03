import { BigNumber } from '@0x/utils';
import { sum } from 'lodash';

import { stakingUtils } from 'ts/utils/staking_utils';

import { SAMPLE_POOLS } from 'ts/test/fixtures/staking_pools';

const { getRecommendedStakingPools } = stakingUtils;

describe('getRecommendedStakingPools', () => {
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
