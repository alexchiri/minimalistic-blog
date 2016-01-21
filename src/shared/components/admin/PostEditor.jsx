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
        let slug = this.props.params.slug;

        if(this.props.post && this.props.post.get('slug') === slug) {
            this.setState(this.extractStateFromProps(this.props))
        } else {
            this.props.getAdminPost(slug);
        }
    }

    componentWillReceiveProps(nextProps) {
        if((!this.props.post || this.props.post.size == 0) && nextProps.post) {
            this.setState(this.extractStateFromProps(nextProps))
        }
    }

    extractStateFromProps(props) {
        return {
            content: props.post.get('content'),
            title: props.post.get('title'),
            link: props.post.get('link'),
            image: props.post.get('image')
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
        if(this.props.post && this.props.post.size > 0) {
            this.props.updateAdminPost(this.props.post.get('slug'), this.state);
            this.context.router.push({pathname: '/admin', state: {refresh: true}});
        }
    }

    // same as save, but sets draft to false
    handlePublishClick() {
        if(this.props.post && this.props.post.size > 0) {
            this.props.updateAdminPost(this.props.post.get('slug'), merge(this.state, { draft: false }));
            this.context.router.push({pathname: '/admin', state: {refresh: true}});
        }
    }

    handleCancelClick() {
        this.context.router.push('/admin');
    }

    render() {
        let content = <div>Loading...</div>;
        if(this.props.post && this.props.post.size > 0) {
            content =
                <div>
                    <AppBar
                        title={"Edit - " +  (this.state.title ? this.state.title : "Loading...")}
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