const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/Client/categoryController');
const BlogController = require('../controllers/Client/blogsController');

//------------------[ CLIENT ROUTES ]------------------

//------------------[ CATEGORY ]------------------
router.get("/category/list", categoryController.getCategories);

//------------------[ Blogs ]------------------
router.get('/blogs/search', BlogController.searchBlogs);
router.get('/blogs', BlogController.getAllBlogs);
router.get('/blogs/:id', BlogController.getBlogById);

module.exports = router;