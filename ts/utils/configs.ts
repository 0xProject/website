import { environments } from 'ts/utils/environments';

import { GoogleSheetLeadUrls, OutdatedWrappedEtherByNetworkId, PublicNodeUrlsByNetworkId } from '../types';

const BASE_URL = window.location.origin;
// NOTE: Production key only works on 0x.org and 0xproject.com
const INFURA_API_KEY = environments.isDevelopment()
    ? '3cd49e08510e484aaf1253fc1fa58f0c'
    : 'dbb71566cad444979f59c42b11b4f603';

export const ALCHEMY_API_KEY = '8JwI7bMSK8ojsPDbyeHt6NK8w23afo1q';
export const GOVERNOR_CONTRACT_ADDRESS = {
    COMPOUND: '0xc0dA01a04C3f3E0be433606045bB7017A7323E38',
    UNISWAP: '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F',
    ZRX: '0x5d8C9Ba74607D2cbc4176882A42D4ACE891c1c00',
};

export const GOVERNANCE_THEGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/mzhu25/zeroex-staking';

export const configs = {
    AMOUNT_DISPLAY_PRECSION: 5,
    BACKEND_BASE_PROD_URL: 'https://website.api.0x.org',
    BACKEND_BASE_STAGING_URL: 'https://website.api.0x.org',
    BACKEND_BASE_DEV_URL: 'https://website.api.0x.org',
    API_BASE_PROD_URL: 'https://api.0x.org',
    API_BASE_STAGING_URL: 'https://staging.api.0x.org',
    API_BASE_KOVAN_URL: 'https://kovan.api.0x.org',
    API_BASE_DEV_URL: 'https://staging.api.0x.org',
    GOOGLE_SHEETS_LEAD_FORMS: {
        CREDITS: 'https://script.google.com/macros/s/AKfycbyN1lJaSGWg2OIzqT8bou4GiqwCmOVjV2v_fiPO/exec',
    } as GoogleSheetLeadUrls,
    BASE_URL,
    BITLY_ACCESS_TOKEN: 'ffc4c1a31e5143848fb7c523b39f91b9b213d208',
    DEFAULT_DERIVATION_PATH: `44'/60'/0'`,
    // WARNING: ZRX & WETH MUST always be default trackedTokens
    DEFAULT_TRACKED_TOKEN_SYMBOLS: ['WETH', 'ZRX'],
    DOMAIN_VOTE: 'vote.api.0x.org',
    DOMAIN_VOTE_STAGING: 'vote.staging.api.0x.org',
    VOTE_INSTANT_ORDER_SOURCE: 'https://api.0x.org/sra/v3/',
    VOTE_INSTANT_ASSET_DATAS: ['0xf47261b0000000000000000000000000e41d2489571d322189246dafa5ebde1f4699f498'],
    GOOGLE_ANALYTICS_ID: 'UA-98720122-1',
    LAST_LOCAL_STORAGE_FILL_CLEARANCE_DATE: '2017-11-22',
    LAST_LOCAL_STORAGE_TRACKED_TOKEN_CLEARANCE_DATE: '2018-9-7',
    OUTDATED_WRAPPED_ETHERS: [
        {
            42: {
                address: '0x05d090b51c40b020eab3bfcb6a2dff130df22e9c',
                timestampMsRange: {
                    startTimestampMs: 1502455607000,
                    endTimestampMs: 1513790926000,
                },
            },
            1: {
                address: '0x2956356cd2a2bf3202f771f50d3d14a367b48070',
                timestampMsRange: {
                    startTimestampMs: 1502455607000,
                    endTimestampMs: 1513790926000,
                },
            },
        },
    ] as OutdatedWrappedEtherByNetworkId[],
    // The order matters. We first try first node and only then fall back to others.
    PUBLIC_NODE_URLS_BY_NETWORK_ID: {
        [1]: ['https://eth-mainnet.alchemyapi.io/v2/8JwI7bMSK8ojsPDbyeHt6NK8w23afo1q'], // [`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, 'https://mainnet.0x.org'],
        [42]: [`https://kovan.infura.io/v3/${INFURA_API_KEY}`, 'https://kovan.0x.org'],
        [3]: [`https://ropsten.infura.io/v3/${INFURA_API_KEY}`],
        [4]: [`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`],
    } as PublicNodeUrlsByNetworkId,
    SYMBOLS_OF_MINTABLE_KOVAN_TOKENS: ['ZRX', 'MKR', 'MLN', 'GNT', 'DGD', 'REP'],
    SYMBOLS_OF_MINTABLE_ROPSTEN_TOKENS: ['ZRX', 'MKR', 'MLN', 'GNT', 'DGD', 'REP'],
    GENERAL_MAILING_LIST_ID: 'dcbcabc57b',
    GENERAL_LIST_ECOSYSTEM_UPDATES_INTEREST_ID: 'dd975da3c5',
    GENERAL_LIST_DEVELOPER_UPDATES_INTEREST_ID: 'f2ae6906e3',
    STAKING_UPDATES_NEWSLETTER_ID: '00c1a72ae8',
};
