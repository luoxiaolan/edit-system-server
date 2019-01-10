/**
 * @file 认证相关的 api 接口
 */

const Router = require('koa-router');
const User = require('../model/User');
const getToken = require('../util/jwt').getToken;

const router = new Router();

router.post('/api/login', async ctx => {

    const {body = {}} = ctx.request;

    const {email, password} = body;

    const user = await User.authenticate(email, password);

    if (!user) {
        ctx.response.status = 401;
        ctx.response.body = {
            ret: 1,
            message: 'authenticate failed'
        };
        return;
    }

    ctx.response.body = {
        ret: 0,
        message: '登录成功',
        content: {
            token: getToken(user.get({
                    plain: true
                }))
        }
    };

});

module.exports = router;
