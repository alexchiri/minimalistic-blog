import koaRouter from 'koa-router';
import fs from 'fs';
import path from 'path'
import readline from 'readline';
import markdownIt from 'markdown-it';

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
            } else if(headerCounter == 2 && line.trim() !== "") {
                postData.content += (line + "<br/>");
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
    var postsData = [];
    let md = markdownIt({html: true, typographer: true});

    for (let i = 0, len = posts.length; i < len; i++) {
        let postFilename = posts[i];
        const postFilePath = path.resolve(postsBaseDir, postFilename);
        let postData = yield readPostFile(postFilePath);

        postData.renderedContent = md.render(postData.content);
        delete postData.content;

        postsData.push(postData);
    }

    this.body = postsData;
});

export default router.middleware();