/**
 * @file Artical
 */

const sequelize = require('sequelize');
const db = require('./db.js');

const Artical = db.defineModal('Artical', {
    parentId: {
        type: sequelize.UUID,
        allowNull: true
    },
    userId: sequelize.UUID,
    title: sequelize.STRING,
    detail: {
        type: sequelize.STRING,
        allowNull: true
    }
});
