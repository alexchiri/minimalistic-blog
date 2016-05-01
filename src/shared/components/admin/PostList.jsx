import React, {Component, PropTypes} from 'react';
import List from '../../../../node_modules/material-ui/lib/lists/list';
import ListItem from '../../../../node_modules/material-ui/lib/lists/list-item';
import FloatingActionButton from '../../../../node_modules/material-ui/lib/floating-action-button';
import FlatButton from '../../../../node_modules/material-ui/lib/flat-button';
import Paper from '../../../../node_modules/material-ui/lib/paper';
import Subheader from '../../../../node_modules/material-ui/lib/subheader/subheader';
import { SelectableContainerEnhance } from '../../../../node_modules/material-ui/lib/hoc/selectable-enhance';
import merge from 'lodash.merge';
let SelectableList = SelectableContainerEnhance(List);

import PostPreview from './PostPreview.jsx';
import AppBarWithMenu from './AppBarWithMenu.jsx';

export default class PostList extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
    }

    componentWillMount() {
        this.setInitialDropDownState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setInitialDropDownState(nextProps);
    }

    setInitialDropDownState(props) {
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

    handleEditClick() {
        let slug = this.props.posts.get(this.state.selectedIndex).get('slug');

        this.context.router.push(`/admin/${slug}/edit`);
    }

    handleAddClick() {
        this.context.router.push('/admin/add');
    }

    render() {
        let content = <div>Loading...</div>;
        let postsInfo = this.props.posts;
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
                        <SelectableList
                            valueLink={{value: this.state.selectedIndex, requestChange: this.handleChange}}>
                            {items}
                            <Subheader>Posts</Subheader>
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