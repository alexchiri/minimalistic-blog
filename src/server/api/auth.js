import koaRouter from 'koa-router';
import parse from 'co-body';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {Author} from '../storage/schemas';

const router = koaRouter({prefix: '/api/login'});

function getAuthorByUsername(username) {
    return function(done) {
        Author.findOne({ username: username }, function(err, author) {
            done(err, author);
        });
    }
}

router.post('/', function*(next) {
    var body = yield parse.json(this);

    if (!body.username && !body.password) this.throw(400, 'username and password are required!');

    let author = yield getAuthorByUsername(body.username);

    if(!author) {
        this.throw(401, 'Unauthorised');
    }

    if(!bcrypt.compareSync(body.password, author.password)) {
        this.throw(401, 'Unauthorised');
    }

    let token = jwt.sign({author: author._id}, process.env.SECRET_KEY, { algorithm: 'HS256'});

    if(process.env.NODE_ENV === "production") {
        this.cookies.set("token", token, {httpOnly: true, secure: true});
    } else {
        this.cookies.set("token", token);
    }

    this.status = 200;
});

export default router.middleware();