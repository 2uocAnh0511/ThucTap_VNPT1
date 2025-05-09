const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const OrderModel = connection.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'canceled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = OrderModel;
