/**
 * @file database connection
 */

const path = require('path');
const conf = require('../../conf').database;
const Sequelize = require('sequelize');

const dialect = conf.dialect;
const {database, username, password, ...rest} = conf[dialect];

console.log(`current database ${dialect} ${database}`);

let connection = new Sequelize(
    database,
    username,
    password,
    {
        dialect,
        ...rest
    }
);

module.exports = connection;
