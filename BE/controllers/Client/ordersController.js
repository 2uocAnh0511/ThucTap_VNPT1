const OrderModel = require("../../models/ordersModel");
const OrderDetail = require("../../models/orderDetailsModel");
const UserModel = require("../../models/usersModel");
const CartModel = require("../../models/cartsModel");
const PromotionModel = require("../../models/promotionsModel");

// const requestIp = require('request-ip');
// const moment = require('moment');
const { Op } = require("sequelize");
const sequelize = require('../../config/database');

require("dotenv").config();
const nodemailer = require("nodemailer");

class OrderController {

    static async get(req, res) {
        const userId = req.user.id;

        const { page = 1, limit = 10, status, startDate, endDate } = req.query;

        const currentPage = parseInt(page, 10);
        const perPage = parseInt(limit, 10);
        const offset = (currentPage - 1) * perPage;

        try {
            const whereClause = {
                user_id: userId,
            };

            if (startDate || endDate) {
                whereClause.created_at = {};

                if (startDate) {
                    whereClause.created_at[Op.gte] = new Date(startDate);
                }

                if (endDate) {
                    const endOfDay = new Date(endDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    whereClause.created_at[Op.lte] = endOfDay;
                }
            }

            if (status && status !== "all") {
                whereClause.status = status;
            }

            const { count, rows } = await OrderModel.findAndCountAll({
                where: whereClause,
                include: [{ model: UserModel, as: "user" }],
                order: [["created_at", "DESC"]],
                offset,
                limit: perPage,
            });

            const filteredOrders = await OrderModel.findAll({
                where: whereClause,
                include: [{ model: UserModel, as: "user" }],
                order: [["created_at", "DESC"]],
            });

            const statusCounts = {
                all: filteredOrders.length,
                pending: 0,
                confirmed: 0,
                shipping: 0,
                completed: 0,
                delivered: 0,
                cancelled: 0
            };

            filteredOrders.forEach(order => {
                if (statusCounts.hasOwnProperty(order.status)) {
                    statusCounts[order.status]++;
                }
            });

            res.status(200).json({
                status: 200,
                message: "Lấy danh sách thành công",
                data: rows,
                pagination: {
                    totalItems: count,
                    currentPage,
                    totalPages: Math.ceil(count / perPage),
                },
                statusCounts
            });
        } catch (error) {
            console.error(
                "Lỗi khi lấy danh sách đơn hàng:",
                error.message,
                error.stack
            );
            res.status(500).json({
                success: false,
                message: "Lỗi máy chủ.",
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                status,
                address,
                phone,
                email,
                total_price,
                payment_method_id,
            } = req.body;

            const order = await OrderModel.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: "Id không tồn tại" });
            }

            const previousStatus = order.status;

            if (name !== undefined) order.name = name;
            if (status !== undefined) order.status = status;
            if (address !== undefined) order.address = address;
            if (phone !== undefined) order.phone = phone;
            if (email !== undefined) order.email = email;
            if (total_price !== undefined) order.total_price = total_price;
            if (payment_method_id !== undefined)
                order.payment_method_id = payment_method_id;

            await order.save();

            if (previousStatus !== "cancelled" && status === "cancelled") {
                const user = await UserModel.findByPk(order.user_id);
                if (user && user.email) {
                    await this.sendOrderCancellationEmail(order, user, user.email, cancellation_reason);
                }
            }

            res.status(200).json({
                status: 200,
                message: "Cập nhật thành công",
                data: order,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async cancelOrder(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { cancellation_reason } = req.body;

            const order = await OrderModel.findByPk(id);

            if (!order) {
                return res.status(404).json({ message: "Id không tồn tại" });
            }

            if (order.status !== "pending") {
                return res.status(400).json({
                    message: "Chỉ được hủy đơn hàng có trạng thái là 'Chờ xác nhận'",
                });
            }

            const orderDetails = await OrderDetail.findAll({
                where: { order_id: order.id },
                transaction: t
            });

            for (const detail of orderDetails) {
                const productVariant = await ProductVariantModel.findByPk(detail.product_variant_id, {
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });

                if (productVariant) {
                    productVariant.stock += detail.quantity;
                    await productVariant.save({ transaction: t });
                }
            }

            const promo = await PromotionModel.findByPk(order.promotion_id);
            if (promo) {
                await promo.increment('quantity', { transaction: t });

                if (promo.special_promotion) {
                    await PromotionUser.update(
                        { used: false },
                        {
                            where: {
                                promotion_id: promo.id,
                                user_id: order.user_id
                            },
                            transaction: t
                        }
                    );
                }
            }

            order.status = "cancelled";
            order.cancellation_reason = cancellation_reason || null;
            await order.save({ transaction: t });

            const user = await UserModel.findByPk(order.user_id);

            await OrderController.sendOrderCancellationEmail(
                order,
                user,
                user?.email || "no-reply@example.com",
                cancellation_reason
            );

            await t.commit();

            res.status(200).json({
                status: 200,
                message: "Hủy đơn hàng thành công",
                data: order,
            });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ error: error.message });
        }
    }

