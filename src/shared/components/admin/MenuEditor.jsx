import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TextField from '../../../../node_modules/material-ui/TextField';
import Paper from '../../../../node_modules/material-ui/Paper';
import FlatButton from '../../../../node_modules/material-ui/FlatButton';
import InlineCss from "react-inline-css";
import merge from 'lodash.merge';

import AppBarWithMenu from './AppBarWithMenu.jsx';
import * as adminActions from '../../actions/admin';

export class MenuEditor extends Component {
    constructor(props) {
        super(props);

        this.handleAddMenuItem = this.handleAddMenuItem.bind(this);
        this.handleSaveMenuClick = this.handleSaveMenuClick.bind(this);
    }

    componentWillMount() {
        this.props.getMenuItems();

        this.setState({menus: [{label: '', url: ''}]});
    }

    componentWillReceiveProps(nextProps) {
        let menus = this.state.menus;
        this.setState({menus: merge(menus, nextProps.menus.toJS())});
    }

    handleAddMenuItem() {
        let menus = this.state.menus;

        menus.push({label: '', url: ''});

        this.setState({menus: menus});
    }

    handleRemoveMenuItem(index, e) {
        let menus = this.state.menus;

        menus.splice(index, 1);

        this.setState({menus: menus});
    }

    handleMenuItemUrlChange(index, event) {
        let menus = this.state.menus;

        menus[index] = merge(menus[index], {url: event.target.value});

        this.setState({menus: menus});
    }

    handleMenuItemLabelChange(index, event) {
        let menus = this.state.menus;

        menus[index] = merge(menus[index], {label: event.target.value});

        this.setState({menus: menus});
    }

    handleSaveMenuClick() {
        this.props.saveMenuItems(this.state.menus);
    }

    render() {
        const menuItemsStyle = `
            & .menuItems {
                padding: 20px;
            }
        `;

        let iconElementRight = <FlatButton label="Save" onClick={this.handleSaveMenuClick}/>;

        return (

            <div>
                <AppBarWithMenu title={this.props.blogName + " - Menu editor"} iconElementRight={iconElementRight}/>

                <Paper style={{display: 'inline-block',
                            position: "absolute",
                            top: "75px",
                            bottom: "10px",
                            left: "10px",
                            right: "10px",
                            overflow: "auto",
                            padding: "10px"}}
                       zDepth={1}>
                    <InlineCss stylesheet={menuItemsStyle}>
                        <div className="menuItems">
                            <h2>Menu items</h2>

                            {this.state.menus.map((menuItem, index) =>
                                <div key={index}>
                                    <TextField
                                        hintText="Menu item label"
                                        value={menuItem.label}
                                        onChange={this.handleMenuItemLabelChange.bind(this, index)}
                                    />
                                    &nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp;
                                    <TextField
                                        hintText="Menu item URL"
                                        value={menuItem.url}
                                        onChange={this.handleMenuItemUrlChange.bind(this, index)}
                                    />
                                    <FlatButton label="Remove" primary={true} hoverColor="white"
                                                rippleColor="white" onClick={this.handleRemoveMenuItem.bind(this, index)}/>
                                </div>
                            )}

                            <FlatButton label="Add" primary={true} hoverColor="white"
                                        rippleColor="white" onClick={this.handleAddMenuItem}/>
                        </div>
                    </InlineCss>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        menus: state.admin.get('menus')
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(adminActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuEditor);