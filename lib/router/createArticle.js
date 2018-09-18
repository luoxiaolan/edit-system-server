/**
 * @file nav
 */

const Router = require('koa-router');
const Article = require('../model/Article');

const router = new Router();

router.post('/createArticle', async ctx => {
    const {body = {}} = ctx.request;

    const {userId, parentId = null, title, detail} = body;

    try {
        const article = await Article
            .build({
                parentId,
                userId,
                title,
                detail
            }).save();

        const content = article.get({
            plain: true
        });

        ctx.response.status = 200;

        ctx.response.body = {
            status: content.status,
            content: {
                id: content.id,
                title: content.title,
                detail: content.detail
            },
            message: 'ok'
        };
    }
    catch (e) {
        ctx.response.status = 409;
        ctx.response.body = '保存失败';
        console.error(e.stack);
    }
});

module.exports = router;
