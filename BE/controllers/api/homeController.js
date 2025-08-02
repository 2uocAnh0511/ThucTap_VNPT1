// BE/controllers/api/homeController.js
const categoryModel = require('../../models/category');
const productModel  = require('../../models/product');

// BE/controllers/api/homeController.js
exports.getHome = async (req, res) => {
  try {
    // 1) categories
    const categories = await categoryModel.findAll({
      where: { status: 0 },
      limit: 8,
      order: [['id', 'ASC']],
    });

    // 2) collections — 4 sản phẩm “mới nhất” theo id
    const collections = await productModel.findAll({
      attributes: ['id','title','image','short_description'],
      order: [['id', 'DESC']],    // ← sửa ở đây
      limit: 4,
    });

    // 3) featuredProducts — 4 sản phẩm nổi bật (cũng theo id nếu không có field sold)
    const featuredProducts = await productModel.findAll({
      attributes: ['id','title','image','price'],
      order: [['id', 'DESC']],    // ← và ở đây
      limit: 4,
    });

    return res.status(200).json({ categories, collections, featuredProducts });
  } catch (error) {
    console.error('Home API error:', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

