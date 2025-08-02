const { DataTypes } = require("sequelize");
const sequelize = require("./database"); // Cập nhật đúng đường dẫn tới database

// Định nghĩa model Order
const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Bạn có thể thêm ràng buộc để tham chiếu tới bảng User nếu cần
        // references: {
        //     model: 'users',
        //     key: 'id'
        // }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Chờ xác nhận", // Giá trị mặc định là "Đã xác nhận"
    },
    total_price: { // Trường này lưu tổng giá trị đơn hàng
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00, // Giá trị mặc định là 0
    }
}, {
    tableName: "orders", // Tên bảng trong cơ sở dữ liệu
    timestamps: true, // Không sử dụng timestamps (createdAt, updatedAt)
});

// Xuất model để sử dụng ở các nơi khác trong ứng dụng
module.exports = Order;
