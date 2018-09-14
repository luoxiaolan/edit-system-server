/**
 * @file nav
 */

const Router = require('koa-router');
const Artical = require('../model/Artical');

const router = new Router();

const getTree = async (userId, parentId) => {
    const tree = await Artical.findAll({
        attributes: ['id', 'title'],
        where: {
            userId,
            parentId
        }
    });

    return tree;
};

const getFolderTree = (userId, wraperTree) => {
    wraperTree.forEach((item, index) => {
        const tree = getTree(userId, item.id);

        if (tree) {
            wraperTree[index].list = tree;
            getFolderTree(userId, tree);
        }
    });
};

router.post('/folderTree', async ctx => {

    const userId = ctx.request.userId;

    const wraperTree = getTree(userId, null);

    wraperTree && getFolderTree(userId, wraperTree);

    ctx.response.body = {
        status: 0,
        content: wraperTree,
        message: 'ok'
    };
});

module.exports = router;