    static async sendOrderCancellationEmail(order, user, customerEmail, cancellationReason) {
        try {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const formattedDate = new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                hour12: false,
            });

            const formattedTotal = new Intl.NumberFormat("vi-VN").format(order.total_price);
            const formattedDiscount = new Intl.NumberFormat("vi-VN").format(order.discount_amount || 0);

            const htmlContent = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8" />
                <title>Hủy đơn hàng</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background: #f5f5f5;
                        padding: 20px;
                        color: #333;
                    }
                    .container {
                        max-width: 500px;
                        margin: auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #d32f2f;
                        margin-bottom: 16px;
                    }
                    .info {
                        font-size: 14px;
                        margin-bottom: 12px;
                    }
                    .info span {
                        font-weight: bold;
                    }
                    .reason {
                        font-style: italic;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="title">Đơn hàng của bạn đã bị hủy</div>
    
                    <div class="info"><span>Mã đơn hàng:</span> #${order.order_code}</div>
                    <div class="info"><span>Khách hàng:</span> ${user?.name || "Không xác định"}</div>
                    <div class="info"><span>Email:</span> ${user?.email || customerEmail}</div>
                    <div class="info"><span>Ngày hủy:</span> ${formattedDate}</div>
                    <div class="info"><span>Tổng tiền:</span> ${formattedTotal}₫</div>
    
                    ${order.discount_amount > 0
                    ? `<div class="info"><span>Giảm giá:</span> -${formattedDiscount}₫</div>`
                    : ""
                }
    
                    <div class="info"><span>Lý do hủy:</span> <span class="reason">${cancellationReason || "Không có lý do cụ thể"}</span></div>
    
                    <p style="margin-top: 20px; font-size: 13px; color: #777;">
                        Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ lại với chúng tôi. Cảm ơn bạn đã sử dụng dịch vụ.
                    </p>
                </div>
            </body>
            </html>
            `;

            const mailOptions = {
                from: `"Cửa hàng của bạn" <${process.env.EMAIL_USER}>`,
                to: customerEmail,
                subject: `Hủy đơn hàng #${order.order_code}`,
                html: htmlContent
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Lỗi gửi email hủy đơn hàng (chi tiết):", error);
            throw new Error("Không thể gửi email hủy đơn hàng.");
        }
    }

    static async confirmDelivered(req, res) {
        try {
            const { id } = req.params;

            const order = await OrderModel.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }

            if (order.status !== "delivered") {
                return res.status(400).json({
                    message: "Chỉ được xác nhận giao hàng cho đơn hàng có trạng thái 'Đã giao hàng thành công'",
                });
            }

            order.status = "completed";
            await order.save();

            res.status(200).json({
                status: 200,
                message: "Xác nhận giao hàng thành công",
                data: order,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        const {
            products,
            user_id,
            name,
            phone,
            email,
            address,
            payment_method,
            promotion,
            note,
            promo_discount,
            voucher_discount,
            promotion_user_id
        } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống." });
        }

        if (!user_id) {
            return res.status(400).json({ message: "Thiếu user_id trong yêu cầu." });
        }

        const t = await sequelize.transaction();
        try {
            let totalPrice = 0;
            const detailedCart = [];

            for (const item of products) {
                const variant = item.variant;
                if (!variant) {
                    await t.rollback();
                    return res.status(400).json({ message: "Thông tin biến thể sản phẩm bị thiếu." });
                }

                const productVariant = await ProductVariantModel.findByPk(variant.id, {
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                });

                if (!productVariant) {
                    await t.rollback();
                    return res.status(400).json({ message: `Biến thể sản phẩm với ID ${variant.id} không tồn tại.` });
                }

                if (productVariant.stock < item.quantity) {
                    await t.rollback();
                    return res.status(400).json({ message: `Sản phẩm ${variant.sku} không đủ số lượng tồn kho.` });
                }

                const price = parseFloat(variant.price);
                totalPrice += price * item.quantity;

                detailedCart.push({
                    variant: variant.id,
                    name: variant.sku,
                    price: price,
                    quantity: item.quantity,
                    total: price * item.quantity,
                });

                productVariant.stock -= item.quantity;
                await productVariant.save({ transaction: t });
            }

            let selectedVoucher = null;
            let promoUser = null;
            let specialDiscount = parseFloat(promo_discount) || 0;
            let discountAmount = 0;

            if (promotion) {
                selectedVoucher = await PromotionModel.findByPk(promotion, { transaction: t, lock: t.LOCK.UPDATE });

                if (selectedVoucher) {
                    const now = new Date();
                    if (
                        selectedVoucher.status !== 'active' ||
                        now < selectedVoucher.start_date ||
                        now > selectedVoucher.end_date ||
                        selectedVoucher.quantity <= 0 ||
                        totalPrice < selectedVoucher.min_price_threshold
                    ) {
                        await t.rollback();
                        return res.status(400).json({ message: "Mã khuyến mãi không hợp lệ hoặc không đủ điều kiện." });
                    }

                    if (selectedVoucher && promotion_user_id) {
                        promoUser = await PromotionUserModel.findOne({
                            where: {
                                id: parseInt(promotion_user_id),
                                user_id,
                                email_sent: true,
                                used: { [Op.not]: true },
                            },
                            transaction: t,
                            lock: t.LOCK.UPDATE,
                        });

                        if (!promoUser) {
                            await t.rollback();
                            return res.status(403).json({ message: "Bạn không đủ điều kiện sử dụng mã khuyến mãi." });
                        }

                        promoUser.used = true;
                        await promoUser.save({ transaction: t });
                    }

                    totalPrice -= discountAmount;
                    selectedVoucher.quantity -= 1;
                    await selectedVoucher.save({ transaction: t });
                }
            }

            if (specialDiscount > 0) {
                specialDiscount = Math.min(specialDiscount, totalPrice);
                totalPrice -= specialDiscount;
            }

            let voucherDiscount = parseFloat(voucher_discount) || 0;
            if (voucherDiscount > 0) {
                voucherDiscount = Math.min(voucherDiscount, totalPrice);
                totalPrice -= voucherDiscount;
            }

            const order_code = `ORD-${Date.now()}`;
            const currentDateTime = new Date(Date.now() + 7 * 60 * 60 * 1000);

            const newOrder = await OrderModel.create({
                user_id,
                promotion_id: promotion || null,
                promotion_user_id: promoUser?.id || parseInt(promotion_user_id) || null,
                name,
                phone,
                email,
                address,
                total_price: totalPrice,
                payment_method: "COD",
                order_code,
                shipping_address: address,
                note: note,
                status: "pending",
                cancellation_reason: note || null,
                discount_amount: voucherDiscount || 0,
                special_discount_amount: specialDiscount || 0
            }, { transaction: t });

            const orderDetails = detailedCart.map((item) => ({
                order_id: newOrder.id,
                product_variant_id: item.variant,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderDetail.bulkCreate(orderDetails, { transaction: t });

            await t.commit();

            await OrderController.sendOrderConfirmationEmail(
                newOrder,
                { name, phone },
                products,
                email,
                currentDateTime
            );

            const successfullyOrderedProductIds = products.map(p => p.variant.id);

            return res.status(201).json({
                success: true,
                message: "Đặt hàng thành công.",
                data: {
                    order: newOrder,
                    successfullyOrderedProductIds,
                    promotion_user_id: promotion_user_id || null
                },
            });
        } catch (error) {
            await t.rollback();
            console.error("Lỗi khi tạo đơn hàng:", error.message);
            return res.status(500).json({
                success: false,
                message: "Lỗi máy chủ khi tạo đơn hàng.",
                error: error.message,
            });
        }
    }

    static async sendOrderConfirmationEmail(order, user, products, customerEmail, currentDateTime) {
        try {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const currentDateTimeUTC = new Date();
            const formattedDate = currentDateTimeUTC.toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                hour12: false,
            });
            const formattedPrice = new Intl.NumberFormat("vi-VN").format(
                order.total_price
            );

            const productsHTML = products.map(item => {
                const variant = item.variant;
                const productName = variant?.product?.name || "Sản phẩm không xác định";
                const price = new Intl.NumberFormat("vi-VN").format(variant?.price || 0);
                const imageUrl = variant?.images?.[0]?.image_url;
                const attributeValues = variant?.attributeValues ?? [];
                const attributes = Array.isArray(attributeValues) ? attributeValues.map(attr => attr.value).join(' - ') : 'Không xác định';

                return `
            <div class="product">
                <img src="${imageUrl}" alt="${productName}">
                <div class="product-info">
                <p style="margin-left: 10px;"><strong>${productName} (${attributes})</strong></p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-left: 10px; margin-top: 4px;">
                    <span style="font-size: 14px;">${price}₫</span>
                <span style="font-size: 13px; color: #555; margin-left: auto;">×${item.quantity}</span>
                </div>
                </div>
            </div>
            `;
            }).join('');

            const subtotal = products.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
            const discount = order.discount_amount || 0;
            const total = subtotal - discount;

            const htmlContent = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Xác nhận đơn hàng</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f5f5f5;
                    padding: 20px;
                    color: #333;
                }
                .order-container {
                    max-width: 400px;
                    margin: auto;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    padding: 16px;
                }
                .shop-name {
                    font-weight: bold;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 12px;
                }
                .product {
                    display: flex;
                    gap: 10px;
                    margin: 16px 0;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 16px;
                }
                .product img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .product-info {
                    flex-grow: 1;
                    font-size: 13px;
                }
                .price {
                    font-weight: bold;
                    font-size: 14px;
                    margin-top: 4px;
                }
                .summary {
                    margin-top: 20px;
                }
                .summary-title {
                    font-weight: bold;
                    margin-bottom: 10px;
                    font-size: 15px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    margin: 6px 0;
                }
                .total {
                    font-weight: bold;
                    font-size: 15px;
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                }
                .discount {
                    color: #008000;
                }
            </style>
        </head>
        <body>
            <div class="order-container">

                ${productsHTML}

                <div style="border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 8px;">
                        <span style="color: #666;">Mã đơn hàng:</span>
                        <span style="font-size: 13px; color: #555; margin-left: auto;"">${order.order_code}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 8px;">
                        <span style="color: #666;">Ngày đặt hàng:</span>
                        <span style="font-size: 13px; color: #555; margin-left: auto;"">${formattedDate}</span>
                    </div>
                </div>

                <div class="summary">
                    <div class="summary-title">Tóm tắt kiện hàng</div>

                    <div class="summary-row">
                        <span>Tổng phụ</span>
                        <span style="font-size: 13px; color: #555; margin-left: auto;">${new Intl.NumberFormat("vi-VN").format(subtotal)}₫</span>
                    </div>

                    ${discount > 0 ? `
                    <div class="summary-row">
                        <span>Phiếu giảm giá</span>
                        <span style="font-size: 13px; color: #555; margin-left: auto;">- ${new Intl.NumberFormat("vi-VN").format(discount)}₫</span>
                    </div>
                    ` : ''}

                    <div class="summary-row total">
                        <span>Tổng (${products.length} mặt hàng)</span>
                        <span style="font-size: 13px; color: #555; margin-left: auto;">${new Intl.NumberFormat("vi-VN").format(total)}₫</span>
                    </div>
                </div>
                <div style="margin-top: 24px;">
                <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 16px">Địa chỉ vận chuyển</div>
                <div style="font-size: 14px; color: #333;">
                    <div>Họ và tên: ${user?.name || "Tên không xác định"}</div>
                    <div>Số điện thoại: (+84)${(user?.phone || "")}</div>
                    <div>Địa chỉ: ${order?.shipping_address || "Địa chỉ không có"}</div>
                </div>
            </div>
            </div>
        </body>
        </html>
        `;

            const mailOptions = {
                from: `"Cửa hàng của bạn" <${process.env.EMAIL_USER}>`,
                to: customerEmail,
                subject: `Xác nhận đơn hàng #${order.order_code}`,
                html: htmlContent
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Lỗi gửi email xác nhận đơn hàng:", error);
            throw new Error("Không thể gửi email xác nhận đơn hàng.");
        }
    }
}

module.exports = OrderController;