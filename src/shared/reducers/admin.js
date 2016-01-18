import {ADMIN_GET_POSTS_REQUEST, ADMIN_GET_POSTS_SUCCESS, ADMIN_GET_POSTS_FAILURE,
         ADMIN_GET_POST_CONTENT_REQUEST, ADMIN_GET_POST_CONTENT_SUCCESS, ADMIN_GET_POST_CONTENT_FAILURE} from '../actions/admin';
import {Map, List, fromJS} from 'immutable';

const initialState = Map({ posts: List(), post: Map({}), total: 0, isLoadingList: false, isLoadingPost: false, didFail: false });

export default function reducer(state = initialState, action = {}) {
    let newState;
    switch (action.type) {
        case ADMIN_GET_POSTS_REQUEST:
            newState = state.mergeDeep(Map({ isLoadingList: true, isLoadingPost: true, didFail: false }));
            return newState;
        case ADMIN_GET_POSTS_SUCCESS:
            newState = state.mergeDeep(fromJS(action.payload).merge(Map({ isLoadingList: false, didFail: false })));
            return newState;
        case ADMIN_GET_POSTS_FAILURE:
            return state.mergeDeep(Map({ isLoadingList: false, didFail: false }));
        case ADMIN_GET_POST_CONTENT_REQUEST:
            newState = state.mergeDeep(Map({ isLoadingPost: true, didFail: false, post: Map({})}));
            return newState;
        case ADMIN_GET_POST_CONTENT_SUCCESS:
            newState = state.mergeDeep(fromJS(action.payload).merge(Map({ isLoadingPost: false, didFail: false })));
            return newState;
        case ADMIN_GET_POST_CONTENT_FAILURE:
            return state.mergeDeep(Map({ isLoadingPost: false, didFail: false }));
        default:
            return state;
    }
}