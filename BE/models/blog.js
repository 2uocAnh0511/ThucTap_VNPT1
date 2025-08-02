const Sequelize = require("sequelize");
const database = require("./database");

const Blog = database.define("blogs", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  timestamps: false,
  underscored: true, // Sử dụng snake_case cho tên cột
});

module.exports = Blog;