const algoliasearch = require('algoliasearch/lite');

import { ALGOLIA_APP_ID } from '../ts/utils/algolia_constants';

const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
if (ALGOLIA_ADMIN_API_KEY === undefined) {
    throw new Error('Env. var. ALGOLIA_ADMIN_API_KEY is undefined. An admin client cannot be instantiated without an admin API key.');
}
const ALGOLIA_ADMIN_OPTIONS = {
    timeouts: {
        connect: 10000,
        read: 2 * 10000,
        write: 30 * 10000,
    },
};
export const adminClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, ALGOLIA_ADMIN_OPTIONS);
