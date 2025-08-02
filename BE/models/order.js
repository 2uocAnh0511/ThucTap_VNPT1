const { DataTypes } = require("sequelize");
const sequelize = require("./database"); // Cập nhật đúng đường dẫn tới database

// Định nghĩa model Order
const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Chờ xác nhận",
    },
    total_price: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00,
    }

}, {
    tableName: "orders",
    timestamps: true,
});

module.exports = Order;
