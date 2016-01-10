import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import InlineCss from "react-inline-css";
import moment from 'moment';

export default class PostContent extends Component {
    constructor(props) {
        super(props);
    }

    getFormattedDate() {
        return moment(this.props.post.get('date_published')).format("Do MMM YYYY, HH:mm");
    }

    getPostContent() {
        return {__html: this.props.post.get('renderedContent')};
    }

    render() {
        const {post} = this.props;
        let postContentStyle = `
            & {
                margin-top: 50px;
            }

            & .postContent p, & .postContent ul, & .postContent ol {
                text-align: justify;
                margin-bottom: 1.7em;
                font-size: 1.4em;
                line-height: 1.5em;
                color: #333;
            }

            & .postContent code {
                box-shadow: none;
                border: none;
                background-color: #f8f8f8;
                margin: 0;
                font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
                color: #333333;
            }

            & .postContent pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                text-align: left;
                background-color: #f8f8f8;
            }

            & .postTitle {
                margin-bottom: 5px;
                font-size: 2.3em;
                font-weight: normal;
                text-align: left;
            }

            & .postTitle a:link, & .postTitle a:visited {
                color: #000;
                text-decoration: none;
            }

            & .postTitle a:hover, & .postTitle a:active {
                color: #000;
                text-decoration: underline;
            }

            & .postSubtitle {
                text-align: left;
                margin-bottom: 30px;
            }

            & img {
                max-width: 100%
            }
        `;

        return (
            <InlineCss stylesheet={postContentStyle}>
                <div className="post">
                    <h2 className="postTitle"><Link
                        to={`/post/${post.get('slug')}`}>{this.props.post.get('title')}</Link></h2>
                    <div
                        className="postSubtitle">{post.get('author').get('first_name') + " " + post.get('author').get('last_name')}
                        | { this.getFormattedDate() }</div>
                    <div className="postContent" dangerouslySetInnerHTML={this.getPostContent()}>
                    </div>
                </div>
            </InlineCss>
        )
    }
}