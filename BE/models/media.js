const Sequelize = require('sequelize');
const database = require('./database');
const Product = require('./product'); // Import model Product

const Media = database.define('media', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    path: {
        type: Sequelize.STRING,
        allowNull: true
    },
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Product,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

// Thiết lập quan hệ
Media.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Media, { foreignKey: 'product_id', as: 'media' });

module.exports = Media;
