/**
 * @file Img
 */

const sequelize = require('sequelize');
const db = require('./db.js');

const Img = db.defineModal('Img', {
    articalId: sequelize.UUID,
    image: sequelize.BLOB
});

module.exports = Img;
