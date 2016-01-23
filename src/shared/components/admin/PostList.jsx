import React, {Component, PropTypes} from 'react';
import DropDownMenu from '../../../../node_modules/material-ui/lib/DropDownMenu';
import MenuItem from '../../../../node_modules/material-ui/lib/menus/menu-item';
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button';
import AppBar from '../../../../node_modules/material-ui/lib/app-bar';
import FloatingActionButton from '../../../../node_modules/material-ui/lib/floating-action-button';

import PostPreview from './PostPreview.jsx';

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
            this.state = { value: props.posts.get(0).get('slug') };
        }
    }

    handleChange(e, index, value) {
        this.setState({value});

        this.props.getAdminPost(value);
    }

    handleEditClick() {
        this.context.router.push(`/admin/${this.state.value}/edit`);
    }

    handleAddClick() {
        this.context.router.push('/admin/add');
    }

    render() {
        let content = <div>Loading...</div>;
        let postsInfo = this.props.posts;
        let postContent = this.props.post;

        if(postsInfo.size > 0) {
            const items = [];
            for (let i = 0; i < postsInfo.size; i++ ) {
                let postInfo = postsInfo.get(i);
                items.push(<MenuItem value={postInfo.get('slug')} key={i} primaryText={postInfo.get('title') + (postInfo.get('draft') ? " *" : "" )}/>);
            }

            content =
                <div>
                    <div>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} autoWidth={false}
                                      style={{width:'70%'}}>
                            {items}
                        </DropDownMenu>
                        <RaisedButton label="Edit" onClick={this.handleEditClick}/>
                    </div>
                    <PostPreview post={postContent}/>
                    <FloatingActionButton onClick={this.handleAddClick}><i className="material-icons">add</i></FloatingActionButton>
                </div>;
        }

        return(
            <div>
                <AppBar
                    title={this.props.blogName + " - Admin area"}
                    showMenuIconButton={false}
                />
                {content}
            </div>
        );
    }
}

PostList.contextTypes = {
    router: React.PropTypes.object.isRequired
};