const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/Client/categoryController');
const BlogController = require('../controllers/Client/blogsController');
const CartController = require('../controllers/Client/cartsController');
const OrderController = require('../controllers/Client/ordersController');
const AddressController = require('../controllers/Client/addressController');


// const { checkJWT } = require('../services/authCheck');


//------------------[ CLIENT ROUTES ]------------------
router.get("/carts", CartController.getCartByUser);
router.post("/add-to-carts", CartController.addToCart);
router.put("/update-to-carts/:productId", CartController.updateCartItem);
router.delete("/delete-to-carts/:productId", CartController.removeCartItem);
router.delete("/clear-cart", CartController.clearCartByUser);

router.get("/orders", OrderController.get);
router.post("/orders", OrderController.create);
router.put("/orders/cancel/:id", OrderController.cancelOrder);
router.put("/orders/confirm-delivered/:id", OrderController.confirmDelivered);

//------------------[ ADDRESS ]------------------\
router.get('/address/user/:id', AddressController.getAddressesByUser);
router.delete('/user/:userId/addresses/:id', AddressController.deleteAddress);
router.put('/user/:userId/addresses/:id', AddressController.updateAddress);
router.post('/user/:userId/addresses', AddressController.addAddress);

//------------------[ CATEGORY ]------------------
router.get("/category/list", categoryController.getCategories);

//------------------[ Blogs ]------------------
router.get('/blogs/search', BlogController.searchBlogs);
router.get('/blogs', BlogController.getAllBlogs);
router.get('/blogs/:id', BlogController.getBlogById);

module.exports = router;