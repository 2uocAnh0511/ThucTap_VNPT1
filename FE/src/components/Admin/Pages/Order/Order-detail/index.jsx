import axios from "axios";
import {useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, 
    useSearchParams,
    useParams
} from "react-router";
import Constanst from "../../../../../Constanst"; // đường dẫn đến hằng số API của bạn


const OrderDetail = () => {
    const [orders, setOrders] = useState([]);
  
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(()=> {
    console.log("setQueryParams ===", queryParams.get("id"));
    getoderInfo()

  },[])

  const [orderInfo, setOrderInfo] = useState({});
  

  const getoderInfo = async () => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/orders/${queryParams.get("id")}`);
      console.log("Full response ==>", res.data);
  
      setOrderInfo(res.data); // chứa id, user_id, total_price...
      setOrders(res.data.order_details); // chỉ mảng chi tiết sản phẩm
    } catch (e) {
      console.log("Error when fetching order:", e);
    }
  };
  
  const renderUser = (value, index) => {
    return (
      <tr key={index}>
        <td>{value.product_id}</td>
      </tr>
    );
  };
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };
  


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
              <label className="form-label fw-bold">người dùng:</label>
              <input type="text" className="form-control" value={orderInfo.user?.name || "N/A"} readOnly />
              </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Trạng thái:</label>
              <input type="text" className="form-control" value={orderInfo.status || "N/A"} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Ngày tạo:</label>
              <input type="text" className="form-control" value={orderInfo.createdAt ? new Date(orderInfo.createdAt).toLocaleDateString() : ""} readOnly />
            </div>
          </form>
        </div>
      </div>
  
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Chi tiết đơn hàng</h5>
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
                <th colSpan="4" className="text-end">Tổng cộng:</th>
                <th className="text-end">{formatCurrency(orderInfo.total_price)}</th>
              </tr>
            </tfoot>
          </table>
          <div className="d-flex justify-content-between">
            <a href="/admin/order" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-arrow-left"></i> Quay lại
            </a>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default OrderDetail;
