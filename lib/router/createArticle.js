/**
 * @file nav
 */

const Router = require('koa-router');
const Article = require('../model/Article');

const router = new Router();

router.post('/createArticle', async ctx => {

    const {userId, articleId} = ctx.request;

    // todo

    // const wraperTree = getTree(userId, null);
    //
    // wraperTree && getFolderTree(userId, wraperTree);
    //
    // ctx.response.body = {
    //     status: 0,
    //     content: wraperTree,
    //     message: 'ok'
    // };
});

module.exports = router;
