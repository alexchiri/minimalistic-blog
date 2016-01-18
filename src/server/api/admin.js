import koaRouter from 'koa-router';
import showdown from 'showdown';
import mongoose from 'mongoose';
import {Author, BlogPost} from '../storage/schemas';
import jwt from 'jsonwebtoken';

const router = koaRouter({prefix: '/api/admin/posts'});

function getAllPostsInfo() {
    return function(done) {
        BlogPost.find({})
            .lean()
            .select("title slug date_published date_updated draft -_id")
            .sort({ date_published: -1 })
            .exec(function(err, posts) {
                done(err, posts);
            });
    }
}

function getPostContent(slug) {
    return function(done) {
        BlogPost.findOne({slug: slug})
            .lean()
            .select("content -_id")
            .exec(function(err, posts) {
                done(err, posts);
            });
    }
}

router.get('/:slug', function*(next) {
    mongoose.connect(process.env.MONGODB);

    let token = this.cookies.get('token');

    if(!token) {
        this.throw(401, 'Unauthorised');
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY);
    } catch(err) {
        this.throw(401, 'Unauthorised');
    }

    let slug = this.params.slug;
    let post = yield getPostContent(slug);

    if(post) {
        post.renderedContent = new showdown.Converter().makeHtml(post.content);
        delete post.content;

        this.body = {post: post};
    } else {
        this.throw(404, 'post not found');
    }

    mongoose.disconnect();
});

router.get('/', function*(next) {
    mongoose.connect(process.env.MONGODB);

    let token = this.cookies.get('token');

    if(!token) {
        this.throw(401, 'Unauthorised');
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY);
    } catch(err) {
        this.throw(401, 'Unauthorised');
    }

    let postsInfo = yield getAllPostsInfo();

    this.body = { posts: postsInfo, total: postsInfo.length };

    mongoose.disconnect();
});

export default router.middleware();