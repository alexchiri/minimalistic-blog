import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as postsActions from '../actions/posts';
import HomePost from './HomePost.jsx';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.props.getPosts();
    }

    render() {
        return(
            <div>
                <h1>{this.props.blogName}</h1>
                Posts:
                {this.props.posts.map((post, index) =>
                    <div key={index}>
                        <HomePost post={post} {...this.props} />
                    </div>
                )}
            </div>
        );
    }
}

Home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        blogName: state.blog.name,
        posts: state.posts
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(postsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);