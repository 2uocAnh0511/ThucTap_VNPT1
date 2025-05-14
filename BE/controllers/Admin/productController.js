const productModel = require("../../models/productsModel");
const categoryModel = require("../../models/categoryModel");
// const commentModel = require("../../models/commentModel"); // Đã mở lại
const { Op } = require('sequelize');

// [GET] /products - Lấy danh sách sản phẩm (join danh mục)
exports.products = async (req, res) => {
  try {
    const data = await productModel.findAll({
      include: [
        {
          model: categoryModel,
          as: "category",
          attributes: ["name"],
          // Nếu bạn chắc chắn bảng có `status` thì giữ dòng dưới:
          where: { status: 'active' }
        }
      ],
    });
    res.status(200).json({ data });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    res.status(500).json({ error: "Không thể lấy dữ liệu sản phẩm" });
  }
};


// [GET] /products/add - Lấy danh mục để tạo sản phẩm
exports.addproducts = async (req, res) => {
  try {
    const categories = await categoryModel.findAll({
      where: { status: 'active' },
      attributes: ["id", "name"]
    });
    res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    res.status(500).json({ error: "Không thể lấy danh mục" });
  }
};

// [POST] /products - Tạo sản phẩm mới
exports.create = async (req, res) => {
  try {
    const { name, price, short_description, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await productModel.create({
      title: name,
      price,
      short_description,
      category_id,
      image,
    });

    res.status(201).json({ message: "Tạo sản phẩm thành công!", product });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// [GET] /products/edit/:id - Lấy dữ liệu sản phẩm để chỉnh sửa
exports.editproductsbyId = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm để chỉnh sửa:", error);
    res.status(500).json({ error: "Lỗi server!" });
  }
};

// [PUT] /products/:id - Cập nhật sản phẩm
exports.postEditProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, short_description, category_id, status } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updateData = {
      title: name,
      price,
      short_description,
      category_id,
      status, // 👈 Thêm dòng này
    };

    if (image) {
      updateData.image = image;
    }

    const updated = await productModel.update(updateData, {
      where: { id: productId },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật!" });
    }

    const updatedProduct = await productModel.findByPk(productId);
    res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// [DELETE] /products/:id - Xóa sản phẩm
exports.delete = async (req, res) => {
  try {
    const productId = req.params.id;

    // Xóa các bản ghi trong bảng carts tham chiếu đến sản phẩm
    await cartModel.destroy({
      where: { product_id: productId }
    });

    // Sau khi xóa các bản ghi trong carts, tiếp tục xóa sản phẩm
    const deleted = await productModel.destroy({
      where: { id: productId }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa." });
    }

    res.status(200).json({ message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


// [GET] /products/:id - Lấy chi tiết sản phẩm
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const currentProduct = await productModel.findByPk(id, {
      include: [
        {
          model: categoryModel,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!currentProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).json(currentProduct);
  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
