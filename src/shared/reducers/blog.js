import {Map, List} from 'immutable';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/blog';

const initialState = Map({pageSize: 0, isAuthenticated: false, isAuthenticating: false, redirectAfterLogin: "/", menus: List()});


export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return state.set('isAuthenticating', true);
        case LOGIN_SUCCESS:
            return state.set('isAuthenticating', false)
                .set('isAuthenticated', true)
                .set('redirectAfterLogin', action.payload.redirectAfterLogin)
                .set('username', action.payload.username);
        case LOGIN_FAILURE:
            return state.set('isAuthenticating', false).set('isAuthenticated', false);
        default:
            return state;
    }
}