const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const CategoryModel = require('./categoryModel'); // 👈 Nhớ import

const ProductModel = connection.define('products', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  short_description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
   status: {
    type: DataTypes.STRING, // 👈 kiểu này phải tồn tại nếu bạn lọc bằng `status`
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});



module.exports = ProductModel;
