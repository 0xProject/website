import * as _ from 'lodash';

import { Network, StakingAPIEpochsResponse, StakingAPIPoolsResponse, StakingAPIStatsResponse } from 'ts/types';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const STAKING_POOLS_ENDPOINT = '/staking/pools';
const STAKING_EPOCHS_ENDPOINT = '/staking/epochs';
const STAKING_STATS_ENDPOINT = '/staking/stats';

export class APIClient {
    public networkId: Network;
    public async getStakingPoolsAsync(): Promise<StakingAPIPoolsResponse> {
        const result = await fetchUtils.requestAsync<StakingAPIPoolsResponse>(utils.getAPIBaseUrl(this.networkId), STAKING_POOLS_ENDPOINT);
        return result;
    }
    public async getStakingEpochsAsync(): Promise<StakingAPIEpochsResponse> {
        const result = await fetchUtils.requestAsync<StakingAPIEpochsResponse>(utils.getAPIBaseUrl(this.networkId), STAKING_EPOCHS_ENDPOINT);
        return result;
    }
    public async getStakingStatsAsync(): Promise<StakingAPIStatsResponse> {
        const result = await fetchUtils.requestAsync<StakingAPIStatsResponse>(utils.getAPIBaseUrl(this.networkId), STAKING_STATS_ENDPOINT);
        return result;
    }
    constructor(networkId: Network) {
        this.networkId = networkId;
    }
}
