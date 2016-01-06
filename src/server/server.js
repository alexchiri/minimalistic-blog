import fs from 'fs';
import path from 'path';
import koa from "koa";
import koaRouter from 'koa-router';
import proxy from "koa-proxy";
import serve from "koa-static";
import React from "react";
import ReactDOM from 'react-dom/server';
import {Router, RouterContext, match, Route} from "react-router";
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {createMemoryHistory} from 'history'
import { createStore,
    combineReducers,
    applyMiddleware }  from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import koaLogger from 'koa-logger';
import {Map} from 'immutable';

import createRoutes from '../shared/routes';
import rootReducer from '../shared/reducers/root';
import posts from './api/posts';

const app       = koa();
const appRouter = koaRouter();
const hostname  = process.env.HOSTNAME || "localhost";
const port      = process.env.PORT || 8000;

app.use(serve("static", {defer: true}));

if(process.env.NODE_ENV !== "production") {
    app.use(koaLogger());
}

app.use(appRouter.routes());

app.use(posts);

app.use(function *(next) {
    let history = createMemoryHistory();
    const location = history.createLocation(this.path);
    let routes = createRoutes(history);

    yield ((callback) => {
        match({routes, location}, (error, redirectLocation, renderProps) => {
            if (redirectLocation) {
                this.redirect(redirectLocation.pathname + redirectLocation.search, "/");
                return;
            }

            if (error || !renderProps) {
                callback(error);
                return;
            }

            const index = fs.readFileSync(path.resolve(__dirname, '../index.html'), {encoding: 'utf-8'} );
            const initialState = { blog: Map({name: process.env.BLOG_TITLE, pageSize: parseInt(process.env.POSTS_PAGE_SIZE)})};

            const store = applyMiddleware(thunk, apiMiddleware)(createStore)(rootReducer, initialState);
            const webserver = process.env.NODE_ENV === "production" ? "" : "//" + hostname + ":8080";

            var markup = ReactDOM.renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps}/>
                </Provider>
            );
            let state = JSON.stringify( store.getState() );

            this.body = index
                .replace( '${markup}', markup )
                .replace( '${state}', state )
                .replace( '${webserver}', webserver)
                .replace( '${BLOG_TITLE}', process.env.BLOG_TITLE);

            callback(null);
        });
    });
});

app.listen(port, () => {
    console.info("==> ✅  Server is listening");
    console.info("==> 🌎  Go to http://%s:%s", hostname, port);
});
