import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import InlineCss from "react-inline-css";

export class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let blogWrapperStyle = `
            & {
                margin: 0 auto;
                padding-top: 15px;
                width: 500px;
                text-align: center;
                position: relative;
                background: #fff;
                font: 70% Georgia, "Times New Roman", Times, serif;
                color: #333;
            }

            & .titleHeader {
                margin: 10px 0 20px;
                font-size: 3.3em;
                font-weight: normal;
                letter-spacing: .05em;
                word-spacing: .2em;
            }

            & .titleHeader a:link, & .titleHeader a:visited {
                color: #000;
                text-decoration: none;
            }

            & .titleHeader a:hover, & .titleHeader a:active {
                color: #000;
                text-decoration: underline;
            }
        `;

        return (
            <InlineCss stylesheet={blogWrapperStyle}>
                <div className="blogWrapper">
                    <h1 className="titleHeader">
                        <a href="/">{this.props.blogName}</a>
                    </h1>
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </InlineCss>
        );
    }
}

App.propTypes = {
    blogName: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        blogName: state.blog.get('name')
    }
}

export default connect(mapStateToProps)(App);