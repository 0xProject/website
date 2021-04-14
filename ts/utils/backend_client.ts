import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';

import {
    GasInfo,
    MailchimpSubscriberInfo,
    WebsiteBackendCFLMetricsData,
    WebsiteBackendGasInfo,
    WebsiteBackendGasWaitTimeInfo,
    WebsiteBackendJobInfo,
    WebsiteBackendPriceInfo,
    WebsiteBackendRelayerInfo,
    WebsiteBackendStakingPoolInfo,
    WebsiteBackendTokenInfo,
    WebsiteBackendTradingPairs,
} from 'ts/types';
import { constants } from 'ts/utils/constants';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

const ZEROEX_GAS_API = 'https://gas.api.0x.org/';

const ETH_GAS_STATION_ENDPOINT = '/eth_gas_station';
const JOBS_ENDPOINT = '/jobs';
const PRICES_ENDPOINT = '/prices';
const RELAYERS_ENDPOINT = '/relayers';
const TOKENS_ENDPOINT = '/tokens';
const CFL_METRICS_ENDPOINT = '/cfl-metrics';
const SUBSCRIBE_MAILCHIMP_NEWSLETTER_ENDPOINT = '/newsletter_subscriber/mailchimp';
const TRADING_PAIRS_ENDPOINT = '/trading-pairs';
const STAKING_POOLS_ENDPOINT = '/staking-pools';

export const backendClient = {
    async getGasInfoAsync(): Promise<GasInfo> {
        // Median gas prices across 0x api gas oracles
        // Defaulting to average/standard gas. Using eth gas station for time estimates
        const gasApiPath = 'source/median?output=eth_gas_station';
        const gasInfoReq = fetchUtils.requestAsync(ZEROEX_GAS_API, gasApiPath);
        const gasWaitTimesReq = fetchUtils.requestAsync(utils.getBackendBaseUrl(), ETH_GAS_STATION_ENDPOINT);

        const res: [WebsiteBackendGasInfo, WebsiteBackendGasWaitTimeInfo] = await Promise.all([
            gasInfoReq,
            gasWaitTimesReq,
        ]);
        const gasInfo = res[0];
        const gasWaitTimes = res[1];

        // Eth Gas Station result is gwei * 10
        const gasPriceInGwei = new BigNumber(gasInfo.average / 10);
        // Time is in minutes
        const estimatedTimeMs = gasWaitTimes.avgWait * 60 * 1000; // Minutes to MS
        return { gasPriceInWei: gasPriceInGwei.multipliedBy(constants.GWEI_IN_WEI), estimatedTimeMs };
    },

    async getJobInfosAsync(): Promise<WebsiteBackendJobInfo[]> {
        const result = await fetchUtils.requestAsync(utils.getBackendBaseUrl(), JOBS_ENDPOINT);
        return result;
    },
    async getPriceInfoAsync(tokenSymbols: string[]): Promise<WebsiteBackendPriceInfo> {
        if (_.isEmpty(tokenSymbols)) {
            return {};
        }
        const joinedTokenSymbols = tokenSymbols.join(',');
        const queryParams = {
            tokens: joinedTokenSymbols,
        };
        const result = await fetchUtils.requestAsync(utils.getBackendBaseUrl(), PRICES_ENDPOINT, queryParams);
        return result;
    },
    async getRelayerInfosAsync(): Promise<WebsiteBackendRelayerInfo[]> {
        const result = await fetchUtils.requestAsync(utils.getBackendBaseUrl(), RELAYERS_ENDPOINT);
        return result;
    },
    async getTokenInfosAsync(): Promise<WebsiteBackendTokenInfo[]> {
        const result = await fetchUtils.requestAsync(utils.getBackendBaseUrl(), TOKENS_ENDPOINT);
        return result;
    },
    async subscribeToNewsletterAsync({
        email,
        subscriberInfo,
        list,
        tags,
        interests,
    }: {
        email: string;
        subscriberInfo?: MailchimpSubscriberInfo;
        list?: string;
        tags?: string[];
        interests?: { [key: string]: boolean };
    }): Promise<Response> {
        const result = await fetchUtils.postAsync(utils.getBackendBaseUrl(), SUBSCRIBE_MAILCHIMP_NEWSLETTER_ENDPOINT, {
            email: email.trim(),
            list,
            tags: [...(tags || []), location.href],
            interests,
            subscriberInfo,
        });
        return result;
    },
    async getCFLMetricsAsync(): Promise<WebsiteBackendCFLMetricsData> {
        return fetchUtils.requestAsync(utils.getBackendBaseUrl(), CFL_METRICS_ENDPOINT);
    },
    async getTradingPairsAsync(): Promise<WebsiteBackendTradingPairs[]> {
        return fetchUtils.requestAsync(utils.getBackendBaseUrl(), TRADING_PAIRS_ENDPOINT);
    },
    async getStakingPoolsAsync(): Promise<WebsiteBackendStakingPoolInfo[]> {
        return fetchUtils.requestAsync(utils.getBackendBaseUrl(), STAKING_POOLS_ENDPOINT);
    },
    async getStakingPoolAsync(id: string): Promise<WebsiteBackendStakingPoolInfo> {
        return fetchUtils.requestAsync(utils.getBackendBaseUrl(), `${STAKING_POOLS_ENDPOINT}/${id}`);
    },
};
