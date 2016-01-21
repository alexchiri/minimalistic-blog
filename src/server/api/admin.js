import koaRouter from 'koa-router';
import parse from 'co-body';
import showdown from 'showdown';
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
            .select("content slug title link draft date_published date_updated -_id")
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

router.get('/:slug', function*(next) {
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

        this.body = {post: post};
    } else {
        this.throw(404, 'post not found');
    }
});

router.put('/:slug', function*(next) {
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
    let postInfo = yield parse.json(this);

    if(postInfo) {
        let post = {
            title: postInfo.title ? postInfo.title : null,
            image: postInfo.image ? postInfo.image : null,
            link: postInfo.link ? postInfo.link : null,
            content: postInfo.content ? postInfo.content: null
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

router.get('/', function*(next) {
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
});

export default router.middleware();