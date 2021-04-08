import * as _ from 'lodash';

import {
    Network,
    StakingAPIDelegatorHistoryItem,
    StakingAPIDelegatorResponse,
    StakingAPIEpochsResponse,
    StakingAPIEpochsWithFeesResponse,
    StakingAPIPoolByIdResponse,
    StakingAPIPoolsResponse,
    StakingAPIStatsResponse,
    StakingPoolResponse,
    StakingPoolRewardsResponse,
} from 'ts/types';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const STAKING_POOLS_ENDPOINT = '/staking/pools';
const STAKING_POOL_REWARDS_ENDPOINT = '/staking/pools/rewards';
const DELEGATOR_ENDPOINT = '/staking/delegator';
const DELEGATOR_HISTORY_ENDPOINT = '/staking/delegator/events';
const STAKING_EPOCHS_ENDPOINT = '/staking/epochs';
const STAKING_EPOCHS_WITH_FEES_ENDPOINT = '/staking/epochs?withFees=true';
const STAKING_STATS_ENDPOINT = '/staking/stats';

const getStakingPoolByIdEndpoint = (poolId: string) => {
    return `${STAKING_POOLS_ENDPOINT}/${poolId}`;
};

export class APIClient {
    public networkId: Network;
    constructor(networkId: Network) {
        this.networkId = networkId;
    }

    public async getStakingPoolsAsync(): Promise<StakingAPIPoolsResponse> {
        const result = await fetchUtils.requestAsync<StakingAPIPoolsResponse>(
            utils.getAPIBaseUrl(this.networkId),
            STAKING_POOLS_ENDPOINT,
        );
        return result;
    }

    public async getStakingPoolAsync(poolId: string): Promise<StakingPoolResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${STAKING_POOLS_ENDPOINT}/${poolId}`,
        );

        return result;
    }

    public async getStakingPoolRewardsAsync(poolId: string): Promise<StakingPoolRewardsResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${STAKING_POOL_REWARDS_ENDPOINT}/${poolId}`,
        );

        return result;
    }

    public async getDelegatorAsync(delegatorAddress: string): Promise<StakingAPIDelegatorResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${DELEGATOR_ENDPOINT}/${delegatorAddress.toLowerCase()}`,
        );

        return result;
    }

    public async getDelegatorHistoryAsync(delegatorAddress: string): Promise<StakingAPIDelegatorHistoryItem[]> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${DELEGATOR_HISTORY_ENDPOINT}/${delegatorAddress.toLowerCase()}`,
        );

        return result;
    }

    public async getStakingEpochsAsync(): Promise<StakingAPIEpochsResponse> {
        const result = await fetchUtils.requestAsync<StakingAPIEpochsResponse>(
            utils.getAPIBaseUrl(this.networkId),
            STAKING_EPOCHS_ENDPOINT,
        );
        return result;
    }

    public async getStakingEpochsWithFeesAsync(): Promise<StakingAPIEpochsWithFeesResponse> {
        const result = await fetchUtils.requestAsync<StakingAPIEpochsWithFeesResponse>(
            utils.getAPIBaseUrl(this.networkId),
            STAKING_EPOCHS_WITH_FEES_ENDPOINT,
        );
        return result;
    }

    public async getStakingStatsAsync(): Promise<StakingAPIStatsResponse> {
        const result = await fetchUtils.requestAsync<StakingAPIStatsResponse>(
            utils.getAPIBaseUrl(this.networkId),
            STAKING_STATS_ENDPOINT,
        );
        return result;
    }

    public async getStakingPoolByIdAsync(poolId: string): Promise<StakingAPIPoolByIdResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            getStakingPoolByIdEndpoint(poolId),
        );
        return result;
    }

    public async getETHZRXPricesAsync(): Promise<ETHZRXPriceResponse> {
        const resultETH = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            '/swap/v1/price?sellToken=ETH&buyToken=DAI&sellAmount=1000000000000000000',
        );
        const resultZRX = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            '/swap/v1/price?sellToken=ZRX&buyToken=DAI&sellAmount=1000000000000000000',
        );
        return {
            eth: resultETH,
            zrx: resultZRX,
        };
    }
}
