import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Constanst from "../../../../../Constanst";

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
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/orders/${id}`);
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
      <div className="card">
        <div className="card-body">
          <h3 className="card-title fw-bold">Thông tin khách hàng</h3>
          <form>
            <div className="mb-3">
              <label className="form-label fw-bold">ID Đơn hàng:</label>
              <input type="text" className="form-control" value={orderInfo.id || ""} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Người dùng:</label>
              <input
                type="text"
                className="form-control"
                value={orderInfo.user?.name || "N/A"}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Trạng thái:</label>
              <input
                type="text"
                className="form-control"
                value={orderInfo.status || "N/A"}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Ngày tạo:</label>
              <input
                type="text"
                className="form-control"
                value={
                  orderInfo.createdAt
                    ? new Date(orderInfo.createdAt).toLocaleString("vi-VN")
                    : ""
                }
                readOnly
              />
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Chi tiết đơn hàng</h5>
          {orders.length === 0 ? (
            <p>Không có sản phẩm trong đơn hàng.</p>
          ) : (
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>Trạng thái</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th className="text-end">Giá</th>
                  <th className="text-end">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, index) => (
                  <tr key={index}>
                    <td className="align-middle">{orderInfo.status}</td>
                    <td className="align-middle">{item.product?.title || "N/A"}</td>
                    <td className="align-middle">{item.qty}</td>
                    <td className="text-end align-middle">{formatCurrency(item.price)}</td>
                    <td className="text-end align-middle">{formatCurrency(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="4" className="text-end">
                    Tổng cộng:
                  </th>
                  <th className="text-end">{formatCurrency(orderInfo.total_price)}</th>
                </tr>
              </tfoot>
            </table>
          )}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/admin/order")}
            >
              <i className="bi bi-arrow-left"></i> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
