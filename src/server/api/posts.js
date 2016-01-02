import koaRouter from 'koa-router';
import fs from 'fs';
import path from 'path'
import readline from 'readline';

const router = koaRouter();

function readPostFile(postFilePath) {
    return function(done) {
        var lines = [];

        var lineReader = readline.createInterface({
            input: fs.createReadStream(postFilePath)
        });

        lineReader.on('line', function(line){
            lines.push(line);
        });

        lineReader.on('close', function(){
            done(null, lines);
        });
    }
}

router.get('/posts', function*(next) {
    const postsBaseDir = path.resolve(__dirname, '../../../posts');
    const posts = fs.readdirSync(postsBaseDir);
    var postData = {};

    for (let i = 0, len = posts.length; i < len; i++) {
        let postFilename = posts[i];
        const postFilePath = path.resolve(postsBaseDir, postFilename);

        postData[postFilename] = yield readPostFile(postFilePath);
    }

    this.body = postData;
});

export default router.middleware();