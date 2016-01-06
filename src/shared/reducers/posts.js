import {GET_POSTS_REQUEST, GET_POSTS_SUCCESS, GET_POSTS_FAILURE,
         GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAILURE} from '../actions/posts';
import {Map, List, fromJS} from 'immutable';

const initialState = Map({ posts: List(), offset: 1, size: 0, total: 0, isLoading: false, didFail: false });

export default function reducer(state = initialState, action = {}) {
    let newState;
    switch (action.type) {
        case GET_POSTS_REQUEST:
            newState = state.mergeDeep(Map({ isLoading: true, didFail: false }));
            return newState;
        case GET_POSTS_SUCCESS:
            newState = state.mergeDeep(fromJS(action.payload).merge(Map({ isLoading: false, didFail: false })));
            return newState;
        case GET_POSTS_FAILURE:
            return state.merge(Map({ isLoading: false, didFail: true }));
        case GET_POST_REQUEST:
            newState = state.mergeDeep(Map({ isLoading: true, didFail: false }));
            return newState;
        case GET_POST_SUCCESS:
            newState = state.mergeDeep(Map({posts: List.of(fromJS(action.payload)), isLoading: false, didFail: false }));
            return newState;
        default:
            return state;
    }
}