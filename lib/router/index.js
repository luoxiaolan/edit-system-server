/**
 * @file 所有api的集合
 */

const apis = [
    require('./register'),
    require('./login'),
    require('./createArticle'),
    require('./folderTree')
];

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
