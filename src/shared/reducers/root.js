import { combineReducers } from 'redux';
import blog from './blog';
import posts from './posts';

export default combineReducers({
    blog,
    posts
});