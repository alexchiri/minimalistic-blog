import { CALL_API } from 'redux-api-middleware';

export const ADMIN_GET_POSTS_REQUEST = "ADMIN_GET_POSTS_REQUEST";
export const ADMIN_GET_POSTS_SUCCESS = "ADMIN_GET_POSTS_SUCCESS";
export const ADMIN_GET_POSTS_FAILURE = "ADMIN_GET_POSTS_FAILURE";

export const ADMIN_GET_POST_CONTENT_REQUEST = "ADMIN_GET_POST_CONTENT_REQUEST";
export const ADMIN_GET_POST_CONTENT_SUCCESS = "ADMIN_GET_POST_CONTENT_SUCCESS";
export const ADMIN_GET_POST_CONTENT_FAILURE = "ADMIN_GET_POST_CONTENT_FAILURE";


export function getAdminPosts() {
    return {
        [CALL_API]: {
            endpoint: '/api/admin/posts',
            method: 'GET',
            types: [ADMIN_GET_POSTS_REQUEST, ADMIN_GET_POSTS_SUCCESS, ADMIN_GET_POSTS_FAILURE],
            credentials: 'include'
        }
    }
}

export function getAdminPostContent(slug) {
    return {
        [CALL_API]: {
            endpoint: `/api/admin/posts/${slug}`,
            method: 'GET',
            types: [ADMIN_GET_POST_CONTENT_REQUEST, ADMIN_GET_POST_CONTENT_SUCCESS, ADMIN_GET_POST_CONTENT_FAILURE],
            credentials: 'include'
        }
    }
}