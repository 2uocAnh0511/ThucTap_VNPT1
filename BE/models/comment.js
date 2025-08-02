const Sequelize = require("sequelize");
const database = require("./database"); // Kết nối database


const Comment = database.define(
  "comments",
  {
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
      allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      // references: {
      //   model: User,
      //   key: "id",
      // },
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      // references: {
      //   model: Product,
      //   key: "id",
      // },
    },
  },
  {
    timestamps: false,
  }
);

// Định nghĩa quan hệ


module.exports = Comment;
