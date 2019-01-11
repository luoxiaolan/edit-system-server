/**
 * @file nav
 */

const Router = require('koa-router');
const Article = require('../model/Article');
const getJWTData = require('../util/jwt').getJWTData;

const router = new Router();

const getTree = async (userId, parentId) => {
    const tree = await Article.findAll({
        attributes: ['id', 'title'],
        where: {
            userId,
            parentId
        }
    });

    const treeArr = [];

    tree.forEach((item, index) => {
        treeArr[index] = item.get({
            plain: true
        });
    });

    return treeArr;
};

const asyncForEach = (array, callback) => {
    let len = array.length;
    let promiseArr = [];
    for (let index = 0; index < len; index++) {
        promiseArr.push(callback(array[index], index));
    }

    return Promise.all(promiseArr);
};

const getFolderTree = async (userId, wraperTree) => {
    await asyncForEach(wraperTree, async (item, index) => {
        const tree = await getTree(userId, item.id);

        if (tree.length) {
            wraperTree[index].list = tree;
            await getFolderTree(userId, wraperTree[index].list);
        }
    });
};

router.get('/api/folderTree', async ctx => {
    const userData = getJWTData(ctx.headers.authorization.split(' ')[1]);
    const userId = userData.id;

    try {
        const wraperTree = await getTree(userId, 'null');

        wraperTree.length && await getFolderTree(userId, wraperTree);

        ctx.response.status = 200;

        ctx.response.body = {
            ret: 0,
            content: wraperTree,
            message: 'ok'
        };
    } catch (e) {
        ctx.response.status = 403;

        ctx.response.body = {
            ret: 1,
            message: '获取nav失败'
        };
        console.error(e.stack);
    }
});

module.exports = router;
