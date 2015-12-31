import React from 'react';
import {Router} from 'react-router';
import createRoutes from './shared/routes';
import rootReducer from './shared/reducers/root';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore,
    combineReducers,
    applyMiddleware }  from 'redux';

let state = null;
if (window.$REDUX_STATE) {
    state = window.$REDUX_STATE;

    //this delete doesn't do anything - figure out
    delete window.$REDUX_STATE;
}

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(apiMiddleware, thunk, logger)(createStore);
const store = createStoreWithMiddleware(rootReducer, state);

/**
 * Fire-up React Router.
 */
const reactRoot = window.document.getElementById("container");

ReactDOM.render(
    <Provider store={store}>
        { createRoutes(store, browserHistory) }
    </Provider>,
    reactRoot
);

/**
 * Detect whether the server-side render has been discarded due to an invalid checksum.
 */
if (process.env.NODE_ENV !== "production") {
    if (!reactRoot.firstChild || !reactRoot.firstChild.attributes || !reactRoot.firstChild.attributes["data-react-checksum"]) {
        console.error("Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.");
    }
}

