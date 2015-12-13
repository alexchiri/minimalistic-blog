import koaRouter from 'koa-router';
const router = koaRouter();

router.get('/posts', function*() {
    this.body="many many posts";
});

export default router.middleware();