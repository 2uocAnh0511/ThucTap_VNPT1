const {Cart , Product, OrderDetail } = require("../../models");


// Lấy toàn bộ giỏ hàng (kèm thông tin sản phẩm)
exports.getCartByUserId = async (req, res) => {
    const  userId  = req.params.id;

    try {
        const carts = await Cart.findAll({
            where: { user_id: userId },
            include: [{ model: Product, as: 'product' }]
        });

        res.json({ data: carts });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng theo user_id', error });
    }
};


// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
    const { product_id, qty, user_id } = req.body;
    console.log("Body nhận được:", req.body);

    try {
        // Kiểm tra số lượng phải là số dương
        if (!Number.isInteger(qty) || qty <= 0) {
            return res.status(400).json({ message: 'Số lượng không hợp lệ' });
        }

        // Tìm sản phẩm
        const product = await Product.findByPk(product_id);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Kiểm tra tồn kho
        if (product.stock < qty) {
            return res.status(400).json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });
        }

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng thì cộng dồn số lượng
        const existingItem = await Cart.findOne({
            where: { user_id, product_id }
        });

        if (existingItem) {
            existingItem.qty += qty;
            await existingItem.save();
            return res.status(200).json({ message: 'Đã cập nhật số lượng trong giỏ hàng', cartItem: existingItem });
        }

        // Nếu chưa có thì thêm mới
        const cartItem = await Cart.create({ product_id, qty, user_id, price: product.price });

        res.status(201).json({ message: 'Đã thêm vào giỏ hàng', cartItem });
    } catch (error) {
        console.error("Lỗi thêm vào giỏ hàng:", error);
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng', error });
    }
};


// Xóa 1 sản phẩm khỏi giỏ
exports.deleteCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        await Cart.destroy({ where: { id } });
        res.json({ message: 'Đã xóa khỏi giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa khỏi giỏ hàng', error });
    }
};

// Cập nhật số lượng
exports.updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { qty } = req.body;

    try {
        await Cart.update({ qty }, { where: { id } });
        res.json({ message: 'Đã cập nhật số lượng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng', error });
    }
};
