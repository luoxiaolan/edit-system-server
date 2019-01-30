/**
 * @file nav
 */

const Router = require('koa-router');
const Article = require('../model/Article');
const getJWTData = require('../util/jwt').getJWTData;
const fs = require('fs');
const conf = require('../../conf').server;

const router = new Router();

function base642Buffer(data) {
    let time = Date.now();
    const file = `${conf.update}/${time}.png`;
    // 去掉图片 base64码前面的部分data:image/png;base64
    let base64 = data.replace(/^data:image\/\w+;base64,/, '');

    // 将 base64转成 buffer 对象
    let dataBuffer = new Buffer(base64, 'base64');
    fs.writeFileSync(file, dataBuffer);

    return `/${time}.png`;
}

function filterString(string) {
    // 将 string 里面的 img 的 src 属性都提取出来转换为二进制
    return string.replace(/<img\s+src="(.*?)">/g, function (data, $1) {
        return `<img src=${base642Buffer($1)}>`;
    });
}

router.post('/api/createArticle', async ctx => {
    const {body = {}} = ctx.request;

    let {parentId, title, detail} = body;

    detail = filterString(detail);

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

    let {id, title, detail} = body;

    detail = filterString(detail);

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
