const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/Client/categoryController');

//------------------[ CLIENT ROUTES ]------------------

//------------------[ CATEGORY ]------------------
router.get("/category/list", categoryController.getCategories);
module.exports = router;