/**
 * @file 认证相关的 api 接口
 */

const Router = require('koa-router');
const User = require('../model/User');
const getToken = require('../util/jwt').getToken;
const getJWTData = require('../util/jwt').getJWTData;

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

    const token = getToken(user.get({
            plain: true
        }), ctx);

    ctx.response.body = {
        ret: 0,
        message: '登录成功',
        content: {
            token: token
        }
    };

});

router.get('/api/userInfo', async ctx => {
    const userData = getJWTData(ctx.headers.authorization.split(' ')[1]);
    const userId = userData.id;

    try {
        const user = await User.findAll({
            attributes: ['name', 'email'],
            where: {
                id: userId
            }
        }).then(user => {
            return user[0];
        });

        ctx.response.status = 200;

        ctx.response.body = {
            ret: 0,
            content: {
                name: user.name
            },
            message: '成功'
        };
    } catch (e) {
        ctx.response.status = 408;

        ctx.response.body = {
            ret: 'NO_LOGIN',
            message: '没有用户信息'
        };
        console.error(e.stack);

    }
});

module.exports = router;
