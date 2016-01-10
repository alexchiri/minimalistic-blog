import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

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
    date_updated: Date
});

var AuthorSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    twitter: String,
    linkedin: String
});

BlogPostSchema.plugin(mongoosePaginate);

export const Author = mongoose.model('Author', AuthorSchema);
export const BlogPost = mongoose.model('BlogPost', BlogPostSchema);