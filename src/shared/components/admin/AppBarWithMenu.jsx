import React, {Component, PropTypes} from 'react';
import AppBar from '../../../../node_modules/material-ui/AppBar';
import Drawer from '../../../../node_modules/material-ui/Drawer';
import MenuItem from '../../../../node_modules/material-ui/MenuItem';

export default class AppBarWithMenu extends Component {
    constructor(props) {
        super(props);

        this.handleMenuToggle = this.handleMenuToggle.bind(this);
        this.handlePostsClick = this.handlePostsClick.bind(this);
        this.handleMenuEditorClick = this.handleMenuEditorClick.bind(this);
    }

    componentWillMount() {
        this.setState({menuOpen: false});
    }

    handleMenuToggle() {
        this.setState({menuOpen: !this.state.menuOpen});
    }

    handlePostsClick() {
        this.handleMenuToggle();

        this.context.router.push('/admin');
    }

    handleMenuEditorClick() {
        this.handleMenuToggle();

        this.context.router.push('/admin/menu');
    }

    render() {
        return (
            <div>
                <AppBar
                    title={this.props.title}
                    onLeftIconButtonTouchTap={this.handleMenuToggle}
                    iconElementRight={ this.props.iconElementRight ? this.props.iconElementRight : null }
                />

                <Drawer open={this.state.menuOpen}
                         onRequestChange={this.handleMenuToggle}
                         docked={false}>
                    <MenuItem onTouchTap={this.handlePostsClick}>Posts</MenuItem>
                    <MenuItem onTouchTap={this.handleMenuEditorClick}>Menu editor</MenuItem>
                </Drawer>
            </div>
        );
    }
}

AppBarWithMenu.contextTypes = {
    router: React.PropTypes.object.isRequired
};