/**
 * @file edit system server 主入口
 */
const Koa = require('koa');
const conf = require('../conf');
const jwt = require('koa-jwt');

const app = new Koa();
const port = conf.server.port;
const secret = conf.jwt.secret;

const router = require('./router');

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());

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
