import koaRouter from 'koa-router';
import fs from 'fs';
import path from 'path'
import readline from 'readline';
import showdown from 'showdown';

const router = koaRouter({prefix: '/api/posts'});
const postsBaseDir = path.resolve(__dirname, '../../../posts');
const posts = fs.readdirSync(postsBaseDir).reverse();
const POSTS_PAGE_SIZE = parseInt(process.env.POSTS_PAGE_SIZE);

function readPostFile(postFilePath) {
    return function(done) {
        var postData = { content: "" };
        var headerCounter = 0;

        var lineReader = readline.createInterface({
            input: fs.createReadStream(postFilePath)
        });

        lineReader.on('line', function(line){
            if(line === "---") {
                headerCounter++;
            } else if(headerCounter == 1) {
                let headerComponents = line.split(':', 2);
                postData[headerComponents[0]] = headerComponents[1].trim();
            } else if(headerCounter == 2) {
                postData.content += (line + "\n");
            }
        });

        lineReader.on('close', function(){
            done(null, postData);
        });
    }
}

router.get('/', function*(next) {
    let offset = parseInt(this.request.query.offset);
    if(isNaN(offset) || offset < 1) {
        offset = 1;
    }

    if(offset > posts.length) {
        offset = posts.length - POSTS_PAGE_SIZE
    }

    let limit = offset + POSTS_PAGE_SIZE - 1;
    if(limit > posts.length) {
        limit = posts.length;
    }

    var postsData = { posts: [], offset: offset, total: posts.length };

    for (let i = offset - 1; i < limit; i++) {
        let postFilename = posts[i];
        const postFilePath = path.resolve(postsBaseDir, postFilename);

        let postData = yield readPostFile(postFilePath);

        postData.renderedContent = new showdown.Converter().makeHtml(postData.content);
        delete postData.content;

        postsData.posts.push(postData);
    }

    postsData.size = postsData.posts.length;

    this.body = postsData;
});

router.get('/:slug', function*(next) {
    let slug = this.params.slug;

    let found = false;
    let post;
    for (let i = 0; i < posts.length && !found; i++) {
        let postFilename = posts[i];
        const postFilePath = path.resolve(postsBaseDir, postFilename);

        let postData = yield readPostFile(postFilePath);
        if(postData.slug == slug) {
            found = true;
            postData.renderedContent = new showdown.Converter().makeHtml(postData.content);
            post = postData;
        }
    }

    if(found) {
        this.body = post;
    } else {
        this.throw(404, 'post not found');
    }
});

export default router.middleware();