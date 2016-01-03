# Koa, generators, thunks

Prelude
-------

When I decided to use [Koa](http://koajs.com/) for serving the server side of the [minimalistic-blog](https://github.com/alexchiri/minimalistic-blog), I didn't put much thought into it. I didn't know much about middleware, generators etc, it was used by [JS cool people](https://github.com/RickWong/react-isomorphic-starterkit) and it was enough for me at that point. 

But soon enough, I wanted to serve the posts of the blog through an `/posts` endpoint on the server side. The posts were served from a folder on the disk and they were .md files. The main idea was to read the .md files from the disk, extract different details from a special header in the files, render the rest as html using [markdown-it](https://github.com/markdown-it/markdown-it) and send everything to the client side. Here's a sample of the markdown source of one of the posts:

```markdown
---
title: The Shadow Of The Wind by Carlos Ruiz-Zafón
slug: the-shadow-of-the-wind-by-carlos-ruiz-zafon
date_published: 2012-09-01T11:41:00.000Z
date_updated:   2014-07-13T10:25:59.000Z
---

One of the best books I read in the last couple of months, it has all the right elements to be a successful novel.

I found out about this novel from a [tweet](https://twitter.com/beranger_v4/status/234969291437535233) of one of the people I'm following. The [tweet](https://twitter.com/beranger_v4/status/234969291437535233) contained a quote that made me curious:

    People are evil. — Not evil, Fermín objected. Moronic, which isn't quite the same thing.

Now, after reading the book, I think this is one of the quotes that best describes the ultimate cause of the tragedy from this story Zafón presents to us: human nature. People are blinded by their feelings and pre- and misconceptions. And I think we can talk days and nights about this subject when we refer to the 19th century, when Zafón's heroes tell their story.
```

So the main goal at this stage was to simply serve the posts that I exported from my [Ghost](https://github.com/TryGhost) blog and display them on a very basic html (read as "no styling at all") using the whole [react](https://facebook.github.io/react/) isomorphic/universal approach.

The easiest way to read the .md files from disk was to use the new [readline](https://nodejs.org/api/readline.html) module from node.js. The only problem with using node.js modules from Koa is their callback nature. Koa doesn't work with callbacks, instead it requires you to become familliar with generators and thunks. 

Doesn't say much to you? Don't worry, it didn't to me either. Here's a naive approach to a basic use case, reading the .md files from disk and returning their content into the response of the API call. So no header parsing, no html rendering, simply reading files from disk and returning their content as pure text in the API response:

```js
// Naive approach to serving the posts content
// https://github.com/alexchiri/minimalistic-blog/blob/c2b021b73582e534f10a0c73a846d86bdbbe1d14/src/server/api/posts.js
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
```

If you would expect to see a nice JSON response, with the content of each file, then you would be disapointed:

```json
{
  "2012-09-01-the-shadow-of-the-wind-by-carlos-ruiz-zafon.md": [],
  "2012-09-16-difficult-conversations.md": []
}
```

The reason for this surprising result is the fact that the lines of each file are added to the `postData` map through a callback. Basically, `this.body = postData;` is executed and the response is sent before any line of any file is read. 

So callbacks and Koa middleware don't make good company. What we need to understand are generators. 
Noticed the `*` from line 1 `router.get('/posts', function*(next) {`? The asterisk char is not there just for the esthetic reasons, it's syntactic sugar to show that `function*(next)` is a generator.

Before we move on, I recommend a reading list, these articles will explain the matters way better than me:

* [The Basics Of ES6 Generators](https://davidwalsh.name/es6-generators)
* [Generators in Node.js: Common Misconceptions and Three Good Use Cases](https://strongloop.com/strongblog/how-to-generators-node-js-yield-use-cases/)
* A possible solution to my issue with Koa and `readline` [thunk you very much](http://chris.neosavvy.com/koa-js-thunks/)

The solution, in the end
------------------------

If you went through the articles above, you might come up with a solution like the one below (at least I did), short explanation after the code:

```js
// Read all the lines of the md files and return them in the response
// https://github.com/alexchiri/minimalistic-blog/blob/5884798a3f122edf001a271a13d8b3ec62aa61d2/src/server/api/posts.js
import koaRouter from 'koa-router';
import fs from 'fs';
import path from 'path'
import readline from 'readline';

const router = koaRouter();

function readPostFile(postFilePath) { // [4]
    return function(done) { // [5]
        var lines = [];

        var lineReader = readline.createInterface({
            input: fs.createReadStream(postFilePath)
        });

        lineReader.on('line', function(line){
            lines.push(line);
        });

        lineReader.on('close', function(){
            done(null, lines); // [6]
        });
    }
}

router.get('/posts', function*(next) {  // [1]
    const postsBaseDir = path.resolve(__dirname, '../../../posts');
    const posts = fs.readdirSync(postsBaseDir);
    var postData = {};

    for (let i = 0, len = posts.length; i < len; i++) { // [2]
        let postFilename = posts[i];
        const postFilePath = path.resolve(postsBaseDir, postFilename);

        postData[postFilename] = yield readPostFile(postFilePath); // [3]
    }

    this.body = postData;
});

export default router.middleware();
```

1. The `*` tells us that the function handling the `/posts` GET endpoint is a generator. Which means it's execution can be paused while some other operation is executed (or another middleware takes control)
2. We go through all the files in the folder
3. Here the execution pauses and the result of `readPostFile(postFilePath)` is sent to whoever controls this generator (in our case, Koa). `readPostFile(postFilePath)` is a 'thunk creator' and it will return a function as you can see at `[5]`.
4. This function receives the path of the file we want to read and uses it in the function it returns.
5. This function should have one parameter (a callback function). Koa will call this function and provide a callback to it when the generator has yielded. 
6. Once the processing is finished, we call the callback provided by Koa with any errors and the result. Koa will provide the result to the generator and resume the processing. `postData[postFilename]` will have the value contained by `lines`.