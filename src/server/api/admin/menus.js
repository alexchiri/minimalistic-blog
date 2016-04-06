import koaRouter from 'koa-router';
import parse from 'co-body';

import {MenuItem} from '../../storage/schemas';
import {authenticate} from '../auth';

const router = koaRouter({prefix: '/api/admin/menus'});

export function getMenuItems() {
    return function(done) {
        MenuItem.find({})
            .lean()
            .sort({ index: 1 })
            .exec(function(err, items) {
                done(err, items);
            });
    }
}

function removeAllMenuItems() {
    return function(done) {
        MenuItem.remove({}, done);
    }
}

function storeMenuItems(menuItems) {
    return function(done) {
        MenuItem.create(menuItems, done);
    }
}

router.get('/', function*(next) {
    let token = this.cookies.get('token');

    authenticate(token);

    let menuItems = yield getMenuItems();

    this.body = { menus: menuItems };
});

router.post('/', function*(next) {
    let token = this.cookies.get('token');

    authenticate(token);

    let menus = yield parse.json(this);
    let menuItems = [];

    for(let menu of menus) {
        menuItems.push(
          new MenuItem({
              label: menu.label,
              url: menu.url,
              index: menus.indexOf(menu),
              type: "MAIN_MENU"
          })
        );
    }

    let removeResult = yield removeAllMenuItems();
    if(removeResult.result.ok != 1) {
        this.throw(500, 'Error');
    }

    if(menuItems.length != 0) {
        let storeResult = yield storeMenuItems(menuItems);
        if(!storeResult || storeResult.length != menuItems.length ) {
            this.throw(500, 'Error');
        }
    }

    this.status = 200;
});

export default router.middleware();