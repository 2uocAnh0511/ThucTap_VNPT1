const express = require('express');
const router = express.Router();
const upload = require("../config/upload")
const OrderController = require('../controllers/Admin/ordersController');
const categoryController = require('../controllers/Admin/ctegoryController');
const CommentController = require('../controllers/Admin/commentController');
const UserController = require('../controllers/Admin/userController');

const UserController = require('../controllers/Admin/userController');


const productControllers = require('../controllers/Admin/productController');

//------------------[ ADMIN ROUTES ]------------------

//------------------[ ORDERS ]------------------
router.get('/orders/list', OrderController.get);
router.get('/orders/:id', OrderController.getById); 
router.put('/orders/:id', OrderController.update); 
router.delete("/orders/:id", OrderController.delete);


router.get("/category/list", categoryController.getAll);
router.post('/category/create', categoryController.create);
router.get("/category/:id", categoryController.getById);
router.put('/category/:id', categoryController.update);
router.delete('/category/:id', categoryController.delete);

router.get('/comments/list', CommentController.getAll);


//------------------[ USERS ]------------------
router.get('/user/list', UserController.get);
router.get('/user/search', UserController.searchUser);
router.get('/user/:id', UserController.getById); 
router.put('/user/:id/status', UserController.updateUserStatus);
router.post('/user/:id/addresses', UserController.addAddressToUser);


// ========== PRODUCTS ROUTES ==========

// [GET] Lấy danh sách sản phẩm (có join danh mục)
router.get('/products', productControllers.products);

// [GET] Lấy danh sách danh mục (để hiển thị khi tạo sản phẩm)
router.get('/products/add', productControllers.addproducts);

// [GET] Lấy chi tiết sản phẩm để hiển thị form chỉnh sửa
router.get('/products/edit/:id', productControllers.editproductsbyId);

// [GET] Lấy chi tiết sản phẩm cụ thể (để xem)
router.get('/products/:id', productControllers.getProductById);

// [POST] Thêm sản phẩm mới (có upload ảnh)
router.post('/products', upload.single('image'), productControllers.create);

// [PUT] Cập nhật sản phẩm (có upload ảnh)
router.put('/products/:id', upload.single('image'), productControllers.postEditProduct);

// [DELETE] Xóa sản phẩm
router.delete('/products/:id', productControllers.delete);

module.exports = router;