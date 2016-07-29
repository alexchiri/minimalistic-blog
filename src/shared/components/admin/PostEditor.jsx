import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import EnhancedTextarea from 'material-ui/TextField/EnhancedTextarea';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import merge from 'lodash.merge';
import {Map} from 'immutable';

export default class PostEditor extends Component {
    constructor(props) {
        super(props);

        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handlePublishClick = this.handlePublishClick.bind(this);
        this.handleIsPageChange = this.handleIsPageChange.bind(this);
        this.handleSlugChange = this.handleSlugChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
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
            content: post.get('content') ? post.get('content') : '',
            title: post.get('title') ? post.get('title') : '',
            link: post.get('link') ? post.get('link') : '',
            image: post.get('image') ? post.get('image') : '',
            slug: post.get('slug') ? post.get('slug') : '',
            tags: post.get('tags') ? post.get('tags') : '',
            isPage: post.get('isPage') ? post.get('isPage') : false
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

    handleIsPageChange(event, value) {
        this.setState(merge(this.state, {isPage: value}));
    }

    handleSlugChange(event) {
        this.setState(merge(this.state, {slug: event.target.value}));
    }

    handleTagsChange(event) {
        this.setState(merge(this.state, {tags: event.target.value}));
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
        if(this.state) {
            content =
                <div>
                    <AppBar
                        title={title + " - " +  (this.state.title ? this.state.title : "")}
                        iconElementLeft={<IconButton onClick={this.handleCancelClick}><NavigationClose /></IconButton>}
                        iconElementRight={<FlatButton onClick={this.handleSaveClick} label="Save" />}
                        showMenuIconButton={true}
                    />
                    <Paper style={{display: 'inline-block',
                            position: "absolute",
                            top: "75px",
                            bottom: "10px",
                            left: "10px",
                            right: "10px",
                            overflow: "auto",
                            padding: "10px"}}
                        zDepth={1}>
                        <Toggle
                            label="Is it a page?"
                            toggled={this.state.isPage}
                            onToggle={this.handleIsPageChange}
                        />
                        <TextField
                            hintText="Title" ref="title" value={this.state.title} onChange={this.handleTitleChange} style={{width: "100%"}}/><br/>
                        <TextField
                            hintText="Link" ref="link" value={this.state.link} onChange={this.handleLinkChange} style={{width: "100%"}} /><br/>
                        <TextField
                            hintText="Image url" ref="image" value={this.state.image} onChange={this.handleImageChange} style={{width: "100%"}} /><br/>
                        <TextField
                            hintText="Slug" ref="slug" value={this.state.slug} onChange={this.handleSlugChange} style={{width: "100%"}}/><br/>
                        <TextField
                            hintText="Tags" ref="tags" value={this.state.tags} onChange={this.handleTagsChange} style={{width: "100%"}}/><br/>
                        <EnhancedTextarea value={this.state.content} onChange={this.handleContentChange}/>
                    </Paper>

                    <FloatingActionButton onClick={this.handlePublishClick} style={{position:"absolute", bottom: "30px", right:"30px"}}>
                        <i className="material-icons">send</i>
                    </FloatingActionButton>
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