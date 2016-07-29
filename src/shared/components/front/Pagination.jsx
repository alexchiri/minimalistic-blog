import React, {Component, PropTypes} from 'react';
import InlineCss from "react-inline-css";

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.getOlderPosts = this.getOlderPosts.bind(this);
        this.getNewerPosts = this.getNewerPosts.bind(this);
    }

    getOlderPosts() {
        let newOffset = this.props.offset - this.props.pageSize;
        this.props.getPosts(newOffset, this.props.params.tag);
    }

    getNewerPosts() {
        let newOffset = this.props.offset + this.props.pageSize;
        this.props.getPosts(newOffset, this.props.params.tag);
    }

    render() {
        let leftNav = false;
        if (this.props.offset < (this.props.total - this.props.pageSize + 1)) {
            leftNav = true;
        }

        let rightNav = false;
        if (this.props.offset > 1) {
            rightNav = true;
        }

        let paginationStyle = `
            & .pagination {
                font-size: 1.3em;
                font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
            }

            & .pagination a {
                text-decoration: none;
            }
        `;

        return (
            <InlineCss stylesheet={paginationStyle}>
                <div className="pagination">
                    { (() => {
                        if (leftNav) {
                            return <a href="#" onClick={this.getNewerPosts}>« Older posts</a>;
                        }
                    })()}
                    { (() => {
                        if (leftNav && rightNav) {
                            return "|";
                        }
                    })()}
                    { (() => {
                        if (rightNav) {
                            return <a href="#" onClick={this.getOlderPosts}>Newer posts »</a>;
                        }
                    })()}
                </div>
            </InlineCss>
        );
    }
}