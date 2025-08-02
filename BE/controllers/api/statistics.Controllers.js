const Sequelize = require('sequelize');
const Product = require('../../models/product');
const Category = require('../../models/category');

const getProductStatistics = async (req, res) => {
  try {
    console.log('👉 Bắt đầu thống kê');

    // Tổng số sản phẩm
    const total = await Product.count();
    console.log('✅ Tổng sản phẩm:', total);

    // Thống kê theo danh mục
    const byCategory = await Product.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'count'],
      ],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name']
      }],
      where: Sequelize.or(
        { '$category.name$': { [Sequelize.Op.ne]: null } },  // Lọc sản phẩm có danh mục
        { '$category.name$': null }  // Bao gồm sản phẩm không có danh mục
      ),
      group: ['category.id'],
      raw: true
    });
    console.log('✅ Thống kê theo danh mục:', byCategory);

    // Định dạng lại thống kê theo danh mục
    const formattedCategoryStats = byCategory.map(item => ({
      category: item['category.name'],
      count: item['count']
    }));

    // Trả về kết quả mà không sử dụng inStock, outOfStock
    res.json({
      total,
      byCategory: formattedCategoryStats
    });

  } catch (error) {
    console.error('❌ Lỗi khi thống kê sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi thống kê' });
  }
};

module.exports = {
  getProductStatistics
};
