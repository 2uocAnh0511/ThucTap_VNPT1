const Blog = require('../../models/blog');
const { Op } = require("sequelize");

exports.getAll = async (req, res, next) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.detail = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res, next) => {
    try {
        const { title, content, user_id, status } = req.body;
        const file = req.file;
        
        const blogData = {
            title,
            content,
            user_id,
            status: status || 1,
            ...(file && { image: file.filename })
        };

        const blog = await Blog.create(blogData);
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res, next) => {
    try {
        const { title, content, user_id, status } = req.body;
        const file = req.file;
        
        const blogData = {
            title,
            content,
            user_id,
            status,
            ...(file && { image: file.filename })
        };

        const [updated] = await Blog.update(blogData, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const updatedBlog = await Blog.findByPk(req.params.id);
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const deleted = await Blog.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};