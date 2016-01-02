import koaRouter from 'koa-router';
import fs from 'fs';
import path from 'path'
import readline from 'readline';

const router = koaRouter();

router.get('/posts', function*(next) {
    const postsBaseDir = path.resolve(__dirname, '../../../posts');
    const posts = fs.readdirSync(postsBaseDir);

    var postData = {};
    for (let i = 0, len = posts.length; i < len; i++) {
        let postFilename = posts[i];
        const postFilePath = path.resolve(postsBaseDir, postFilename);

        var lineReader = readline.createInterface({
            input: fs.createReadStream(postFilePath)
        });

        postData[postFilename] = [];

        lineReader.on('line', function (line) {
            postData[postFilename].push(line);
        });
    }

    this.body = postData;
});

export default router.middleware();