const Sequelize = require('sequelize');
const database = require('./database');
const Category = require('./category'); // Import model Category

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
            model: Category, // Liên kết với bảng Category
            key: 'id'
        }
    },
   
}, {
    timestamps: false,
});

// Thiết lập quan hệ
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

module.exports = Product;
