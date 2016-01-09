import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as postsActions from '../actions/posts';
import PostContent from './PostContent.jsx';
import Pagination from './Pagination.jsx';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.props.getPosts(this.props.offset);
    }

    render() {
        return(
            <div>
                <h1>{this.props.blogName}</h1>
                {this.props.posts.map((post, index) =>
                    <div key={index}>
                        <PostContent post={post} {...this.props} />
                    </div>
                )}

                <Pagination {...this.props} />
            </div>
        );
    }
}

Home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        pageSize: state.blog.get('pageSize'),
        posts: state.posts.get('posts'),
        offset: state.posts.get('offset'),
        total: state.posts.get('total'),
        author: state.blog.get('author')
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(postsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);