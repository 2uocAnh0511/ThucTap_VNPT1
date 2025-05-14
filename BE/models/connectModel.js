const UserModel = require('../models/usersModel');
const AddressModel = require('../models/addressModel');
const DiscountModel = require('../models/discountsModel');
const ProductModel = require('../models/productsModel');
const CommentModel = require('../models/commentsModel');
const OrderModel = require('../models/ordersModel');
const CategoryModel = require('../models/categoryModel');
const CartModel = require('../models/cartsModel');
const BrandModel = require('../models/brandsModel');
const OrderItemsModel = require('../models/orderItemsModel');

//--------------------- [ Thiết lập quan hệ ]------------------------

// User - Address
UserModel.hasMany(AddressModel, { foreignKey: 'user_id', as: 'addresses' });
AddressModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

// Product - Discount
ProductModel.hasMany(DiscountModel, { foreignKey: 'product_id', as: 'discounts' });
DiscountModel.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product' });

// Product - Comment
ProductModel.hasMany(CommentModel, { foreignKey: 'product_id', as: 'comments' });
CommentModel.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product' });

// User - Comment
CommentModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

// Order - Comment
CommentModel.belongsTo(OrderModel, { foreignKey: 'order_id', as: 'order' });

// User - Order
UserModel.hasMany(OrderModel, { foreignKey: 'user_id', as: 'orders' });
OrderModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

// Category - Product
CategoryModel.hasMany(ProductModel, { foreignKey: 'category_id', as: 'products' });
ProductModel.belongsTo(CategoryModel, { foreignKey: 'category_id', as: 'category' });

// User - Cart
UserModel.hasMany(CartModel, { foreignKey: 'user_id', as: 'carts' });
CartModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

// Product - Cart
ProductModel.hasMany(CartModel, { foreignKey: 'product_id', as: 'carts' });
CartModel.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product' });

// Brand - Product
// BrandModel.hasMany(ProductModel, { foreignKey: 'brand_id', as: 'products' });
// ProductModel.belongsTo(BrandModel, { foreignKey: 'brand_id', as: 'brand' });


// Orders - OrderItems
OrderModel.hasMany(OrderItemsModel, { foreignKey: 'order_id', as: 'orderDetails' });
OrderItemsModel.belongsTo(OrderModel, { foreignKey: 'order_id', as: 'order'});

// OrderItems - Product
OrderItemsModel.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product'});
ProductModel.hasMany(OrderItemsModel, { foreignKey: 'product_id', as: 'orderItems'});
  


module.exports = {
    UserModel,
    AddressModel,
    DiscountModel,
    ProductModel,
    CommentModel,
    OrderModel,
    CategoryModel,
    CartModel,
    BrandModel,
    OrderItemsModel
};
