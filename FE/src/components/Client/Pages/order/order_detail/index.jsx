import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Constanst from "../../../../../Constanst";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

function Order_Detail() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

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

  const fetchOrders = () => {
    const userId = getUserIdFromToken();
    if (userId) {
      axios.get(`${Constanst.DOMAIN_API}/api/orders/detail_user/${userId}`)
        .then(res => {
          const ordersData = res.data.data;
          if (Array.isArray(ordersData)) {
            setOrders(ordersData);
          }
        })
        .catch(err => {
          console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleCancelOrder = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: 'Chọn lý do hủy đơn hàng',
      input: 'select',
      inputOptions: {
        'Tôi không muốn mua nữa': 'Tôi không muốn mua nữa',
        'Tìm thấy giá tốt hơn ở nơi khác': 'Tìm thấy giá tốt hơn ở nơi khác',
        'Thời gian giao hàng quá lâu': 'Thời gian giao hàng quá lâu',
        'Đặt nhầm sản phẩm': 'Đặt nhầm sản phẩm',
        'Lý do khác': 'Lý do khác'
      },
      inputPlaceholder: 'Chọn một lý do',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
    });

    if (!reason) return;

    try {
      await axios.put(`${Constanst.DOMAIN_API}/api/orders/${orderId}/cancel`, {
        cancellation_reason: reason
      });
      toast.success("Đơn hàng đã được hủy thành công");
      fetchOrders();
    } catch (error) {
      toast.error("Không thể hủy đơn hàng");
      console.error("❌ Lỗi khi hủy đơn hàng:", error);
    }
  };

  const formatPrice = (price) => {
    const number = Number(price);
    return isNaN(number) ? "N/A" : number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Đơn hàng của bạn</h2>

      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="card mb-3 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>Đơn #{order.id}</strong> | Trạng thái: <span className="text-primary">{order.status}</span>
              </div>
              <div>
                {order.status === "Chờ xác nhận" && (
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Hủy đơn
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => toggleOrder(order.id)}
                >
                  {expandedOrderIds.includes(order.id) ? "Ẩn chi tiết" : "Xem chi tiết"}
                </button>
              </div>
            </div>

            {expandedOrderIds.includes(order.id) && (
              <div className="card-body">
                <p><strong>Ngày tạo:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
                {order.cancellation_reason && (
                  <p className="text-danger"><strong>Lý do hủy:</strong> {order.cancellation_reason}</p>
                )}

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
            )}
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
