const { Order, User, OrderDetail } = require("../../models");
const Product = require("../../models/product");
const Cart = require('../../models/cart');

exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const whereUser = search
            ? { name: { [Op.like]: `%${search}%` } }
            : {};

        const { rows, count } = await Order.findAndCountAll({
            attributes: ['id', 'status', 'final_price', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    where: whereUser
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.status(200).json({
            status: 200,
            message: "Lấy danh sách đơn hàng thành công",
            data: rows,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error,
        });
    }
};

exports.getOrderById = async (req, res) => {

    try {
        const order = await Order.findByPk(req.params.id, {
            attributes: ['id', 'status', 'final_price', 'createdAt'],
            include: [
                {
                    model: OrderDetail,
                    as: "order_details",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: ["id", "price"],
                        },
                    ],
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name",],
                },
            ],
        });

        if (!order)
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        res.json(order);
    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error });
    }
};


exports.createOrder = async (req, res) => {
    const {
        user_id,
        full_name,
        address,
        phone,
        email,
        payment_method,
        discount_amount = 0,
        final_price,
        promotion_id = null,
        items = []
    } = req.body;

    try {
        const order = await Order.create({
            user_id,
            full_name,
            address,
            phone,
            email,
            payment_method,
            status: "Chờ xác nhận",
            total_price: 0,
            discount_amount: Number(discount_amount) || 0,
            final_price: 0,
            promotion_id
        });

        const orderDetailsData = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            qty: item.quantity,
            price: Number(item.product_price) || 0
        }));

        if (orderDetailsData.some(item => item.price === 0)) {
            const productIds = items.map(i => i.product_id);
            const products = await Product.findAll({ where: { id: productIds } });
            orderDetailsData.forEach(item => {
                const product = products.find(p => p.id === item.product_id);
                if (product) item.price = product.price;
            });
        }

        await OrderDetail.bulkCreate(orderDetailsData);

        const totalPrice = orderDetailsData.reduce((sum, item) => {
            return sum + item.price * item.qty;
        }, 0);

        const finalPriceToSave = Number(final_price) || totalPrice;

        await order.update({
            total_price: totalPrice,
            discount_amount: Number(discount_amount) || 0,
            final_price: finalPriceToSave
        });

        const cartIds = items.map(i => i.cart_id);
        if (cartIds.length) {
            await Cart.destroy({ where: { id: cartIds } });
        }

        return res.status(201).json({
            message: "Tạo đơn hàng thành công",
            order_id: order.id
        });
    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);
        return res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error });
    }
};


exports.updateOrder = async (req, res) => {
    try {
        const updated = await Order.update(req.body, {
            where: { id: req.params.id },
        });
        res.json({ message: "Cập nhật đơn hàng thành công", updated });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng", error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        await Order.destroy({ where: { id: req.params.id } });
        res.json({ message: "Đã xóa đơn hàng" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa đơn hàng", error });
    }
};

exports.addOrderDetail = async (req, res) => {
    const { product_id, qty, price } = req.body;
    try {
        const detail = await OrderDetail.create({
            order_id: req.params.orderId,
            product_id,
            qty,
            price,
        });
        res.status(201).json(detail);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm chi tiết đơn hàng", error });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const details = await OrderDetail.findAll({
            where: { order_id: req.params.id },
            include: [{ model: Product, as: "product" }],
        });
        res.json(details);
    } catch (error) {
        console.error("🔥 Lỗi khi lấy chi tiết đơn hàng:", error); // 👉 log lỗi chi tiết
        res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error });
    }
};
exports.getOrderDetailsByUserId = async (req, res) => {
    const user_id = req.params.id;

    try {
        const orders = await Order.findAll({
            where: {
                user_id,
            },
            attributes: ['id', 'status', 'final_price', 'total_price', 'discount_amount', 'createdAt'],
            include: [
                {
                    model: OrderDetail,
                    as: "order_details",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: ["id", "title", "price"],
                        },
                    ],
                },
            ],
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "Không có đơn hàng 'Đã giao' nào" });
        }

        res.status(200).json({
            status: 200,
            message: "Lấy đơn hàng 'Đã giao' thành công",
            data: orders,
        });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng theo user_id:", error);
        res.status(500).json({
            message: "Lỗi server khi lấy chi tiết đơn hàng theo người dùng",
            error,
        });
    }
};

exports.cancelOrder = async (req, res) => {
    const orderId = req.params.id;
    const { cancellation_reason } = req.body;

    try {
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        if (order.status !== "Chờ xác nhận") {
            return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng đang chờ xác nhận" });
        }

        await Order.update(
            {
                status: "Đã hủy",
                cancellation_reason,
            },
            { where: { id: orderId } }
        );

        res.status(200).json({ message: "Đơn hàng đã được hủy thành công" });
    } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        res.status(500).json({ message: "Lỗi khi hủy đơn hàng", error });
    }
};
