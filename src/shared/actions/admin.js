import { CALL_API } from 'redux-api-middleware';

export const ADMIN_GET_POSTS_REQUEST = "ADMIN_GET_POSTS_REQUEST";
export const ADMIN_GET_POSTS_SUCCESS = "ADMIN_GET_POSTS_SUCCESS";
export const ADMIN_GET_POSTS_FAILURE = "ADMIN_GET_POSTS_FAILURE";

export const ADMIN_GET_POST_CONTENT_REQUEST = "ADMIN_GET_POST_CONTENT_REQUEST";
export const ADMIN_GET_POST_CONTENT_SUCCESS = "ADMIN_GET_POST_CONTENT_SUCCESS";
export const ADMIN_GET_POST_CONTENT_FAILURE = "ADMIN_GET_POST_CONTENT_FAILURE";

export const ADMIN_UPDATE_POST_CONTENT_REQUEST = "ADMIN_UPDATE_POST_CONTENT_REQUEST";
export const ADMIN_UPDATE_POST_CONTENT_SUCCESS = "ADMIN_UPDATE_POST_CONTENT_SUCCESS";
export const ADMIN_UPDATE_POST_CONTENT_FAILURE = "ADMIN_UPDATE_POST_CONTENT_FAILURE";

export const ADMIN_ADD_POST_REQUEST = "ADMIN_ADD_POST_REQUEST";
export const ADMIN_ADD_POST_SUCCESS = "ADMIN_ADD_POST_SUCCESS";
export const ADMIN_ADD_POST_FAILURE = "ADMIN_ADD_POST_FAILURE";

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

export function getAdminPost(slug) {
    return {
        [CALL_API]: {
            endpoint: `/api/admin/posts/${slug}`,
            method: 'GET',
            types: [ADMIN_GET_POST_CONTENT_REQUEST, ADMIN_GET_POST_CONTENT_SUCCESS, ADMIN_GET_POST_CONTENT_FAILURE],
            credentials: 'include'
        }
    }
}

export function updateAdminPost(postInfo) {
    return {
        [CALL_API]: {
            endpoint: `/api/admin/posts/${postInfo.slug}`,
            method: 'PUT',
            body: JSON.stringify(postInfo),
            types: [{
                type: ADMIN_UPDATE_POST_CONTENT_REQUEST,
                meta: { post: postInfo }
            }, ADMIN_UPDATE_POST_CONTENT_SUCCESS, ADMIN_UPDATE_POST_CONTENT_FAILURE],
            credentials: 'include'
        }
    }
}

export function addAdminPost(postInfo) {
    return {
        [CALL_API]: {
            endpoint: '/api/admin/posts',
            method: 'POST',
            body: JSON.stringify(postInfo),
            types: [ADMIN_ADD_POST_REQUEST, ADMIN_ADD_POST_SUCCESS, ADMIN_ADD_POST_FAILURE],
            credentials: 'include'
        }
    }
}