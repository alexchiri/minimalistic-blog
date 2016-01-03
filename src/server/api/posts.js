import koaRouter from 'koa-router';
import fs from 'fs';
import path from 'path'
import readline from 'readline';
import showdown from 'showdown';

const router = koaRouter({prefix: '/api/posts'});

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
    const postsBaseDir = path.resolve(__dirname, '../../../posts');
    const posts = fs.readdirSync(postsBaseDir);
    const POSTS_PAGE_SIZE = parseInt(process.env.POSTS_PAGE_SIZE);

    let offset = this.request.query.offset ? this.request.query.offset : 1;
    if(offset > posts.length) {
        offset = posts.length - POSTS_PAGE_SIZE
    }
    let limit = (offset + POSTS_PAGE_SIZE - 1) > posts.length ? posts.length : offset + POSTS_PAGE_SIZE - 1;

    var postsData = [];

    for (let i = offset - 1; i < limit; i++) {
        let postFilename = posts[i];
        const postFilePath = path.resolve(postsBaseDir, postFilename);

        let postData = yield readPostFile(postFilePath);

        postData.renderedContent = new showdown.Converter().makeHtml(postData.content);
        delete postData.content;

        postsData.push(postData);
    }

    this.body = postsData;
});

export default router.middleware();