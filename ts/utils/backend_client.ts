import * as _ from 'lodash';

import { Web3Wrapper } from '@0x/web3-wrapper';
import { ZeroExProvider } from 'ethereum-types';

import {
    EIP1559GasInfo,
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
import { fetchUtils } from 'ts/utils/fetch_utils';
import { utils } from 'ts/utils/utils';

import { gql, GraphQLClient } from 'graphql-request';

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

export interface GasInfoSelection {
    fastest: number;
    average: number;
    fast: number;
}

interface GasApiSingleSourceResponse {
    result: {
        source: string;
        timestamp: number;
        instant: EIP1559GasInfo;
        fast: EIP1559GasInfo;
        standard: EIP1559GasInfo;
        low: EIP1559GasInfo;
    };
}

type GasSpeedSelectors = 'instant' | 'fast' | 'standard' | 'low';

const speedToWaitTimeMap: { [key: string]: string } = {
    standard: 'avgWait',
    fast: 'fastWait',
    instant: 'fastestWait',
};

const graphqlClient = new GraphQLClient('https://hub.snapshot.org/graphql');

export const backendClient = {
    async getSnapshotSpaceAsync(): Promise<any> {
        const spaceQuery = gql`
            query GetSpace($id: String!) {
                space(id: $id) {
                    id
                    name
                    about
                    network
                    symbol
                    members
                }
            }
        `;

        const res = await graphqlClient.request(spaceQuery, { id: '0xgov.eth' });
        return res;
    },
    async getSnapshotProposalsAsync(): Promise<any> {
        const proposalsQuery = gql`
            query {
                proposals(first: 1000, where: { space_in: ["0xgov.eth"] }) {
                    id
                    title
                    body
                    choices
                    start
                    end
                    snapshot
                    state
                    author
                    space {
                        id
                        name
                    }
                }
            }
        `;

        const res = await graphqlClient.request(proposalsQuery, {});
        return res;
    },

    async getSnapshotVotesAsync(proposalId: string): Promise<any> {
        const votesQuery = gql`
            query GetVotes($proposal: String!) {
                votes(first: 1000, skip: 0, where: { proposal: $proposal }) {
                    id
                    voter
                    created
                    choice
                    space {
                        id
                    }
                }
            }
        `;

        const res = await graphqlClient.request(votesQuery, { proposal: proposalId });
        return res;
    },

    async getSnapshotProposalsAndVotesAsync(): Promise<any> {
        // tslint:disable-next-line: no-invalid-this
        const res = await this.getSnapshotProposalsAsync();
        const { proposals } = res;

        const getVotesPromises = [];

        for (const element of proposals) {
            // tslint:disable-next-line: no-invalid-this
            getVotesPromises.push(this.getSnapshotVotesAsync(element.id));
        }

        const votesResult = await Promise.all(getVotesPromises);

        return proposals.map((proposal: any, index: number) => {
            const votes = votesResult[index];
            proposal.votes = votes;
            return proposal;
        });
    },

    async getTreasuryTokenPricesAsync(): Promise<any> {
        const treasuryTokenCGIds = ['0x', 'matic-network', 'celo'];
        const cgSimplePriceBaseUri = 'https://api.coingecko.com/api/v3/simple/price';
        const res = fetchUtils.requestAsync(
            cgSimplePriceBaseUri,
            `?ids=${treasuryTokenCGIds.join(',')}&vs_currencies=usd`,
        );
        return res;
    },

    async getTreasuryTokenTransfersAsync(): Promise<any[]> {
        const ZRX_TOKEN = '0xe41d2489571d322189246dafa5ebde1f4699f498';
        const MATIC_TOKEN = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
        const WCELO_TOKEN = '0xe452e6ea2ddeb012e20db73bf5d3863a3ac8d77a';
        const reqBaseUri =
            'https://api.covalenthq.com/v1/1/address/0x0bB1810061C2f5b2088054eE184E6C79e1591101/transfers_v2/';
        const zrxTransfers = fetchUtils.requestAsync(
            reqBaseUri,
            `?contract-address=${ZRX_TOKEN}&key=ckey_6a1cbb454aa243b1bc66da64530`,
        );
        const maticTransfers = fetchUtils.requestAsync(
            reqBaseUri,
            `?contract-address=${MATIC_TOKEN}&key=ckey_6a1cbb454aa243b1bc66da64530`,
        );
        const wCeloTransfers = fetchUtils.requestAsync(
            reqBaseUri,
            `?contract-address=${WCELO_TOKEN}&key=ckey_6a1cbb454aa243b1bc66da64530`,
        );

        return Promise.all([zrxTransfers, maticTransfers, wCeloTransfers]);
    },

    async getTreasuryProposalDistributionsAsync(provider: ZeroExProvider): Promise<any[]> {
        const web3 = new Web3Wrapper(provider);
        const reqBaseUri = `https://api.covalenthq.com/v1/1/transaction_v2/`;
        const proposalExecutionLogs = await web3.getLogsAsync({
            address: '0x0bb1810061c2f5b2088054ee184e6c79e1591101',
            topics: ['0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f'],
            fromBlock: 0,
            toBlock: 'latest',
        });

        const txnHashesPromises = proposalExecutionLogs.map(async (log) => {
            return fetchUtils.requestAsync(reqBaseUri, `${log.transactionHash}/?key=ckey_6a1cbb454aa243b1bc66da64530`);
        });

        const transactions = await Promise.all(txnHashesPromises);
        const data = transactions.map((txn) => {
            let proposalId;
            const tokensTransferred: any[] = [];
            txn.data.items[0].log_events.forEach((log: any) => {
                if (log.decoded.name === 'ProposalExecuted') {
                    proposalId = log.decoded.params[0].value;
                } else if (log.decoded.name === 'Transfer') {
                    tokensTransferred.push({
                        name: log.sender_contract_ticker_symbol,
                        amount: parseInt(log.decoded.params[2].value, 10) / 10 ** (log.sender_contract_decimals || 18),
                    });
                }
            });

            return { proposalId, tokensTransferred, hash: txn.data.items[0].tx_hash };
        });
        return data;
    },

    async getGasInfoAsync(speed?: string): Promise<GasInfo> {
        const gasApiPath = 'v2/source/block_native';
        const gasInfoReq: Promise<GasApiSingleSourceResponse> = fetchUtils.requestAsync(ZEROEX_GAS_API, gasApiPath);
        const speedInput = speed || 'standard';

        const gasWaitTimesReq = fetchUtils.requestAsync(utils.getBackendBaseUrl(), ETH_GAS_STATION_ENDPOINT);

        const [gasInfo, gasWaitTimes]: [GasApiSingleSourceResponse, WebsiteBackendGasWaitTimeInfo] = await Promise.all([
            gasInfoReq,
            gasWaitTimesReq,
        ]);
        // Time is in minutes
        const waitTime = speedToWaitTimeMap[speedInput];
        const estimatedTimeMs = (gasWaitTimes as any)[waitTime] * 60 * 1000; // Minutes to MS

        // Try to use user selected value, fall back to standard if no match
        const gasPriceInfo = gasInfo.result[speedInput as GasSpeedSelectors]
            ? gasInfo.result[speedInput as GasSpeedSelectors]
            : gasInfo.result.standard;
        return { ...gasPriceInfo, estimatedTimeMs };
    },

    async getGasInfoSelectionAsync(): Promise<GasInfoSelection> {
        const gasApiPath = 'source/median?output=eth_gas_station';
        const gasInfoReq = fetchUtils.requestAsync(ZEROEX_GAS_API, gasApiPath);

        const gasInfo: WebsiteBackendGasInfo = await gasInfoReq;
        return {
            fast: gasInfo.fast / 10,
            fastest: gasInfo.fastest / 10,
            average: gasInfo.average / 10,
        };
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
