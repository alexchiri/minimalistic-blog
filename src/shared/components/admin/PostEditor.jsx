import React, {Component, PropTypes} from 'react';
import TextField from '../../../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button';
import EnhancedTextarea from '../../../../node_modules/material-ui/lib/enhanced-textarea';
import FloatingActionButton from '../../../../node_modules/material-ui/lib/floating-action-button';
import AppBar from '../../../../node_modules/material-ui/lib/app-bar';
import IconButton from '../../../../node_modules/material-ui/lib/icon-button';
import NavigationClose from '../../../../node_modules/material-ui/lib/svg-icons/navigation/close';
import FlatButton from '../../../../node_modules/material-ui/lib/flat-button';
import merge from 'lodash.merge';
import {Map} from 'immutable';

export default class PostEditor extends Component {
    constructor(props) {
        super(props);

        //this.state = {};

        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handlePublishClick = this.handlePublishClick.bind(this);
    }

    componentWillMount() {
        let path = this.props.location.pathname;

        if(path) {
            if(path.endsWith('edit')) {
                let slug = this.props.params.slug;

                if(this.props.post && this.props.post.get('slug') === slug) {
                    this.setState(this.extractStateFromProps(this.props.post))
                } else {
                    this.props.getAdminPost(slug);
                }
            } else if(path.endsWith('add')) {
                this.setState(this.extractStateFromProps(Map()))
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if((!this.props.post || this.props.post.size == 0) && nextProps.post) {
            this.setState(this.extractStateFromProps(nextProps.post))
        }
    }

    extractStateFromProps(post) {
        return {
            content: post.get('content'),
            title: post.get('title'),
            link: post.get('link'),
            image: post.get('image'),
            slug: post.get('slug')
        }
    }

    handleContentChange(event) {
        this.setState(merge(this.state, {content: event.target.value}));
    }

    handleTitleChange(event) {
        this.setState(merge(this.state, {title: event.target.value}));
    }

    handleLinkChange(event) {
        this.setState(merge(this.state, {link: event.target.value}));
    }

    handleImageChange(event) {
        this.setState(merge(this.state, {image: event.target.value}));
    }

    handleSaveClick() {
        let path = this.props.location.pathname;

        if(path) {
            if(path.endsWith('edit')) {
                this.props.updateAdminPost(this.state);
                this.context.router.push({pathname: '/admin', state: {refresh: 'post'}});
            } else if(path.endsWith('add')) {
                this.props.addAdminPost(merge(this.state, { draft: true }));
                this.context.router.push({pathname: '/admin', state: {refresh: 'all'}});
            }
        }
    }

    // same as save, but sets draft to false
    handlePublishClick() {
        let path = this.props.location.pathname;

        if(path) {
            if(path.endsWith('edit')) {
                this.props.updateAdminPost(merge(this.state, { draft: false }));
                this.context.router.push({pathname: '/admin', state: {refresh: 'post'}});
            } else if(path.endsWith('add')) {
                this.props.addAdminPost(merge(this.state, { draft: false }));
                this.context.router.push({pathname: '/admin', state: {refresh: 'all'}});
            }
        }
    }

    handleCancelClick() {
        this.context.router.push('/admin');
    }

    render() {
        let content = <div>Loading...</div>;
        let title = this.props.location.pathname && this.props.location.pathname.endsWith("edit") ? "Edit" : "Add";
        if(this.props.post && this.props.post.size > 0) {
            content =
                <div>
                    <AppBar
                        title={title + " - " +  (this.state.title ? this.state.title : "")}
                        iconElementLeft={<IconButton onClick={this.handleCancelClick}><NavigationClose /></IconButton>}
                        iconElementRight={<FlatButton onClick={this.handleSaveClick} label="Save" />}
                        showMenuIconButton={true}
                    />
                    <TextField
                        hintText="Title" ref="title" value={this.state.title} onChange={this.handleTitleChange}/><br/>
                    <TextField
                        hintText="Link" ref="link" value={this.state.link} onChange={this.handleLinkChange} /><br/>
                    <TextField
                        hintText="Image url" ref="image" value={this.state.image} onChange={this.handleImageChange} /><br/>
                    <EnhancedTextarea value={this.state.content} onChange={this.handleContentChange}/>
                    <FloatingActionButton onClick={this.handlePublishClick}><i className="material-icons">send</i></FloatingActionButton>
                </div>
        }

        return(
            <div>
                {content}
            </div>
        );
    }
}

PostEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};