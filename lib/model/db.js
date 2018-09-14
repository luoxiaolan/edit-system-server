/**
 * @file database connection
 */
const conf = require('../../conf').database;
const Sequelize = require('sequelize');

const dialect = conf.dialect;
const {database, username, password, ...rest} = conf[dialect];

let connection = new Sequelize(
    database,
    username,
    password,
    {
        dialect,
        ...rest
    }
);

function defineModal(name, attributes) {
    let attrs = {};

    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }

    // 添加公用字段
    // 状态：0表示有效；1表示无效；2表示已删除，默认为0
    attrs.status = {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    };

    return connection.define(name, attrs, {
        tableName: name,
        timestamps: true
    });
}

module.exports = {
    connection,
    defineModal
};
