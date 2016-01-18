import React, {Component, PropTypes} from 'react';
import { postContentStyle } from '../front/PostContent.jsx';
import InlineCss from "react-inline-css";

export default class PostPreview extends Component {
    constructor(props) {
        super(props);
    }

    getPostContent() {
        return {__html: this.props.post.get('renderedContent')};
    }

    render() {
        let content = <div>Loading...</div>;
        if(this.props.post) {
            content =
                <InlineCss stylesheet={postContentStyle}>
                    <div className="postContent" dangerouslySetInnerHTML={this.getPostContent()}>
                    </div>
                </InlineCss>;
        }

        return(
            <div>
                {content}
            </div>
        );
    }
}