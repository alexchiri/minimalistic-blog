import { CALL_API } from 'redux-api-middleware';

export const GET_POSTS_REQUEST = "GET_POSTS_REQUEST";
export const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS";
export const GET_POSTS_FAILURE = "GET_POSTS_FAILURE";

export const GET_POST_REQUEST = "GET_POST_REQUEST";
export const GET_POST_SUCCESS = "GET_POST_SUCCESS";
export const GET_POST_FAILURE = "GET_POST_FAILURE";

export function getPosts(offset) {
    return {
        [CALL_API]: {
            endpoint: '/api/posts?offset=' + offset,
            method: 'GET',
            types: [GET_POSTS_REQUEST, GET_POSTS_SUCCESS, GET_POSTS_FAILURE]
        }
    }
}

export function getPost(slug) {
    return {
        [CALL_API]: {
            endpoint: '/api/posts/' + slug,
            method: 'GET',
            types: [GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAILURE]
        }
    }
}


