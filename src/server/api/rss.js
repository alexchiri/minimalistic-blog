import koaRouter from 'koa-router';
import {Author, BlogPost} from '../storage/schemas';
import xmlbuilder from 'xmlbuilder';
import moment from 'moment-timezone';
import showdown from 'showdown';

const router = koaRouter({prefix: '/rss'});
const RSS_PAGE_SIZE = parseInt(process.env.RSS_PAGE_SIZE);
const BLOG_TITLE = process.env.BLOG_TITLE;
const BLOG_DESCRIPTION = process.env.BLOG_DESCRIPTION;
const HOSTNAME = process.env.HOSTNAME;

function getRSSPosts() {
    return function (done) {
        BlogPost.find({draft: false})
            .sort({date_published: -1})
            .limit(RSS_PAGE_SIZE)
            .populate({ path: 'author', model: Author, select: "first_name last_name"})
            .exec(function (err, posts) {
                done(err, posts);
            });
    }
}

router.get('/', function*(next) {
    let rss = xmlbuilder.create('rss', {version: '1.0', encoding: 'UTF-8', standalone: true}, {allowSurrogateChars: true});
    rss.att("xmlns:dc", "http://purl.org/dc/elements/1.1/");
    rss.att("xmlns:atom", "http://www.w3.org/2005/Atom");
    rss.att("xmlns:media", "http://search.yahoo.com/mrss/");
    rss.att("xmlns:content", "http://purl.org/rss/1.0/modules/content/");
    rss.att("version", "2.0");

    let channel = rss.ele('channel');
    channel.ele('title').dat(BLOG_TITLE);
    channel.ele('description').dat(BLOG_DESCRIPTION);
    channel.ele('link', `https://${HOSTNAME}/`);
    channel.ele('generator', 'minimalistic-blog');

    let currentDate = moment(Date.now()).tz('GMT');
    channel.ele('lastBuildDate', currentDate.format("ddd, DD MMM YYYY HH:mm:ss z"));
    channel.ele("atom:link", { 'rel':'self', 'type':'application/rss+xml'}, `https://${HOSTNAME}/rss/`);

    let posts = yield getRSSPosts();
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];

        let item = channel.ele('item');
        item.ele('title').dat(post.title);
        item.ele('link', `https://${HOSTNAME}/post/${post.slug}`);
        item.ele('dc:creator', `${post.author.first_name} ${post.author.last_name}`);
        item.ele('pubDate', moment(post.date_published).tz('GMT').format("ddd, DD MMM YYYY HH:mm:ss z"));
        if(post.image) {
            item.ele('media:content', { 'media': 'image', 'url': `${post.image}`})
        }

        item.ele('content:encoded').dat(new showdown.Converter().makeHtml(post.content) )
    }

    this.set('Content-Type', "application/rss+xml");
    this.body = rss.end({pretty: true})
});

export default router.middleware();