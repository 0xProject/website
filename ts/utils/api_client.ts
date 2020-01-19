import * as _ from 'lodash';

import {
    Network,
    StakingAPIDelegatorResponse,
    StakingAPIEpochsResponse,
    StakingAPIPoolByIdResponse,
    StakingAPIPoolsResponse,
    StakingAPIStatsResponse,
    StakingPoolResponse,
} from 'ts/types';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const STAKING_POOLS_ENDPOINT = '/staking/pools';
const DELEGATOR_ENDPOINT = '/staking/delegator';
const STAKING_EPOCHS_ENDPOINT = '/staking/epochs';
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

    public async getDelegatorAsync(delegatorAddress: string): Promise<StakingAPIDelegatorResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${DELEGATOR_ENDPOINT}/${delegatorAddress.toLowerCase()}`,
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
}
