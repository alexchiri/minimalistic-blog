import React, {Component, PropTypes} from 'react';
import moment from 'moment';

export default class PostContent extends Component {
    getFormattedDate() {
        return moment(this.props.post.get('date_published')).format("Do MMM YYYY, HH:mm");
    }

    getPostContent() {
        return {__html: this.props.post.get('renderedContent')};
    }

    render() {
        let postContentStyle = {
            textAlign: "justify"
        };

        return(
            <div>
                <h1>{ this.props.post.get('title') }</h1>
                Alexandru Chirițescu | { this.getFormattedDate() }

                <div style={postContentStyle} dangerouslySetInnerHTML={this.getPostContent()}>
                </div>
            </div>
        );
    }
}