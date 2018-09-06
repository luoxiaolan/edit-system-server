/**
 * @file create database for edit system
 */

require('babel-core/register');

require('../lib/model/User.js');

const sequelize = require('../lib/model/db.js');

sequelize
    .sync({
        logging: console.log,
        force: true
    })
    .then(() => {
        console.log(arguments);
    });
