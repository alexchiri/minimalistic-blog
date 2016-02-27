import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import AppBarWithMenu from './AppBarWithMenu.jsx';

export default class MenuEditor extends Component {
    render() {
        return (
            <div>
                <AppBarWithMenu title="Menu editor"/>
            </div>
        );
    }
}