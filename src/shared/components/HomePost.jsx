import React, {Component, PropTypes} from 'react';

export default class HomePost extends Component {
    constructor(props) {
        super(props);
    }

    getPostContent() {
        return {__html: this.props.post.renderedContent};
    }

    render() {
        return (
            <div>
                <h4>{this.props.post.title}</h4>
                <div dangerouslySetInnerHTML={this.getPostContent()}>
                </div>
            </div>
        )
    }
}