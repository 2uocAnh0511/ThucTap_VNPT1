const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/Admin/ordersController');
const categoryController = require('../controllers/Admin/ctegoryController');
const CommentController = require('../controllers/Admin/commentController');


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

module.exports = router;