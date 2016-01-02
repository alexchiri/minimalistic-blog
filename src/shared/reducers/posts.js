import {GET_POSTS_REQUEST, GET_POSTS_SUCCESS, GET_POSTS_FAILURE} from '../actions/posts';

const initialState = [];

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_POSTS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}