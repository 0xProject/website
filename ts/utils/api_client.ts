import * as _ from 'lodash';

import {
    Network,
    StakingAPIPoolsResponse,
} from 'ts/types';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const STAKING_POOLS_ENDPOINT = '/staking/pools';

export class APIClient {
    private readonly _networkId: Network;
    public async getStakingPoolsAsync(): Promise<StakingAPIPoolsResponse> {
        const result = await fetchUtils.requestAsync(utils.getAPIBaseUrl(this._networkId), STAKING_POOLS_ENDPOINT);
        return result;
    }
    constructor(networkId: Network) {
        this._networkId = networkId;
    }
}
