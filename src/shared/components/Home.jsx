import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as postsActions from '../actions/posts';
import HomePost from './PostContent.jsx';
import Navigation from './Navigation.jsx';

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
                        <HomePost post={post} {...this.props} />
                    </div>
                )}

                <Navigation {...this.props} />
            </div>
        );
    }
}

Home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired,
    pageSize: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
};

function mapStateToProps(state) {
    return {
        pageSize: state.blog.get('pageSize'),
        posts: state.posts.get('posts'),
        offset: state.posts.get('offset'),
        total: state.posts.get('total')
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(postsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);