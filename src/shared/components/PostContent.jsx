import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import InlineCss from "react-inline-css";
import moment from 'moment';

export default class HomePost extends Component {
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

            & .postContent p, & .postContent ul {
                text-align: justify;
                margin-bottom: 1.7em;
                font-size: 1.4em;
                line-height: 1.5em;
                color: #333;
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
                    <h2 className="postTitle"><Link to={`/post/${post.get('slug')}`}>{this.props.post.get('title')}</Link></h2>
                    <div className="postSubtitle">Alexandru Chirițescu | { this.getFormattedDate() }</div>
                    <div className="postContent" dangerouslySetInnerHTML={this.getPostContent()}>
                    </div>
                </div>
            </InlineCss>
        )
    }
}