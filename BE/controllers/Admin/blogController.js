const BlogModel = require('../../models/blogModel');
const UserModel = require('../../models/usersModel');
const slugify = require('slugify')

class BlogController {
  // Lấy danh sách blog có phân trang
static async getAll(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
      const blogs = await BlogModel.findAndCountAll({
        limit: parseInt(limit),
        offset: offset,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: ['id', 'name'],
          }
        ],
      });

      console.log("Blogs:", blogs); // Log dữ liệu để kiểm tra
      res.status(200).json({
        status: 200,
        message: "Lấy danh sách blog thành công",
        data: blogs.rows,
        total: blogs.count,
        totalPages: Math.ceil(blogs.count / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error("Lỗi khi lấy blog:", error);
      res.status(500).json({
        status: 500,
        message: "Lỗi server khi lấy blog.",
      });
    }
  }

  // Lấy blog theo ID
  static async getById(req, res) {
    try {
      const blog = await BlogModel.findByPk(req.params.id, {
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: ['id', 'name'],
          }
        ]
      });
      if (!blog) {
        return res.status(404).json({ status: 404, message: "Không tìm thấy bài viết." });
      }
      res.status(200).json({ status: 200, data: blog });
    } catch (error) {
      console.error("Lỗi khi lấy blog:", error);
      res.status(500).json({ status: 500, message: "Lỗi server." });
    }
  }

  // Tạo blog
static async create(req, res) {
  const { title, content, short_description, user_id, status } = req.body;
  const slug = req.body.slug || slugify(title, { lower: true, strict: true });

  try {
    const newBlog = await BlogModel.create({
      title,
      slug,
      content,
      short_description,
      image: req.file ? req.file.filename : null,
      user_id,
      status,
    });

    res.status(201).json({
      status: 201,
      message: "Tạo bài viết thành công",
      data: newBlog,
    });
  } catch (error) {
    console.error("Lỗi khi tạo blog:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi server khi tạo blog.",
    });
  }
}


  // Cập nhật blog
static async update(req, res) {
  try {
    const blog = await BlogModel.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: 404, message: "Không tìm thấy bài viết để cập nhật." });
    }

    const { title, short_description, content } = req.body;
    const image = req.file ? req.file.filename : blog.image;

    await blog.update({
      title,
      short_description,
      content,
      image
    });

    res.status(200).json({ status: 200, message: "Cập nhật bài viết thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật blog:", error);
    res.status(500).json({ status: 500, message: "Lỗi server." });
  }
}

  // Xoá blog
  static async delete(req, res) {
    try {
      const deleted = await BlogModel.destroy({ where: { id: req.params.id } });
      if (!deleted) {
        return res.status(404).json({ status: 404, message: "Không tìm thấy bài viết để xoá." });
      }
      res.status(200).json({ status: 200, message: "Xoá bài viết thành công" });
    } catch (error) {
      console.error("Lỗi khi xoá blog:", error);
      res.status(500).json({ status: 500, message: "Lỗi server." });
    }
  }
}

module.exports = BlogController;
