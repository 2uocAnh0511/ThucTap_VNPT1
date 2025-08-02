const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
const commentModel = require("../../models/comment");
const { Op } = require('sequelize');
exports.home = (req, res, next) => {
  res.render("Admin/Home");
};

exports.products = async (req, res) => {
  try {
    const data = await productModel.findAll({
      include: [
        {
          model: categoryModel,
          as: "category",
          attributes: ["name"],
          where: { status: 0 }, // Lọc category có status = 0
        },
      ],
    });
    res.json({ data });
  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ error: "Không thể lấy dữ liệu sản phẩm" });
  }
};


exports.editproductsbyId = async (req, res, next) => {
  try {
    const productId = req.params.id; // Lấy productId từ tham số URL
    const product = await productModel.findOne({ where: { id: productId } });
    return res.status(200).json({ message: "Cập nhật sản phẩm thành công!", product });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};



exports.postEditProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const productId = req.params.id;
    // Cập nhật sản phẩm
    const updated = await productModel.update(data, {
      where: { id: productId },
    });

    if (updated === 0) {
      return res.status(500).json({ message: "Không tìm thấy sản phẩm để cập nhật!" });
    }
    // Lấy lại sản phẩm đã cập nhật để trả về
    const updatedProduct = await productModel.findOne({ where: { id: productId } });
    res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};



exports.addproducts = async (req, res, next) => {
  try {
    const categories = await categoryModel.findAll();
    res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Lỗi lấy danh sách danh mục:", error);
    res.status(500).send("Lỗi server");
  }
};
exports.create = async (req, res) => {
  console.log(req.body);
  
  try {
    const { name, price, short_description, category_id, image } = req.body;
    const product = await productModel.create({
      title: name,
      price,
      short_description,
      category_id,
      image
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error.message, error);
    res.status(500).send(`Server error: ${error.message}`);
  }
};



exports.delete = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log("Deleting product:", productId);
    await commentModel.destroy({
      where: { product_id: productId }
    });
    const deleted = await productModel.destroy({
      where: { id: productId }
    });

    if (deleted) {
      return res.status(200).json({ message: "Xóa thành công!" });
    } else {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa." });
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};



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


