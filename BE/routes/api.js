const express = require("express");
const router = express.Router();
const upload = require("../config/upload");

// Controllers
const orderController = require("../controllers/api/orderControllers");
const CategoryControllers = require("../controllers/api/categoryControllers");
const productControllers = require("../controllers/api/productControllers");
const userControllers = require("../controllers/api/userControllers");
const commentControllers = require("../controllers/api/commentControllers");
const cartControllers = require("../controllers/api/cartControllers");
const authController = require("../controllers/api/authController");
const statisticsController = require("../controllers/api/statistics.Controllers");
const userStatisticsControllers = require("../controllers/api/userStatistics.Controllers");
const homeController = require('../controllers/api/homeController')
const promotionController = require("../controllers/api/promotionController");
const PromotionUserController = require("../controllers/api/promotionUserController");
const EmailController = require("../controllers/api/nodemailerController");

// ---------- CATEGORY ----------
router.get("/categories", CategoryControllers.getAll);
router.get("/categories/:id", CategoryControllers.detail);
router.post("/categories", CategoryControllers.create);
router.put("/categories/:id", CategoryControllers.update);
router.delete("/categories/:id", CategoryControllers.delete);

// ---------- PRODUCT ----------
router.get("/", productControllers.home);
router.get("/products", productControllers.products);
router.get("/addproducts", productControllers.addproducts);
router.post("/addproducts", upload.single("image"), productControllers.create);
router.get("/editproducts/:id", productControllers.editproductsbyId);
router.put("/editproducts/:id", productControllers.postEditProduct);
router.delete("/products/:id", productControllers.delete);
router.get("/products/:id", productControllers.getProductById);

// ---------- USER ----------
router.get("/users", userControllers.getAll);
router.get("/users/:id", userControllers.detail);
router.post("/users", userControllers.create);
router.put("/users/:id", userControllers.update);
router.delete("/users/:id", userControllers.delete);

// ---------- USER STATISTICS ----------
router.get("/userstatistics", userStatisticsControllers.getUserStatistics);

// ---------- CART ----------
router.get("/carts/:id", cartControllers.getCartByUserId);
router.post("/carts", cartControllers.addToCart);
router.delete("/carts/:id", cartControllers.deleteCartItem);

// ---------- AUTH ----------
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/profile", authController.updateProfile);

// ---------- ORDER ----------
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders", orderController.createOrder);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);
router.put("/orders/:id/cancel", orderController.cancelOrder);

// ---------- ORDER DETAILS ----------
router.post("/orders/details/:id", orderController.addOrderDetail);
router.get("/orders/details/:id", orderController.getOrderDetails);
router.get("/orders/detail_user/:id", orderController.getOrderDetailsByUserId);

// ---------- COMMENT ----------
router.get("/comments", commentControllers.getAll);
router.get("/products/:id/comments", commentControllers.getByProductId);
router.post("/comments", commentControllers.create);
router.put("/comments/:id", commentControllers.update);
router.patch("/comments/:id/toggle", commentControllers.toggleVisibility);

// ---------- STATISTICS ----------
router.get("/statistics", statisticsController.getProductStatistics);

router.get('/home', homeController.getHome);
router.get('/promotions/list', promotionController.getAll);
router.get('/promotions/generate-code', promotionController.generateUniquePromoCode);
router.post("/promotions/create", promotionController.create);
router.get('/promotions/getusers', promotionController.getHighValueBuyers);
// router.get('/promotions/applied', promotionController.getAppliedPromotions);
// router.get('/promotions/applied/:id', promotionController.getOrdersByPromotion);
router.get("/promotions/:id", promotionController.getById);
router.put('/promotions/:id', promotionController.update);
router.delete("/promotion/:id", promotionController.delete);

router.get('/promotionusers/list', PromotionUserController.get);
router.post('/promotionusers/check-emails', PromotionUserController.checkPromotionExpiry);
router.post('/send-promotion-emails', EmailController.sendPromotionEmails);
router.get('/users/not-in-promotion', PromotionUserController.getUsersNotInPromotion);
router.post('/promotionusers/add', PromotionUserController.addUsersToPromotion);

router.post('/promotions/apply', promotionController.applyDiscount);
router.get('/active', promotionController.getActivePromotions);


module.exports = router;
