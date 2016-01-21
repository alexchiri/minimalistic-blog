import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import InlineCss from "react-inline-css";
import moment from 'moment';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as adminActions from '../../actions/admin';

export class Admin extends Component {
    constructor(props) {
        super(props);

        this.props.getAdminPosts();
    }

    componentWillReceiveProps(nextProps) {
        let shouldRefresh = nextProps.location && nextProps.location.state && nextProps.location.state.refresh == true;

        if((this.props.posts.size == 0 || shouldRefresh) && nextProps.posts.size > 0) {
            nextProps.location.state = null;
            let post = nextProps.posts.get(0);
            this.props.getAdminPost(post.get('slug'));
        }
    }

    render() {
        return(
            <div>
                {this.props.children && React.cloneElement(this.props.children, {
                    posts: this.props.posts,
                    post: this.props.post,
                    blogName: this.props.blogName,
                    getAdminPost: this.props.getAdminPost,
                    updateAdminPost: this.props.updateAdminPost
                })}
            </div>
        );
    }
}

Admin.propTypes = {
    blogName: PropTypes.string.isRequired,
    posts: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    isLoadingList: PropTypes.bool.isRequired,
    isLoadingPost: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        blogName: state.blog.get('name'),
        posts: state.admin.get('posts'),
        post: state.admin.get('post'),
        isLoadingList: state.admin.get('isLoadingList'),
        isLoadingPost: state.admin.get('isLoadingPost')
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(adminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);