import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

export class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <h1>{this.props.blogName}</h1>
                Posts:
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        blogName: state.blog.name
    }
}

export default connect(mapStateToProps)(Home);