const { DataTypes } = require('sequelize');
const connection = require('../config/database');
const UserModel = require('./usersModel'); // Import UserModel để tạo quan hệ

const BlogModel = connection.define('blogs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    short_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'blogs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Định nghĩa mối quan hệ giữa Blog và User
BlogModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

module.exports = BlogModel;
