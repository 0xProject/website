import * as _ from 'lodash';

import { Network, StakingAPIDelegatorResponse, StakingAPIPoolsResponse } from 'ts/types';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const STAKING_POOLS_ENDPOINT = '/staking/pools';
const DELEGATOR_ENDPOINT = '/staking/delegator';

export class APIClient {
    public networkId: Network;
    public async getStakingPoolsAsync(): Promise<StakingAPIPoolsResponse> {
        const result = await fetchUtils.requestAsync(utils.getAPIBaseUrl(this.networkId), STAKING_POOLS_ENDPOINT);
        return result;
    }
    public async getDelegatorAsync(delegatorAddress: string): Promise<StakingAPIDelegatorResponse> {
        const result = await fetchUtils.requestAsync(
            utils.getAPIBaseUrl(this.networkId),
            `${DELEGATOR_ENDPOINT}/${delegatorAddress}`,
        );
        return result;
    }
    constructor(networkId: Network) {
        this.networkId = networkId;
    }
}
