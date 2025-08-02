const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const orderController = require("../controllers/api/orderControllers");

const CategoryControllers = require("../controllers/api/categoryControllers");
const productControllers = require("../controllers/api/productControllers");
const userControllers = require("../controllers/api/userControllers");
const commentControllers = require("../controllers/api/commentControllers");
const cartControllers = require("../controllers/api/cartControllers");
const authController = require("../controllers/api/authController");
const statisticsController = require("../controllers/api/statistics.Controllers");
const userStatisticsControllers = require("../controllers/api/userStatistics.Controllers");

router.get("/categories", CategoryControllers.getAll);
router.get("/categories/:id", CategoryControllers.detail);
router.post("/categories", CategoryControllers.create);
router.put("/categories/:id",CategoryControllers.update);
// router.patch("/categories/:id", CategoryControllers.update);
router.delete("/categories/:id", CategoryControllers.delete);


router.get('/', productControllers.home)
router.get('/products',  upload.single('image'), productControllers.products)
router.get('/addproducts',  upload.single('image'), productControllers.addproducts)
router.post("/addproducts", upload.single('image'), productControllers.create);
router.get("/editproducts/:id", productControllers.editproductsbyId);
router.put("/editproducts/:id", productControllers.postEditProduct);
router.delete("/products/:id", productControllers.delete);
router.get('/products/:id', productControllers.getProductById);




// user
router.get("/users", userControllers.getAll);
router.get("/users/:id", userControllers.detail);
router.post("/users", userControllers.create);
router.put("/users/:id", userControllers.update);
// router.patch("/users/:id", userControllers.update);
router.delete("/users/:id", userControllers.delete);

router.get("/userstatistics", userStatisticsControllers.getUserStatistics);
// comment
// router.get("/products/:productId/comments", commentControllers.getAll);
router.get("/comments/:id", commentControllers.detail);
router.post("/comments", commentControllers.create);
// router.put("/comments/:id", commentControllers.update);
// router.delete("/comments/:id", commentControllers.delete);


// router.get("/comments", commentControllers.getAll);
router.get("/comments/:id", commentControllers.detail);
router.post("/comments", commentControllers.create);
router.put("/comments/:id", commentControllers.update);
// router.patch("/comments/:id", commentControllers.update);
router.delete("/comments/:id", commentControllers.delete);
router.patch("/comments/:id/toggle", commentControllers.toggleStatus);


// cart
router.get("/carts/:id", cartControllers.getCartByUserId);
// router.get("/carts/:id", cartControllers.detail);
router.post("/carts", cartControllers.addToCart);
// router.put("/carts/:id", cartControllers.update);
router.delete("/carts/:id", cartControllers.deleteCartItem);


// auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/profile", authController.updateProfile);



// Orders
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders", orderController.createOrder);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);
router.put("/orders/:id/cancel", orderController.cancelOrder);

// Order Details
router.post("/orders/details/:id", orderController.addOrderDetail);
router.get("/orders/details/:id", orderController.getOrderDetails);
router.get("/orders/detail_user/:id", orderController.getOrderDetailsByUserId);

// Thống kê


router.get('/statistics', statisticsController.getProductStatistics);
router.get("/:productId/comments", commentControllers.getByProduct);


module.exports = router;
