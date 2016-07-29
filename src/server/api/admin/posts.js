import koaRouter from 'koa-router';
import parse from 'co-body';
import showdown from 'showdown';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import getSlug from 'speakingurl';

import {Author, BlogPost} from '../../storage/schemas';
import {authenticate} from '../auth';

const router = koaRouter({prefix: '/api/admin/posts'});

function getAllPostsInfo() {
    return function(done) {
        BlogPost.find({})
            .lean()
            .select("title slug date_published date_updated draft tags isPage -_id")
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
            .select("content slug title link image draft date_published date_updated tags isPage -_id")
            .exec(function(err, posts) {
                done(err, posts);
            });
    }
}

function updatePost(slug, postInfo) {
    return function(done) {
        BlogPost.update({slug: slug}, postInfo, done);
    }
}

function addPost(post) {
    return function(done) {
        BlogPost.create(post, done);
    }
}

router.get('/:slug', function*(next) {
    let token = this.cookies.get('token');

    authenticate(token);

    let slug = this.params.slug;
    let post = yield getPostContent(slug);

    if(post) {
        post.renderedContent = new showdown.Converter().makeHtml(post.content);

        this.body = {post: post};
    } else {
        this.throw(404, 'post not found');
    }
});

router.put('/:slug', function*(next) {
    let token = this.cookies.get('token');

    authenticate(token);

    let slug = this.params.slug;
    let postInfo = yield parse.json(this);

    if(postInfo) {
        let post = {
            title: postInfo.title ? postInfo.title : null,
            image: postInfo.image ? postInfo.image : null,
            link: postInfo.link ? postInfo.link : null,
            content: postInfo.content ? postInfo.content: null,
            isPage: postInfo.isPage ? postInfo.isPage: false,
            tags: postInfo.tags ? postInfo.tags: null,
        };
        let updateResult = yield updatePost(slug, post);

        if(updateResult.ok == 1) {
            this.status = 200;
        } else {
            this.throw(500, 'some error occurred');
        }
    } else {
        this.throw(404, 'post not found');
    }
});

router.post('/', function*(next) {
    let token = this.cookies.get('token');

    let authorData = authenticate(token);
    if(!authorData.author) {
        this.throw(500, 'Error');
    }

    let postInfo = yield parse.json(this);
    if(postInfo.title) {
        if(!postInfo.slug) {
            postInfo.slug = getSlug(postInfo.title);
        }
        postInfo.date_updated = Date.now();
        postInfo.author = mongoose.Types.ObjectId(authorData.author);

        if(!postInfo.draft) {
            postInfo.date_published = Date.now();
        }

        let post = yield addPost(postInfo);

        if(post._id) {
            this.status = 200;
        } else {
            this.throw(500, 'Error');
        }
    }
});

router.get('/', function*(next) {
    let token = this.cookies.get('token');

    authenticate(token);

    let postsInfo = yield getAllPostsInfo();

    this.body = { posts: postsInfo, total: postsInfo.length };
});

export default router.middleware();