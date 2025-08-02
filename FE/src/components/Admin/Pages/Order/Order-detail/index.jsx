import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Constants from "../../../../../Constanst";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderInfo();
  }, []);

  const getOrderInfo = async () => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/api/orders/${id}`);
      setOrderInfo(res.data);
      setOrders(res.data.order_details || []);
    } catch (e) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  if (loading) return <div className="container mt-4">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Thông tin khách hàng</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Mã đơn hàng:</label>
              <div className="form-control">{orderInfo.id || "—"}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Tên người dùng:</label>
              <div className="form-control">{orderInfo.user?.name || "—"}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Trạng thái:</label>
              <div className="form-control">{orderInfo.status || "—"}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Ngày tạo:</label>
              <div className="form-control">
                {orderInfo.createdAt
                  ? new Date(orderInfo.createdAt).toLocaleString("vi-VN")
                  : "—"}
              </div>
            </div>
            <div className="col-md-12">
              <label className="form-label fw-bold">Phương thức thanh toán:</label>
              <div className="form-control">{orderInfo.payment_method || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Chi tiết đơn hàng</h5>
        </div>
        <div className="card-body p-0">
          {orders.length === 0 ? (
            <p className="p-3 text-muted">Không có sản phẩm trong đơn hàng.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Trạng thái</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th className="text-end">Đơn giá</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => (
                    <tr key={index}>
                      <td>{orderInfo.status}</td>
                      <td>{item.product?.title || "—"}</td>
                      <td>{item.qty}</td>
                      <td className="text-end">{formatCurrency(item.price)}</td>
                      <td className="text-end">{formatCurrency(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-light">
                    <td colSpan="4" className="text-end fw-semibold">Tạm tính:</td>
                    <td className="text-end">{formatCurrency(orderInfo.total_price)}</td>
                  </tr>
                  {Number(orderInfo.discount_amount) > 0 && (
                    <tr className="table-warning">
                      <td colSpan="4" className="text-end fw-semibold">Giảm giá:</td>
                      <td className="text-end text-danger">
                        -{formatCurrency(orderInfo.discount_amount)}
                      </td>
                    </tr>
                  )}
                  <tr className="table-success">
                    <td colSpan="4" className="text-end fw-bold">Thành tiền:</td>
                    <td className="text-end fw-bold text-success">
                      {formatCurrency(orderInfo.final_price || orderInfo.total_price)}
                    </td>
                  </tr>
                  {orderInfo.promotion?.code && (
                    <tr className="table-info">
                      <td colSpan="4" className="text-end fw-semibold">Mã khuyến mãi:</td>
                      <td className="text-start text-primary">{orderInfo.promotion.code}</td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer text-end">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/order")}
          >
            <i className="bi bi-arrow-left"></i> Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
