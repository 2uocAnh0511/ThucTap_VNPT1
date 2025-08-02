const categoryModel = require('../../models/category');
const productModel = require("../../models/product");

const Sequelize = require('sequelize');
const { Op } = require('sequelize');



exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const whereCondition = search
            ? {
                name: {
                    [Op.like]: `%${search}%`,
                },
            }
            : {};

        const { rows, count } = await categoryModel.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["id", "DESC"]],
        });

        res.json({
            data: rows,
            total: count,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

exports.detail = async (req, res, next) => {
    const category = await categoryModel.findByPk(req.params.id)
    res.json(category);
};

exports.create = async (req, res, next) => {
    try {
        const body = req.body;
        console.log(body);

        // Kiểm tra xem tên danh mục đã tồn tại chưa
        const existingCategory = await categoryModel.findOne({
            where: { name: body.name }
        });

        if (existingCategory) {
            return res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
        }

        const category = await categoryModel.create(body);
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi server' });
    }
};


exports.update = async (req, res, next) => {
    try {
        const data = req.body;
        const id = req.params.id;

        const existing = await categoryModel.findOne({
            where: {
                name: data.name,
                id: { [Op.ne]: id }
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
        }

        const result = await categoryModel.update(data, {
            where: { id }
        });

        res.json({ message: 'Cập nhật thành công', result });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật danh mục' });
    }
};


exports.delete = async (req, res, next) => {
    const categoryId = req.params.id;

    try {
        // Bước 1: Xóa tất cả sản phẩm liên quan đến category_id
        await productModel.destroy({
            where: {
                category_id: categoryId
            }
        });

        // Bước 2: Xóa danh mục
        const category = await categoryModel.destroy({
            where: {
                id: categoryId
            }
        });

        if (category) {
            res.json({ message: 'Danh mục và các sản phẩm liên quan đã bị xóa thành công.' });
        } else {
            res.status(404).json({ message: 'Danh mục không tồn tại.' });
        }

    } catch (error) {
        console.error("Lỗi khi xóa danh mục và sản phẩm:", error);
        res.status(500).json({ message: 'Lỗi khi xóa danh mục và sản phẩm.' });
    }
};


