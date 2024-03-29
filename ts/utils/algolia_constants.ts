import * as algoliasearch from 'algoliasearch/lite';

import { ObjectMap } from '@0x/types';

const ALGOLIA_MAX_NUMBER_HITS = 1000; // Limit set by algolia

export const ALGOLIA_MAX_NUMBER_FACETS = 15;

export const ALGOLIA_APP_ID = '39X6WOJZKW';
const ALGOLIA_CLIENT_API_KEY = '6acba761a34d99781628c6178af1e16c';
export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_CLIENT_API_KEY);

export const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced'];

export const hitsPerPage = {
    autocomplete: 5,
    pages: ALGOLIA_MAX_NUMBER_HITS, // Maximum set by algolia
};

export function getNameToSearchIndex(environment: string): ObjectMap<string> {
    const lowercaseEnv = environment.toLowerCase();
    const nameToSearchIndex: ObjectMap<string> = {
        api: `${lowercaseEnv}_api`,
        'core-concepts': `${lowercaseEnv}_core_concepts`,
        guides: `${lowercaseEnv}_guides`,
        tools: `${lowercaseEnv}_tools`,
    };
    return nameToSearchIndex;
}
