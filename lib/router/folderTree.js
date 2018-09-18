/**
 * @file nav
 */

const Router = require('koa-router');
const Article = require('../model/Article');

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

const asyncForEach = async (array, callback) => {
    let len = array.length;
    for (let index = 0; index < len; index++) {
        await callback(array[index], index, array);
    }
};


// const getFolderTree = async (userId, wraperTree) => {
//     await asyncForEach(wraperTree, async (item, index) => {
//         const tree = await getTree(userId, item.id);
//
//         if (tree.length) {
//             wraperTree[index].list = tree;
//             await getFolderTree(userId, wraperTree[index].list);
//         }
//     });
// };

const getFolderTree = async (userId, wraperTree) => {
    let promiseArr = [];

    wraperTree.forEach((item, index) => {
        promiseArr.push(getTree(userId, item.id));
    });

    let result = await Promise.all(promiseArr);

    result.length && await asyncForEach(result, async (item, index) => {
        if (item.length) {
            wraperTree[index].list = item;

            await getFolderTree(userId, wraperTree[index].list);
        }
    });
};

router.post('/folderTree', async ctx => {

    const userId = ctx.request.body.userId;

    const wraperTree = await getTree(userId, null);

    wraperTree.length && await getFolderTree(userId, wraperTree);

    ctx.response.body = {
        status: 0,
        content: wraperTree,
        message: 'ok'
    };
});

module.exports = router;
