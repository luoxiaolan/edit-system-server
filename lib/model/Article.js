/**
 * @file Article
 */

const sequelize = require('sequelize');
const db = require('./db.js');

const Article = db.defineModal('Article', {
    parentId: {
        type: sequelize.UUID,
        allowNull: true
    },
    userId: sequelize.UUID,
    title: sequelize.STRING,
    detail: {
        type: sequelize.TEXT,
        allowNull: true
    }
});

module.exports = Article;
