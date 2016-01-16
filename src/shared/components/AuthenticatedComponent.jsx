import React from 'react';
import {connect} from 'react-redux';

export default function requireAuthentication(Component) {
    class AuthenticatedComponent extends React.Component {

        componentWillMount () {
            this.checkAuth();
        }

        componentWillReceiveProps (nextProps) {
            this.checkAuth();
        }

        checkAuth () {
            console.log("isAuthenticated: ", this.props.isAuthenticated);
            if (!this.props.isAuthenticated) {
                let redirectAfterLogin = this.props.location.pathname;
                this.context.router.replace({pathname: '/login', state: {redirectAfterLogin: redirectAfterLogin}});
            }
        }

        render () {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    const mapStateToProps = (state) => ({
        isAuthenticated: state.blog.get('isAuthenticated')
    });

    AuthenticatedComponent.contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    return connect(mapStateToProps)(AuthenticatedComponent);
}