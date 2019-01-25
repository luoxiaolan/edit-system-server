/**
 * @file edit system server 主入口
 */
const Koa = require('koa');
const conf = require('../conf');
const jwt = require('koa-jwt');
const static = require('koa-static');
const proxy = require('http-proxy-middleware');
const fs = require('fs');

const app = new Koa();
const port = conf.server.port;
const secret = conf.jwt.secret;

const router = require('./router');

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
    // 包含/assets/的请求接口都会被转发
    if (/assets/.test(ctx.url)) {
        ctx.respond = false;
        return proxy({
            target: conf.server.feRoot,
            changeOrigin: true,
            secure: false
        })(ctx.req, ctx.res, next);
    }

    return next();
});

app.use(static(
    `${__dirname}/assets/`
));

// 指定首页
app.use(async ctx => {
    ctx.body = fs.readFileSync(`${conf.server.feRoot}/template/edit-system-fe/index.html`, 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        return data;
    });
})

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;

        if (err.status === 401) {
            ctx.response.body = {
                ret: 'NO_LOGIN',
                message: '没有登录'
            };
            return;
        }

        ctx.response.body = {
            ret: err.ret,
            message: err.message
        };
    }
});

app.use(jwt({
    secret
}).unless({
    path: [/\/register/, /\/login/]
}));

router.mount(app);

app.listen(port);

console.log(`edit system server startup: http://localhost:${port}`);
