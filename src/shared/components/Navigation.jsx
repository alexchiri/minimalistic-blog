import React, {Component, PropTypes} from 'react';

export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.getOlderPosts = this.getOlderPosts.bind(this);
        this.getNewerPosts = this.getNewerPosts.bind(this);
    }

    getOlderPosts() {
        let newOffset = this.props.offset - this.props.pageSize;
        this.props.getPosts(newOffset);
    }

    getNewerPosts() {
        let newOffset = this.props.offset + this.props.pageSize;
        this.props.getPosts(newOffset);
    }

    render() {
        let leftNav = false;
        if (this.props.offset > 1) {
            leftNav = true;
        }

        let rightNav = false;
        if (this.props.offset < (this.props.total - this.props.pageSize + 1)) {
            rightNav = true;
        }

        return (
            <div>
                { (() => {
                    if (leftNav) {
                        return <a href="#" onClick={this.getOlderPosts}>« Older posts</a>;
                    }
                })()}
                { (() => {
                    if (leftNav && rightNav) {
                        return " | ";
                    }
                })()}
                { (() => {
                    if (rightNav) {
                        return <a href="#" onClick={this.getNewerPosts}>Newer posts »</a>;
                    }
                })()}
            </div>
        );
    }
}