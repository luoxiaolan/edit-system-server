/**
 * @file User
 */

const sequelize = require('sequelize');
const db = require('./db.js');

const User = db.defineModal('User', {
    name: sequelize.STRING,
    email: {
        type: sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: sequelize.STRING
});

User.authenticate = function (email, password) {
    return this.findAll({
        attributes: ['id', 'name'],
        where: {
            email,
            password
        }
    }).then(users => {
        return users[0];
    });
};

module.exports = User;
