import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import InlineCss from "react-inline-css";
import TextField from '../../../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button';

import * as blogActions from '../../actions/blog';

export class Login extends Component {
    constructor(props) {
        super(props);

        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleLoginClick() {
        let username = this.refs.username.getValue();
        let password = this.refs.password.getValue();
        let location = this.props.location.state.redirectAfterLogin;

        this.props.login(username, password, location);
    }

    componentDidUpdate() {
        if(this.props.isAuthenticated) {
            this.context.router.push({pathname: this.props.redirectAfterLogin})
        }
    }

    render() {
        let loginStyle = `

        & .flow {
            -webkit-flex-grow: 1;
            -ms-flex-positive: 1;
            flex-grow: 1;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-flex-direction: column;
            -ms-flex-direction: column;
            flex-direction: column;
            overflow-y: auto;
            min-height: 100%;
        }

        & .flow-content-wrap {
            -webkit-flex-grow: 1;
            -ms-flex-positive: 1;
            flex-grow: 1;
            -webkit-flex-shrink: 0;
            -ms-flex-negative: 0;
            flex-shrink: 0;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-justify-content: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-pack: center;
        }

        & .flow-content {
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-flex-direction: column;
            -ms-flex-direction: column;
            flex-direction: column;
            max-width: 700px;
            width: 100%;
        }

        & .login {
            position: relative;
            margin: 30px auto;
            padding: 40px;
            max-width: 265px;
        }

        `;

        return (
            <InlineCss stylesheet={loginStyle}>
                <div className="flow">
                    <div className="flow-content-wrap">
                        <div className="flow-content">
                            <div className="login">
                                <TextField
                                    ref="username"
                                    hintText="Enter your username"
                                    floatingLabelText="Username"
                                    type="text"/>
                                <TextField
                                    ref="password"
                                    hintText="Enter your password"
                                    floatingLabelText="Password"
                                    type="password"/><br/><br/>
                                <RaisedButton label="Login" disabled={this.props.isAuthenticating} onClick={this.handleLoginClick}/>
                            </div>
                        </div>
                    </div>
                </div>
            </InlineCss>
        );
    }
}

Login.propTypes = {
    isAuthenticating: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    redirectAfterLogin: PropTypes.string.isRequired
};

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        isAuthenticating: state.blog.get('isAuthenticating'),
        isAuthenticated: state.blog.get('isAuthenticated'),
        redirectAfterLogin: state.blog.get('redirectAfterLogin')
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(blogActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);