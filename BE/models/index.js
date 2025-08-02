const sequelize = require("./database");

const User = require("./user");
const Product = require("./product");
const Order = require("./order");
const OrderDetail = require("./orderDetail");
const comments = require("./comment");
const Cart = require("./cart");
const promotionsModel = require("./promotionsModel");
const promotionUsersModel = require("./promotionUsersModel");
const PromotionUserModel = require("./promotionUsersModel");

Order.belongsTo(promotionsModel, { foreignKey: "promotion_id", as: "promotion" });
promotionsModel.hasMany(Order, { foreignKey: "promotion_id", as: "orders" });

User.hasMany(promotionUsersModel, { foreignKey: 'user_id', as: 'promotionUsers' });
promotionUsersModel.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// PromotionUser belongsTo Promotion
promotionUsersModel.belongsTo(promotionsModel, { foreignKey: 'promotion_id', as: 'Promotion' });
promotionsModel.hasMany(promotionUsersModel, { foreignKey: 'promotion_id', as: 'promotionUsers' });

User.belongsToMany(promotionsModel, {
  through: promotionUsersModel,
  foreignKey: "user_id",
  otherKey: "promotion_id",
  as: "promotions",
});

promotionsModel.belongsToMany(User, {
  through: PromotionUserModel,
  foreignKey: "promotion_id",
  otherKey: "user_id",
  as: "users",
});
// Khai báo quan hệ
Order.belongsTo(User, { foreignKey: "user_id" });
Order.hasMany(OrderDetail, { foreignKey: "order_id" });

OrderDetail.belongsTo(Order, { foreignKey: "order_id", as: "orders" });
OrderDetail.belongsTo(Product, { foreignKey: "product_id", as: "product" });

comments.belongsTo(User, { foreignKey: "user_id", as: "user" });
comments.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Quan hệ giữa User và Product (nếu có)
User.hasMany(comments, { foreignKey: "user_id", as: "comments" }); // User có nhiều bình luận
Product.hasMany(comments, { foreignKey: "product_id", as: "comments" }); // Product có nhiều bình luận

Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" }); // Thêm quan hệ với User

// Export tất cả model
module.exports = {
  sequelize,
  Cart,
  comments,
  User,
  Product,
  Order,
  OrderDetail,
  promotionsModel,
  promotionUsersModel,
};
