/**
 * @file token
 */
const jsonwebtoken = require('jsonwebtoken');
const {duration, secret} = require('../../conf').jwt;

function getToken(data = {}) {
    return jsonwebtoken.sign(data, secret, {
        expiresIn: duration
    });
}

function getJWTData(token) {
    return jsonwebtoken.verify(token, secret);
}

module.exports = {
    getToken,
    getJWTData
};
