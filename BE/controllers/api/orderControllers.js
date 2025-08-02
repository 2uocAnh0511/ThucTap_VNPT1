
const { Order, User, OrderDetail } = require("../../models");

const Product = require("../../models/product");
const Cart = require('../../models/cart');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                }
            ]
        });

        res.status(200).json({
            status: 200,
            message: "Lấy danh sách đơn hàng thành công",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error
        });
    }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    
        try {
          const order = await Order.findByPk(req.params.id, {
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
                model: User, // Thêm phần này để lấy thông tin người dùng
                as: "user",  // Đảm bảo đúng alias nếu có đặt alias trong quan hệ
                attributes: ["id", "name",], // Các trường cần lấy
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


// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
    const { user_id } = req.body;

    try {
        // B1: Tạo đơn hàng mới chưa có tổng tiền
        const order = await Order.create({ user_id, status: "Chờ xác nhận" });

        // B2: Lấy toàn bộ giỏ hàng của user kèm thông tin sản phẩm
        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [{ model: Product, as: 'product' }]
        });

        // B3: Chuẩn bị dữ liệu order_details từ giỏ hàng
        const orderDetailsData = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            qty: item.qty,
            price: item.product.price // Lưu giá sản phẩm tại thời điểm đặt hàng
        }));

        // B4: Tạo dữ liệu trong bảng order_details
        await OrderDetail.bulkCreate(orderDetailsData);

        // B5: Tính tổng giá trị đơn hàng từ order_details (price * qty)
        const orderDetails = await OrderDetail.findAll({
            where: { order_id: order.id },
            attributes: ['price', 'qty']
        });

        const totalPrice = orderDetails.reduce((sum, item) => {
            return sum + item.price * item.qty;
        }, 0);

        // B6: Cập nhật tổng tiền vào bảng orders
        await Order.update({ total_price: totalPrice }, { where: { id: order.id } });

        // B7 (tùy chọn): Xoá giỏ hàng sau khi đặt hàng
        await Cart.destroy({ where: { user_id } });

        res.status(201).json({ message: "Tạo đơn hàng thành công", order });
    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);
        res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error });
    }
};







// Cập nhật đơn hàng
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

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        await Order.destroy({ where: { id: req.params.id } });
        res.json({ message: "Đã xóa đơn hàng" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa đơn hàng", error });
    }
};

// Thêm chi tiết đơn hàng
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

// Lấy chi tiết đơn hàng
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
                status: "Đã giao" ,
            },
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
