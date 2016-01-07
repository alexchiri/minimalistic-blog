import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';

export class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let contentStyle = {
            margin: "0 auto",
            paddingTop: "15px",
            width: "500px",
            textAlign: "center",
            position: "relative"
        };

        return(
            <div style={contentStyle}>
                <h1>
                    <a href="/">{this.props.blogName}</a>
                </h1>
                <div>
                    {this.props.children}
                </div>
            </div>
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