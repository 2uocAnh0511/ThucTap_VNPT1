const CartModel = require('../../models/cartsModel');
const ProductModel = require('../../models/productsModel');
const PromotionProductModel = require('../../models/promotionProductsModel');
const PromotionModel = require('../../models/promotionsModel');

const { Op } = require('sequelize');

class CartController {
    static async getCartByUser(req, res) {
        try {
            // const userId = req.user.id;
            const userId = 1;
            const count = await CartModel.sum('quantity', { where: { user_id: userId } });

            const cartItems = await CartModel.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: ProductModel,
                        as: 'product',
                        attributes: ['id', 'title', 'price', 'image']
                    }
                ],
                order: [['id', 'DESC']]
            });

            const processedCartItems = cartItems.map(item => {
                const itemJson = item.toJSON();
                const product = itemJson.product;

                product.promotion = {
                    discounted_price: parseFloat(product.price) || 0,
                    discount_percent: 0,
                    meets_conditions: true,
                };

                return itemJson;
            });

            res.status(200).json({
                status: 200,
                message: `Lấy giỏ hàng của người dùng ${userId} thành công`,
                data: processedCartItems,
                count
            });
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi máy chủ",
                error: error.message
            });
        }
    }


    static async addToCart(req, res) {
        try {
            const { userId, products, quantity } = req.body;

            console.log('Request body:', req.body);

            // Validate inputs
            if (!userId || !products || !quantity) {
                return res.status(400).json({
                    status: 400,
                    message: 'Thiếu userId, products hoặc quantity trong request body'
                });
            }

            // Validate quantity
            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    status: 400,
                    message: 'Số lượng phải là số nguyên dương'
                });
            }

            // Lấy thông tin sản phẩm
            const product = await ProductModel.findOne({
                where: { id: products },
                attributes: ['id', 'title', 'price', 'image']
            });

            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: `Không tìm thấy sản phẩm với ID ${products}`
                });
            }

            // Tìm sản phẩm trong giỏ hàng
            let cartItem = await CartModel.findOne({
                where: {
                    user_id: userId,
                    product_id: products
                }
            });

            const currentQuantity = cartItem ? cartItem.quantity : 0;
            const totalQuantity = currentQuantity + quantity;

            if (cartItem) {
                cartItem.quantity = totalQuantity;
                cartItem.price = parseFloat(product.price);
                cartItem.total_price = parseFloat(product.price) * totalQuantity;
                await cartItem.save();
            } else {
                cartItem = await CartModel.create({
                    user_id: userId,
                    product_id: products,
                    quantity,
                    price: parseFloat(product.price),
                    total_price: parseFloat(product.price) * quantity
                });
            }

            const fullCartItem = await CartModel.findOne({
                where: { id: cartItem.id },
                include: [
                    {
                        model: ProductModel,
                        as: 'product',
                        attributes: ['id', 'title', 'price', 'image']
                    }
                ]
            });

            return res.status(200).json({
                status: 200,
                message: 'Thêm vào giỏ hàng thành công',
                data: fullCartItem
            });
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi máy chủ",
                error: error.message
            });
        }
    }


    static async updateCartItem(req, res) {
        try {
            // const userId = req.user.id;
            const userId = 1;
            const { productId } = req.params;
            const { quantity } = req.body;

            // Validate quantity
            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    status: 400,
                    message: 'Số lượng phải là số nguyên dương'
                });
            }

            const item = await CartModel.findOne({
                where: {
                    user_id: userId,
                    product_id: productId
                }
            });

            if (!item) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy sản phẩm trong giỏ hàng"
                });
            }

            const product = await ProductModel.findOne({
                where: { id: productId },
                attributes: ['price']
            });

            item.quantity = quantity;
            item.price = parseFloat(product.price); // Update price
            await item.save(); // Hooks will calculate total_price

            const fullItem = await CartModel.findOne({
                where: { id: item.id },
                include: [
                    {
                        model: ProductModel,
                        as: 'product',
                        attributes: ['id', 'title', 'price', 'image']
                    }
                ]
            });

            res.status(200).json({
                status: 200,
                message: 'Cập nhật số lượng thành công',
                data: fullItem
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi máy chủ",
                error: error.message
            });
        }
    }

    static async removeCartItem(req, res) {
        try {
            const { productId } = req.params;
            // const userId = req.user.id;
            const userId = 1;

            const deleted = await CartModel.destroy({
                where: {
                    user_id: userId,
                    product_id: productId
                }
            });

            if (!deleted) {
                return res.status(404).json({
                    status: 404,
                    message: "Không tìm thấy sản phẩm trong giỏ hàng để xóa"
                });
            }

            const remainingItems = await CartModel.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: ProductModel,
                        as: 'product',
                        attributes: ['id', 'title', 'price', 'image']
                    }
                ],
                order: [['id', 'DESC']]
            });

            res.status(200).json({
                status: 200,
                message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
                data: remainingItems
            });
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi máy chủ",
                error: error.message
            });
        }
    }

    static async clearCartByUser(req, res) {
        try {
            const userId = req.user.id;

            const deleted = await CartModel.destroy({
                where: {
                    user_id: userId
                }
            });

            res.status(200).json({
                status: 200,
                message: `Đã xóa toàn bộ giỏ hàng của người dùng ${userId}`,
                deletedCount: deleted
            });
        } catch (error) {
            console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
            res.status(500).json({
                status: 500,
                message: "Lỗi máy chủ",
                error: error.message
            });
        }
    }
}

module.exports = CartController;