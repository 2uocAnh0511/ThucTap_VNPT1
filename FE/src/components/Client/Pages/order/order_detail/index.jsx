import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Order_Detail() {
  const [orders, setOrders] = useState([]);

  // Lấy user ID từ cookie
  const getUserIdFromToken = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id;
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken();

    if (userId) {
      axios.get(`http://localhost:3000/api/orders/detail_user/${userId}`)
        .then(res => {
          const ordersData = res.data.data;
          if (Array.isArray(ordersData)) {
            setOrders(ordersData);
            console.log("Tất cả đơn hàng:", ordersData);
          }
        })
        .catch(err => {
          console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        });
    }
  }, []);

  function formatPrice(price) {
    const number = Number(price);
    if (isNaN(number)) {
      return "Giá không hợp lệ";
    }
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }
  

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Danh sách đơn hàng của bạn</h2>

      {orders.length > 0 ? (
        orders.map((order, idx) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold">Đơn hàng #{order.id}</h5>
              <p><strong>Người dùng:</strong> {order.user?.name || "N/A"}</p>
              <p><strong>Trạng thái:</strong> {order.status || "N/A"}</p>
              <p><strong>Ngày tạo:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>

              <h6 className="mt-4">Chi tiết đơn hàng</h6>
              <table className="table table-bordered table-hover text-center mt-2">
                <thead className="table-dark">
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th className="text-end">Giá</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(order.order_details) && order.order_details.length > 0 ? (
                    order.order_details.map((item, index) => (
                      <tr key={index}>
                        <td className="align-middle">{item.product?.title || "N/A"}</td>
                        <td className="align-middle">{item.qty}</td>
                        <td className="text-end align-middle">{formatPrice(item.price)}</td>
                        <td className="text-end align-middle">{formatPrice(item.price * item.qty)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Không có chi tiết đơn hàng.</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3" className="text-end">Tổng cộng:</th>
                    <th className="text-end">{formatPrice(order.total_price || 0)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p>Bạn chưa có đơn hàng nào.</p>
      )}

      <div className="d-flex justify-content-start mt-3">
        <a href="/order" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-arrow-left"></i> Quay lại
        </a>
      </div>
    </div>
  );
}

export default Order_Detail;
