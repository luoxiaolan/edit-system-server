/**
 * @file create database for edit system
 */
const db = require('../lib/model/db.js');

require('../lib/model/User.js');
require('../lib/model/Artical.js');
require('../lib/model/Img.js');

db.connection
    .sync({
        logging: console.log,
        force: true
    })
    .then(() => {
        console.log(arguments);
    });
