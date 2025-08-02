const Blog = require('../../models/blog');
const User = require('../../models/user');
const { Op } = require("sequelize");

exports.getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (page - 1) * limit;

        // Tìm kiếm theo tiêu đề và trạng thái
        const where = {};
        if (search) {
            where.title = { [Op.like]: `%${search}%` };
        }
        if (status !== undefined) {
            where.status = parseInt(status);
        }

        // Lấy danh sách bài viết với phân trang
        const { rows, count } = await Blog.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']], // Sửa createdAt thành created_at
        });

        res.json({
            data: rows,
            total: count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res, next) => {
    try {
        const { title, content, user_id, image } = req.body;
        if (!title || !content || !user_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const blog = await Blog.create({
            title,
            content,
            image,
            user_id,
            status: 1
        });
        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, image, status } = req.body;

        const data = {};
        if (title) data.title = title;
        if (content) data.content = content;
        if (image) data.image = image;
        if (status !== undefined) data.status = parseInt(status); // Chỉ cập nhật status nếu được gửi

        const [updated] = await Blog.update(data, {
            where: { id },
        });

        if (updated) {
            const updatedBlog = await Blog.findByPk(id);
            res.json(updatedBlog);
        } else {
            res.status(404).json({ error: "Bài viết không tồn tại" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ error: "Bài viết không tồn tại" });
        }
        await blog.destroy();
        res.json({ message: "Xóa bài viết thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.toggleStatus = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        await blog.update({
            status: blog.status === 1 ? 0 : 1
        });

        res.json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};