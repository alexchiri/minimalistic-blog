import React from 'react';
import {Router, IndexRoute, Route} from 'react-router';

import App from '../shared/components/App.jsx';
import HomeContainer from '../shared/components/Home.jsx';
import PostPage from '../shared/components/PostPage.jsx';
import AdminContainer from '../shared/components/Admin.jsx';
import Login from '../shared/components/Login.jsx';
import requireAuthentication from './components/AuthenticatedComponent.jsx';

export default (store, history) => {
    return (
        <Router history={history}>
            <Route path="/" component={App}>
                { /* Home (main) route */ }
                <IndexRoute component={HomeContainer}/>
                <Route path="post/:slug" component={PostPage}/>
                { /* <Route path="*" component={NotFound} status={404} /> */ }
            </Route>

            <Route path="/admin" component={requireAuthentication(AdminContainer)}/>
            <Route path="/login" component={Login}/>
        </Router>
    );
};