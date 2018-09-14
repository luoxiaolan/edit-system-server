/**
 * @file nav
 */

const Router = require('koa-router');
const Artical = require('../model/Artical');

const router = new Router();

router.post('/folderTree', async ctx => {

    const userId = ctx.request.userId;

    const folderTree = await Artical.findAll({
        attributes: ['id', 'title'],
        where: {
            userId,
            parentId: null
        }
    });

    ctx.response.body = folderTree;

});

module.exports = router;
