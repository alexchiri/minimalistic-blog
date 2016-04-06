import {
    ADMIN_GET_POSTS_REQUEST, ADMIN_GET_POSTS_SUCCESS, ADMIN_GET_POSTS_FAILURE,
    ADMIN_GET_POST_CONTENT_REQUEST, ADMIN_GET_POST_CONTENT_SUCCESS, ADMIN_GET_POST_CONTENT_FAILURE,
    ADMIN_UPDATE_POST_CONTENT_REQUEST, ADMIN_UPDATE_POST_CONTENT_SUCCESS, ADMIN_UPDATE_POST_CONTENT_FAILURE,
    ADMIN_GET_MENU_ITEMS_REQUEST, ADMIN_GET_MENU_ITEMS_SUCCESS, ADMIN_GET_MENU_ITEMS_FAILURE,
    ADMIN_SAVE_MENU_ITEMS_REQUEST, ADMIN_SAVE_MENU_ITEMS_SUCCESS, ADMIN_SAVE_MENU_ITEMS_FAILURE
} from '../actions/admin';
import {Map, List, fromJS} from 'immutable';

const initialState = Map({ posts: List(), post: Map({}), menus: List(), total: 0, requestResult: { bla: 0 }});

export default function reducer(state = initialState, action = {}) {
    let newState;
    switch (action.type) {
        case ADMIN_GET_POSTS_SUCCESS:
            return state.mergeDeep(fromJS(action.payload));
        case ADMIN_GET_POST_CONTENT_REQUEST:
            return state.mergeDeep(Map({ post: Map({})}));
        case ADMIN_GET_POST_CONTENT_SUCCESS:
            return state.mergeDeep(fromJS(action.payload));
        case ADMIN_UPDATE_POST_CONTENT_REQUEST:
            newState = state.mergeDeep(Map({
                didFail: false,
                post: Map(action.meta.post)
                // TODO: update title in the posts collection for the current post
                // posts: List.of(Map({slug: action.meta.post.slug, title: action.meta.post.title}))
            }));
            return newState;
        case ADMIN_GET_MENU_ITEMS_SUCCESS:
            return state.merge(fromJS(action.payload));
        default:
            return state;
    }
}