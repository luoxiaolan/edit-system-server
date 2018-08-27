/**
 * @file register action
 */

const Router = require('koa-router');
const User = require('../model/User.js');

const register = new Router();

register.post('/register', async (ctx) => {
    const {body = {}} = ctx.request;
    const {name, email, password} = body;

    try {
        const user = await User
            .build({
                name,
                email,
                password
            })
            .save();

        const {id} = user
            .get({
                plain: true
            });

        ctx.response.status = 200;

        ctx.response.body = {
            id,
            name,
            email
        };

    }
    catch (e) {
        ctx.response.status = 409;
        ctx.response.body = '您的邮箱已经被注册了，请换个邮箱试试';
        console.error(e.stack);
    }

});


module.exports = register;
