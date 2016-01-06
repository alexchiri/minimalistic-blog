import {Map} from 'immutable';

const initialState = Map({ pageSize: 0 });

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        default:
            return state;
    }
}