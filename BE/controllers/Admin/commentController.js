const CommentModel = require('../../models/commentsModel');
const UserModel = require('../../models/usersModel');
class CommentController {
  static async getAll(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
      const comments = await CommentModel.findAndCountAll({
        limit: parseInt(limit), // Giới hạn số lượng bình luận mỗi trang
        offset: offset, // Lấy các bình luận từ offset
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
        order: [["created_at", "DESC"]], // Sắp xếp bình luận theo ngày tạo
      });

      res.status(200).json({
        status: 200,
        message: "Lấy danh sách bình luận thành công",
        data: comments.rows, // Dữ liệu bình luận
        total: comments.count, // Tổng số bình luận
        totalPages: Math.ceil(comments.count / limit),
      });
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
      res.status(500).json({
        status: 500,
        message: "Lỗi server khi lấy bình luận.",
      });
    }
  }
}

module.exports = CommentController;
