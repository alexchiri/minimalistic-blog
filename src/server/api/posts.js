import koaRouter from 'koa-router';
import showdown from 'showdown';
import {Author, BlogPost} from '../storage/schemas';

const router = koaRouter({prefix: '/api/posts'});
const POSTS_PAGE_SIZE = parseInt(process.env.POSTS_PAGE_SIZE);

function getPaginatedPosts(offset, limit) {
    return function (done) {
        BlogPost.paginate({draft: false}, {
            offset: offset,
            limit: limit,
            lean: true,
            populate: { path: 'author', model: Author, select: "first_name last_name"},
            select: "-id -_id -__v",
            sort: {date_published: -1}
        }, function (err, result) {
            done(err, result);
        })
    }
}

function getPublishedPostsCount() {
    return function(done) {
        BlogPost.count({draft: false}, function(err, count) {
            done(err, count);
        })
    }
}

function getPostBySlug(slug) {
    return function (done) {
        BlogPost.findOne({slug: slug, draft: false})
            .lean()
            .populate({
                path: 'author',
                model: Author,
                select: "first_name last_name"
            })
            .select("-id -_id -__v")
            .exec(function (err, post) {
                done(err, post);
        });
    }
}

router.get('/', function*(next) {
    let offset = parseInt(this.request.query.offset);
    if(isNaN(offset) || offset < 0) {
        offset = 0;
    }

    let noPosts = yield getPublishedPostsCount();

    if(offset >= noPosts) {
        offset = noPosts - POSTS_PAGE_SIZE
    }

    let postsResult = yield getPaginatedPosts(offset, POSTS_PAGE_SIZE);
    let postsData = { posts: [], offset: postsResult.offset, total: noPosts };
    let postDocs = postsResult.docs;

    for (let i = 0; i < postDocs.length; i++) {
        let postData = postDocs[i];

        postData.renderedContent = new showdown.Converter().makeHtml(postData.content);

        delete postData.content;
        delete postData.id;
        postsData.posts.push(postData);
    }

    postsData.size = postsData.posts.length;

    this.body = postsData;
});

router.get('/:slug', function*(next) {
    let slug = this.params.slug;
    let post = yield getPostBySlug(slug);

    if(post) {
        post.renderedContent = new showdown.Converter().makeHtml(post.content);
        delete post.content;

        this.body = post;
    } else {
        this.throw(404, 'post not found');
    }
});

export default router.middleware();