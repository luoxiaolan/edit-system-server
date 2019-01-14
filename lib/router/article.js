/**
 * @file nav
 */

const Router = require('koa-router');
const Article = require('../model/Article');
const getJWTData = require('../util/jwt').getJWTData;

const router = new Router();

router.post('/api/createArticle', async ctx => {
    const {body = {}} = ctx.request;

    const {parentId, title, detail} = body;

    const userData = getJWTData(ctx.headers.authorization.split(' ')[1]);
    const userId = userData.id;

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
            ret: 0,
            content: {
                id: content.id,
                title: content.title,
                detail: content.detail
            },
            message: '创建成功'
        };
    }
    catch (e) {
        ctx.response.status = 409;

        ctx.response.body = {
            ret: 1,
            message: '创建失败'
        };

        console.error(e.stack);
    }
});


router.get('/api/getArticle', async ctx => {
    const {query = {}} = ctx.request;

    const id = query.id;

    const userData = getJWTData(ctx.headers.authorization.split(' ')[1]);
    const userId = userData.id;

    try {
        const article = await Article.findAll({
            attributes: ['title', 'detail', 'updatedAt'],
            where: {
                id,
                userId
            }
        }).then(article => {
            return article[0];
        });

        ctx.response.status = 200;

        ctx.response.body = {
            ret: 0,
            content: {
                title: article.title,
                detail: article.detail,
                updatedAt: article.updatedAt
            },
            message: '成功'
        };
    } catch (e) {
        ctx.response.status = 405;

        ctx.response.body = {
            ret: 1,
            message: '查找文章失败'
        };
        console.error(e.stack);
    }

});

router.post('/api/editArticle', async ctx => {
    const {body = {}} = ctx.request;

    const {id, title, detail} = body;

    try {
        const article = await Article.update(
            {
                title,
                detail
            },
            {
                where: {
                    id
                }
            }
        );

        ctx.response.status = 200;

        ctx.response.body = {
            ret: 0,
            message: '创建成功'
        };
    }
    catch (e) {
        ctx.response.status = 410;

        ctx.response.body = {
            ret: 1,
            message: '创建失败'
        };

        console.error(e.stack);
    }
});

module.exports = router;
