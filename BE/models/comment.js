const Sequelize = require("sequelize");
const database = require("./database");

const Comment = database.define("comments", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  content: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: 1,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  updatedAt: false,
});

module.exports = Comment;
