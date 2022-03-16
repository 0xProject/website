import * as _ from 'lodash';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { FORUM_API_ENDPOINT, ZRX_FORUMS_API_KEY } from './configs';

type ForumUser = {
    id: number;
    username: string;
};

type ForumTopic = {
    id: number;
    title: string;
    author: ForumUser;
    numPosts: number;
    url: string;
};

type ForumPosterResponse = {
    user_id: number;
    description: string;
};

type ForumTopicResponse = {
    id: number;
    title: string;
    posters: ForumPosterResponse[];
    posts_count: number;
    visible: boolean;
    slug: string;
    category_id: number;
};

type TopicApiResponse = {
    users: ForumUser[];
    topic_list: {
        topics: ForumTopicResponse[];
    };
};

const GOVERNANCE_SLUG = 'governance';
const GOVERNANCE_CATEGORY_ID = 13;

function makeTopPostsPerCategoryEndpoint(slug: string, categoryId: number): string {
    return `/c/${slug}/${categoryId}/l/top.json?ascending=false`;
}

export async function getTopNPosts(numPosts: number = 3): Promise<ForumTopic[]> {
    const result = await fetchUtils.requestAsync<TopicApiResponse>(
        FORUM_API_ENDPOINT,
        makeTopPostsPerCategoryEndpoint(GOVERNANCE_SLUG, GOVERNANCE_CATEGORY_ID),
        undefined,
        {},
    );
    const topNRawResults = result.topic_list.topics.slice(0, numPosts);
    const topNTopics: ForumTopic[] = topNRawResults.map((res) => {
        const user: ForumUser = result.users.find(({ id }) => id === res.posters[0].user_id);
        return {
            id: res.id,
            title: res.title,
            author: user,
            numPosts: res.posts_count,
            url: `${FORUM_API_ENDPOINT}/t/${res.slug}`,
        };
    });

    return topNTopics;
}