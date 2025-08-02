import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router";

import React, { useState, useEffect } from "react";

import axios from "axios";
import Constanst from "../../../../Constanst"; // đường dẫn đến hằng số API của bạn

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/orders`);
      console.log("response ==", res.data);
      setOrders(res.data.data);
    } catch (e) {
      console.log("error === ", e);
      console.log("error response === ", e.response);
      console.log("error message === ", e.message);
    }
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${Constanst.DOMAIN_API}/api/orders/${orderId}`, {
        status: newStatus,
      });
      getData(); // gọi lại API để cập nhật UI
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  const renderUser = (value, index) => {
  
    const statusOptions = [
      "Chờ xác nhận", 
      "Đã xác nhận", 
      "Đã giao", 
      "Đã hủy"
    ];
    
    // Điều kiện loại bỏ tùy chọn khi trạng thái là "Đã xác nhận", "Đã giao", hoặc "Đã hủy"
    const availableStatusOptions = 
      value.status === "Đã xác nhận" 
      ? statusOptions.filter(option => option !== "Chờ xác nhận" && option !== "Đã hủy")
      : value.status === "Đã giao"
      ? statusOptions.filter(option => option !== "Chờ xác nhận" && option !== "Đã xác nhận" && option !== "Đã hủy")
      : value.status === "Đã hủy"
      ? statusOptions.filter(option => option !== "Chờ xác nhận" && option !== "Đã xác nhận" && option !== "Đã giao")
      : statusOptions;

    return (
      <tr key={index}>
        <td>{value.id}</td>
        <td>{value.user?.name || "N/A"}</td>
        <td>{value.total_price}</td>

        <td>
          <select
            className="form-control"
            value={value.status}
            onChange={(e) => handleChangeStatus(value.id, e.target.value)}
          >
            {availableStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </td>

        <td>{new Date(value.createdAt).toLocaleDateString()}</td>
        <td>
          <Link to={`/admin/order_detail?id=${value.id}`} className="btn btn-primary">
            Xem
          </Link>
        </td>
      </tr>
    );
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title fw-bold text-center">Quản Lý Đơn Hàng</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Khách hàng</th>
                  <th scope="col">Tổng tiền</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Ngày đặt</th>
                  <th scope="col">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(renderUser)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
