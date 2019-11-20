import * as _ from 'lodash';

import {
    StakingAPIPoolsResponse,
} from 'ts/types';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const STAKING_POOLS_ENDPOINT = '/staking/pools';

export const apiClient = {
    async getStakingPoolsAsync(): Promise<StakingAPIPoolsResponse> {
        const result = await fetchUtils.requestAsync(utils.getAPIBaseUrl(), STAKING_POOLS_ENDPOINT);
        return result;
    },
};
