/**
 * @file register action
 */

const Router = require('koa-router');
const User = require('../model/User.js');
const getToken = require('../util/jwt').getToken;

const router = new Router();

router.post('/api/register', async ctx => {
    const {body = {}} = ctx.request;
    const {name, email, password, status} = body;

    try {
        const user = await User
            .build({
                name,
                email,
                password,
                status
            })
            .save();

        const id = user
            .get({
                plain: true
            }).id;

        ctx.response.status = 200;

        ctx.response.body = {
            ret: 0,
            message: 'ok',
            content: {
                token: getToken({
                    id,
                    name
                })
            }
        };

    }
    catch (e) {
        ctx.response.status = 402;
        ctx.response.body = {
            ret: 1,
            message: '注册失败'
        };

        console.error(e.stack);
    }

});

module.exports = router;
