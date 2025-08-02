const Sequelize = require('sequelize');
const database = require('./database');
const Category = require('./category');

const Product = database.define('products', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  short_description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  underscored: true
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});
module.exports = Product;