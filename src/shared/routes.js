import React from 'react';
import {Router, IndexRoute, Route} from 'react-router';

import App from '../shared/components/App.jsx';
import HomeContainer from '../shared/components/front/Home.jsx';
import PostPage from '../shared/components/front/PostPage.jsx';
import AdminContainer from '../shared/components/admin/Admin.jsx';
import Login from '../shared/components/auth/Login.jsx';
import PostEditor from '../shared/components/admin/PostEditor.jsx';
import PostList from '../shared/components/admin/PostList.jsx';
import requireAuthentication from '../shared/components/auth/AuthenticatedComponent.jsx';

export default (store, history) => {
    return (
        <Router history={history}>
            <Route path="/" component={App}>
                { /* Home (main) route */ }
                <IndexRoute component={HomeContainer}/>
                <Route path="post/:slug" component={PostPage}/>
                { /* <Route path="*" component={NotFound} status={404} /> */ }
            </Route>

            <Route path="/admin" component={requireAuthentication(AdminContainer)}>
                <IndexRoute component={PostList}/>
                <Route path=":slug/edit" component={PostEditor}/>
            </Route>
            <Route path="/login" component={Login}/>
        </Router>
    );
};