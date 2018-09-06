/**
 * @file 认证相关的 api 接口
 */

const Router = require('koa-router');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../model/User');
const {duration, secret} = require('../../conf').jwt;

const login = new Router();

login.post('/login', async (ctx) => {

    const {body = {}} = ctx.request;

    const {email, password} = body;

    const user = await User.authenticate(email, password);

    if (!user) {
        ctx.response.status = 401;
        ctx.response.body = 'authenticate failed';
        return;
    }

    const token = jsonwebtoken.sign({
        data: user,
        exp: duration
    }, secret);

    ctx.response.body = {token};

});

module.exports = login;
