import { combineReducers } from 'redux';
import blog from './blog';
import posts from './posts';
import admin from './admin';

export default combineReducers({
    blog,
    posts,
    admin
});