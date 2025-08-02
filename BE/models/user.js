const Sequelize = require("sequelize");
const database = require("./database");

const User = database.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
