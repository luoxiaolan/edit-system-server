/**
 * @file token
 */
const jsonwebtoken = require('jsonwebtoken');
const {duration, secret} = require('../../conf').jwt;

function getToken(data = {}, ctx) {
    const token = jsonwebtoken.sign(data, secret, {
        expiresIn: duration
    });

    // 服务端设置 cookie
    // ctx.cookies.set('token',
    //     token,
    //     {
    //         maxAge: 4 * 3600 * 1000,
    //         overwrite: true
    //     });

    return token;
}

function getJWTData(token) {
    return jsonwebtoken.verify(token, secret);
}

module.exports = {
    getToken,
    getJWTData
};
