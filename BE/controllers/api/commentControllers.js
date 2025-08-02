const { Op } = require("sequelize"); // ✅
const { Product, User, comments } = require("../../models");

exports.getAll = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await comments.findAndCountAll({
      where: search
        ? {
          [Op.or]: [
            { content: { [Op.like]: `%${search}%` } },
          ],
        }
        : {},
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "title"],
        },
      ],
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });

    res.json({ data: rows, total: count });
  } catch (err) {
    console.error("🔥 Lỗi chi tiết:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bình luận", error: err.message });
  }
};

exports.toggleVisibility = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await comments.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    const newStatus = comment.status === 1 ? 0 : 1;
    await comment.update({ status: newStatus });

    res.json({ message: "Cập nhật trạng thái thành công", status: newStatus });
  } catch (error) {
    console.error("🔥 Lỗi khi cập nhật trạng thái bình luận:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.getByProductId = async (req, res) => {
  try {
    const data = await comments.findAll({
      where: { product_id: req.params.id, status: 1 },
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy bình luận", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const comment = await comments.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: "Không tìm thấy bình luận" });

    await comment.update({ content: req.body.content });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.create = async (req, res) => {
  const { content, user_id, product_id } = req.body;
  try {
    const newComment = await comments.create({
      content,
      user_id,
      product_id,
      status: 1, // mặc định hiển thị
    });
    res.json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo bình luận", error: err.message });
  }
};
