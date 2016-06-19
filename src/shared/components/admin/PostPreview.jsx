import React, {Component, PropTypes} from 'react';
import { postContentStyle } from '../front/PostContent.jsx';
import Paper from '../../../../node_modules/material-ui/Paper';
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
        if (this.props.post) {
            content =
                <Paper style={{display: 'inline-block',
                            position: "absolute",
                            left: "365px",
                            top: "75px",
                            right: "8px",
                            bottom: "10px",
                            paddingLeft: "30px",
                            paddingRight: "30px",
                            overflow: "auto"}}
                       zDepth={1}>
                    <InlineCss stylesheet={postContentStyle}>
                        <div className="postContent" dangerouslySetInnerHTML={this.getPostContent()}>
                        </div>
                    </InlineCss>
                </Paper>;
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}