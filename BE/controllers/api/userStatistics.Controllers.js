const User = require('../../models/user');

const getUserStatistics = async (req, res) => {
  try {
    console.log('👉 Bắt đầu thống kê người dùng');

    const total = await User.count();
    console.log('✅ Tổng số người dùng:', total);

    const byRole = await User.findAll({
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    console.log('✅ Thống kê theo vai trò:', byRole);

    res.json({
      total,
      byRole
    });
  } catch (error) {
    console.error('❌ Lỗi khi thống kê người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi thống kê người dùng' });
  }
};

module.exports = {
  getUserStatistics
};
