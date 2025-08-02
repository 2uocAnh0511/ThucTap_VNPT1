import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constanst from "../../../../Constanst";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    getData(currentPage, search);
  }, [currentPage]);

  const getData = async (page = 1, searchValue = "") => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/orders`, {
        params: {
          page,
          limit,
          search: searchValue,
        },
      });

      setOrders(res.data.data);
      const total = res.data.total || 0;
      setTotalPages(Math.ceil(total / limit));
    } catch (e) {
      console.error("Error fetching orders:", e);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getData(1, search);
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${Constanst.DOMAIN_API}/api/orders/${orderId}`, {
        status: newStatus,
      });
      getData(currentPage, search);
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
          <Link to={`/admin/order/${value.id}`} className="btn btn-primary">
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

          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo tên khách hàng"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <i className="bi bi-search" />
            </button>
          </div>

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
              <tbody>{orders.map(renderUser)}</tbody>
            </table>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <div className="btn-group">
              <button
                className="btn btn-light"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                className="btn btn-light"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <FaChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`btn ${page === currentPage ? "btn-primary" : "btn-light"}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
              <button
                className="btn btn-light"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <FaChevronRight />
              </button>
              <button
                className="btn btn-light"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
