import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import InlineCss from "react-inline-css";
import moment from 'moment';
import AppBar from '../../../../node_modules/material-ui/lib/app-bar';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as adminActions from '../../actions/admin';

export class Admin extends Component {
    constructor(props) {
        super(props);

        this.props.getAdminPosts();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.posts.size == 0 && nextProps.posts.size > 0) {
            let post = nextProps.posts.get(0);
            this.props.getAdminPostContent(post.get('slug'));
        }
    }

    render() {
        return(
            <div>
                <AppBar
                    title={this.props.blogName + " - Admin area"}
                    showMenuIconButton={false}
                />

                {this.props.children && React.cloneElement(this.props.children, {
                    posts: this.props.posts, post: this.props.post, getAdminPostContent: this.props.getAdminPostContent
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