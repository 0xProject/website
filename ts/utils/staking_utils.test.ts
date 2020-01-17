// tslint:disable: number-literal-format
import { BigNumber } from '@0x/utils';
import { sum } from 'lodash';

import { stakingUtils } from 'ts/utils/staking_utils';

import { SAMPLE_POOLS } from 'ts/test/fixtures/staking_pools';

import * as inputJson from 'ts/test/fixtures/staking_rec_algo_test_input_1.json';
import * as inputJson2 from 'ts/test/fixtures/staking_rec_algo_test_input_2.json';
import * as outputJson from 'ts/test/fixtures/staking_rec_algo_test_output_1.json';
import * as outputJson2 from 'ts/test/fixtures/staking_rec_algo_test_output_2.json';

const { getRecommendedStakingPools } = stakingUtils;

// Kroeger wrote some test cases from his python script.
// These tests assert on the serialized input/output from those test cases.
describe('getRecommendedStakingPools implementation', () => {
    test('recommendation algo kroger test case 1', () => {
        const { zrxToStake, pools } = inputJson as any;
        const recommendedPools = getRecommendedStakingPools(zrxToStake, pools);
        expect(recommendedPools).toEqual(outputJson);
    });

    test('recommendation algo kroeger test case 2', () => {
        const { zrxToStake, pools } = inputJson2 as any;
        const recommendedPools = getRecommendedStakingPools(zrxToStake, pools);
        expect(recommendedPools).toEqual(outputJson2);
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
