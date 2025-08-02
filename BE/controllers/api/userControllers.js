// controllers/api/userControllers.js
const userModel = require('../../models/user');
const { Sequelize, Op } = require('sequelize');

exports.getStatusCounts = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    const allCount = await userModel.count({ where });
    const activeCount = await userModel.count({
      where: { ...where, status: 1 },
    });
    const blockedCount = await userModel.count({
      where: { ...where, status: 0 },
    });
    res.json({
      all: allCount,
      active: activeCount,
      blocked: blockedCount,
    });
  } catch (err) {
    console.error('Error in getStatusCounts:', err);
    res.status(500).json({ error: err.message || 'Lỗi server khi lấy số lượng trạng thái' });
  }
};

// Lấy danh sách có phân trang, tìm kiếm, lọc status
exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search = '', status } = req.query;

    // Build điều kiện WHERE
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status === '1' || status === '0') {
      where.status = status;
    }

    const { rows, count } = await userModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    res.json({
      data: rows,
      total: count,
    });
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  const user = await userModel.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.toggleStatus = async (req, res, next) => {
  const user = await userModel.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = user.status === 1 ? 0 : 1;
  await user.save();
  res.json({ message: 'Đổi trạng thái thành công', status: user.status });
};

// Không cho phép create/update/delete
exports.create = (req, res) => {
  res.status(403).json({ error: 'Không được phép tạo mới người dùng' });
};
exports.update = (req, res) => {
  res.status(403).json({ error: 'Không được phép chỉnh sửa người dùng' });
};
exports.delete = (req, res) => {
  res.status(403).json({ error: 'Không được phép xóa người dùng' });
};


