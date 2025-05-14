const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const CategoryModel = connection.define('categories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING, // 👈 kiểu này phải tồn tại nếu bạn lọc bằng `status`
    allowNull: false
  }
}, {
  tableName: 'categories',
  timestamps: false
});

module.exports = CategoryModel;
