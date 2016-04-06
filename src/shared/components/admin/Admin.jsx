import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import * as adminActions from '../../actions/admin';

export class Admin extends Component {
    constructor(props) {
        super(props);

        this.props.getAdminPosts();
    }

    componentWillReceiveProps(nextProps) {
        let refresh = nextProps.location && nextProps.location.state && nextProps.location.state.refresh ? nextProps.location.state.refresh : "no";

        // TODO: reevaluate these ifs to make sure they make sense
        if(refresh === 'all') {
            nextProps.location.state.refresh = 'post';
            this.props.getAdminPosts();
        } else {
            if(refresh == 'post') {
                nextProps.location.state = null;
            } else if(this.props.posts.size == 0 && nextProps.posts.size > 0) {
                let post = nextProps.posts.get(0);
                this.props.getAdminPost(post.get('slug'));
            }
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
                    updateAdminPost: this.props.updateAdminPost,
                    addAdminPost: this.props.addAdminPost
                })}
            </div>
        );
    }
}

Admin.propTypes = {
    blogName: PropTypes.string.isRequired,
    posts: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        blogName: state.blog.get('name'),
        posts: state.admin.get('posts'),
        post: state.admin.get('post')
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(adminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);