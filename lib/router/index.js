/**
 * @file 所有api的集合
 */
const fs = require('fs');
const conf = require('../../conf').server;

const apis = [
    require('./register'),
    require('./login'),
    require('./article'),
    require('./folderTree')
];

// 添加首页路由
apis.push(function () {
    const Router = require('koa-router');
    const router = new Router();
    router.get('/', ctx => {
        console.log(11);
        ctx.set('Content-Type', 'text/html');
        const data = fs.readFileSync(`${conf.feRoot}/template/edit-system-fe/index.html`,
            'utf-8',
            function (err, data) {
                if (err) {
                    throw err;
                }
                return data;
            }
        );

        ctx.response.body = data;
    });

    return router;
}());

exports.mount = app => {

    apis.reduce(
        function (app, router) {
            app.use(router.routes());
            app.use(router.allowedMethods());
            return app;
        },
        app
    );

};
