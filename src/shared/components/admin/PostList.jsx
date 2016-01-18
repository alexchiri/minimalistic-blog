import React, {Component, PropTypes} from 'react';
import DropDownMenu from '../../../../node_modules/material-ui/lib/DropDownMenu';
import MenuItem from '../../../../node_modules/material-ui/lib/menus/menu-item';
import RaisedButton from '../../../../node_modules/material-ui/lib/raised-button';

import PostPreview from './PostPreview.jsx';

export default class PostList extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
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

        this.props.getAdminPostContent(value);
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
                        <RaisedButton label="Edit"/>
                    </div>
                    <PostPreview post={postContent}/>
                </div>;
        }

        return(
            <div>
                {content}
            </div>
        );
    }
}