import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as postsActions from '../actions/posts';
import HomePost from './PostContent.jsx';

export class PostPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.requestIfNeeded(this.props);
    }

    componentWillUpdate(newProps) {
        this.requestIfNeeded(newProps);
    }

    requestIfNeeded(props) {
        const {
            posts,
            params: {slug},
            getPost,
            isLoading,
            } = props;

        if (!slug) {
            // redirect to 404
        } else {
            const havePosts = posts && posts.size != 0;
            const havePost = (posts.find(post => post.get('slug') == slug) !== undefined);

            if (!isLoading && !havePosts && !havePost) {
                return getPost(slug);
            }
        }
    }

    render() {
        const {
            isLoading,
            posts,
            params: {slug}
            } = this.props;

        let content;

        if(posts.size == 0 || isLoading) {
            content = <div>Loading...</div>;
        } else {
            content = <HomePost post={posts.find(post => post.get('slug') == slug)}/>
        }

        return (
            content
        );
    }
}

function mapStateToProps(state) {
    return {
        posts: state.posts.get('posts'),
        isLoading: state.posts.get('isLoading')
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(postsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);

