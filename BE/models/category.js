const Sequelize = require('sequelize');
const database = require('./database');

const Category = database.define('categories',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: Sequelize.STRING,
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1 // 1: hiển thị, 0: bị ẩn
          }
          
    },
    {
        timestamps: false,
    }
);
module.exports = Category;