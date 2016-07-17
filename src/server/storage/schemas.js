import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BlogPostSchema = new Schema({
    author: ObjectId,
    title: String,
    slug: String,
    link: String,
    content: String,
    image: String,
    date_published: Date,
    date_updated: Date,
    draft: Boolean,
    isPage: Boolean
});

var MenuItemSchema = new Schema({
    label: String,
    url: String,
    type: String,
    index: Number
});

var AuthorSchema = new Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String,
    email: String,
    twitter: String,
    linkedin: String
});

BlogPostSchema.plugin(mongoosePaginate);

export const Author = mongoose.model('Author', AuthorSchema);
export const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
export const MenuItem = mongoose.model('MenuItem', MenuItemSchema);