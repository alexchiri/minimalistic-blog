import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

export default class HomePost extends Component {
    constructor(props) {
        super(props);
    }

    getPostContent() {
        return {__html: this.props.post.get('renderedContent')};
    }

    render() {
        const {post} = this.props;
        let postContentStyle = {
            textAlign: "justify"
        };

        return (
            <div>
                <h2><Link to={`/post/${post.get('slug')}`}>{this.props.post.get('title')}</Link></h2>
                <div style={postContentStyle} dangerouslySetInnerHTML={this.getPostContent()}>
                </div>
            </div>
        )
    }
}