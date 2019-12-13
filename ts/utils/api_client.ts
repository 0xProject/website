import * as _ from 'lodash';

import {
    Network,
    StakingAPIDelegatorResponse,
    StakingAPIEpochsResponse,
    StakingAPIPoolsResponse,
    StakingPoolResponse,
} from 'ts/types';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const STAKING_POOLS_ENDPOINT = '/staking/pools';
const STAKING_POOL_ENDPOINT = '/staking/pool';
const DELEGATOR_ENDPOINT = '/staking/delegator';
const STAKING_EPOCHS_ENDPOINT = '/staking/epochs';

export class APIClient {
    public networkId: Network;
    constructor(networkId: Network) {
        this.networkId = networkId;
    }

    public async getStakingPoolsAsync(): Promise<StakingAPIPoolsResponse> {
        const result = await fetchUtils.requestAsync(utils.getAPIBaseUrl(this.networkId), STAKING_POOLS_ENDPOINT);
        return result;
    }

    public async getStakingPoolAsync(poolId: string): Promise<StakingPoolResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${STAKING_POOL_ENDPOINT}/${poolId}`,
        );

        return result;
    }

    public async getDelegatorAsync(delegatorAddress: string): Promise<StakingAPIDelegatorResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${DELEGATOR_ENDPOINT}/${delegatorAddress}`,
        );

        return result;
    }

    public async getStakingEpochsAsync(): Promise<StakingAPIEpochsResponse> {
        const result = await fetchUtils.requestAsync(utils.getAPIBaseUrl(this.networkId), STAKING_EPOCHS_ENDPOINT);
        return result;
    }
}
