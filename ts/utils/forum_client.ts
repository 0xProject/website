import * as _ from 'lodash';
import { fetchUtils } from 'ts/utils/fetch_utils';

import { FORUM_API_ENDPOINT } from './configs';

interface ForumUser {
    id: number;
    username: string;
}

export interface ForumTopic {
    id: number;
    title: string;
    author: ForumUser;
    numPosts: number;
    url: string;
}

interface ForumPosterResponse {
    user_id: number;
    description: string;
}

interface ForumTopicResponse {
    id: number;
    title: string;
    posters: ForumPosterResponse[];
    posts_count: number;
    visible: boolean;
    slug: string;
    category_id: number;
}

interface TopicApiResponse {
    users: ForumUser[];
    topic_list: {
        topics: ForumTopicResponse[];
    };
}

const GOVERNANCE_SLUG = 'governance';
const GOVERNANCE_CATEGORY_ID = 13;

function makeTopPostsPerCategoryEndpoint(slug: string, categoryId: number): string {
    return `/c/${slug}/${categoryId}/l/top.json?ascending=false`;
}

function makeLatestPostsPerCategoryEndpoint(slug: string, categoryId: number, page: number = 0): string {
    return `/c/${slug}/${categoryId}/l/latest.json?ascending=false&page=${page}`;
}

function getOriginalPosterUser(apiRes: TopicApiResponse, topicRes: ForumTopicResponse): ForumUser {
    return apiRes.users.find(({ id }) => id === topicRes.posters[0].user_id);
}

function buildTopicsFromApiResponse(apiRes: TopicApiResponse): ForumTopic[] {
    return apiRes.topic_list.topics.map((res) => {
        const user = getOriginalPosterUser(apiRes, res);
        return {
            id: res.id,
            title: res.title,
            author: user,
            numPosts: res.posts_count,
            url: `${FORUM_API_ENDPOINT}/t/${res.slug}`,
        };
    });
}

export async function getTopNPostsAsync(numPosts: number = 3): Promise<ForumTopic[]> {
    const result = await fetchUtils.requestAsync<TopicApiResponse>(
        FORUM_API_ENDPOINT,
        makeTopPostsPerCategoryEndpoint(GOVERNANCE_SLUG, GOVERNANCE_CATEGORY_ID),
        undefined,
        {},
    );
    const builtTopics = buildTopicsFromApiResponse(result);
    const topNTopics = builtTopics.slice(0, numPosts);

    return topNTopics;
}

export async function getLatestNPostsFilteredAsync(
    numPosts: number = 3,
    filter: (topic: ForumTopic) => boolean,
): Promise<ForumTopic[]> {
    const out: ForumTopic[] = [];
    let page = 0;
    let result: TopicApiResponse = null;
    while (out.length < numPosts) {
        result = await fetchUtils.requestAsync<TopicApiResponse>(
            FORUM_API_ENDPOINT,
            makeLatestPostsPerCategoryEndpoint(GOVERNANCE_SLUG, GOVERNANCE_CATEGORY_ID, page++),
        );
        if (result.topic_list.topics.length === 0) {
            break;
        }
        const buildTopics = buildTopicsFromApiResponse(result);
        const filteredResults = buildTopics.filter(filter);
        for (const res of filteredResults) {
            out.push(res);
            if (out.length === numPosts) {
                break;
            }
        }
    }
    return out;
}
