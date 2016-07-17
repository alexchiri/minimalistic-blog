import React, {Component, PropTypes} from 'react';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import MakeSelectable from 'material-ui/List/MakeSelectable';
import Toggle from 'material-ui/Toggle';

import merge from 'lodash.merge';
let SelectableList = MakeSelectable(List);

import PostPreview from './PostPreview.jsx';
import AppBarWithMenu from './AppBarWithMenu.jsx';

export default class PostList extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleShowPostsChange = this.handleShowPostsChange.bind(this);
        this.handleShowPagesChange = this.handleShowPagesChange.bind(this);
        this.handleShowDraftsChange = this.handleShowDraftsChange.bind(this);
    }

    componentWillMount() {
        this.setInitialState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setInitialState(nextProps);
    }

    setInitialState(props) {
        this.setState(merge(this.state, { showPages: true, showPosts: true, showDrafts: true }));

        if(props.posts.size > 0 && !this.state) {
            if(props.post && props.post.size > 0) {
                const postIndex = props.posts.findIndex(function (post) {
                    return post.get('slug') === props.post.get('slug');
                });

                this.setState(merge(this.state, { selectedIndex: postIndex }));
            } else {
                this.setState(merge(this.state, { selectedIndex: 0 }));
            }
        }
    }

    handleChange(e, index) {
        this.setState(merge(this.state, { selectedIndex: index }));

        this.props.getAdminPost(this.props.posts.get(index).get('slug'));
    }

    handleShowPostsChange(e, value) {
        this.setState(merge(this.state, { showPosts: value }));
    }

    handleShowPagesChange(e, value) {
        this.setState(merge(this.state, { showPages: value }));
    }

    handleShowDraftsChange(e, value) {
        this.setState(merge(this.state, { showDrafts: value }));
    }

    handleEditClick() {
        let slug = this.props.posts.get(this.state.selectedIndex).get('slug');

        this.context.router.push(`/admin/${slug}/edit`);
    }

    handleAddClick() {
        this.context.router.push('/admin/add');
    }

    render() {
        let content = <div>Loading...</div>;
        let postsInfo = this.props.posts.filter((post) => {
            return (this.state.showPosts ===  true && (typeof post.get('isPage') === 'undefined' || post.get('isPage') === false)) ||
                (this.state.showPages === true && (typeof post.get('isPage') !== 'undefined' && post.get('isPage') === true))  ||
                (this.state.showDrafts === true && (typeof post.get('draft') !== 'undefined' && post.get('draft') === true));
        });
        let postContent = this.props.post;
        let iconElementRight = <FlatButton label="Edit" onClick={this.handleEditClick}/>;

        if(postsInfo.size > 0) {
            const items = [];
            for (let i = 0; i < postsInfo.size; i++ ) {
                let postInfo = postsInfo.get(i);
                items.push(<ListItem key={i} value={i} primaryText={postInfo.get('title') + (postInfo.get('draft') ? " *" : "" )}/>);
            }

            content =
                <div>
                    <Paper style={{display: 'inline-block',
                                    width: 350,
                                    position: "absolute",
                                    top: "75px",
                                    bottom: "10px",
                                    left: "10px",
                                    right: "0px",
                                    overflow: "auto"}}
                           zDepth={1}>
                        <div style={{width: '90%', marginLeft: '15px', marginTop: '15px'}}>
                            <Toggle
                                label="Posts"
                                toggled={this.state.showPosts}
                                onToggle={this.handleShowPostsChange}
                            />
                            <Toggle
                                label="Pages"
                                toggled={this.state.showPages}
                                onToggle={this.handleShowPagesChange}
                            />
                            <Toggle
                                label="Drafts"
                                toggled={this.state.showDrafts}
                                onToggle={this.handleShowDraftsChange}
                            />
                        </div>
                        <SelectableList value={this.state.selectedIndex} onChange={this.handleChange}>
                            <Subheader>Posts and pages</Subheader>
                            {items}
                        </SelectableList>
                    </Paper>
                    <PostPreview post={postContent}/>
                    <FloatingActionButton onClick={this.handleAddClick} style={{position:"absolute", bottom: "30px", right:"30px"}}><i
                        className="material-icons">add</i></FloatingActionButton>
                </div>;
        }

        return(

            <div>
                <AppBarWithMenu title={this.props.blogName + " - Admin area"} iconElementRight={iconElementRight} />

                {content}
            </div>
        );
    }
}

PostList.contextTypes = {
    router: React.PropTypes.object.isRequired
};
