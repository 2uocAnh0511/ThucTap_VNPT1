import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Constants from "../../../../Constanst";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({ all: 0, active: 0, blocked: 0 });
  const limit = 10;

  const statusList = [
    { key: "all", label: "Tất cả", color: "bg-gray-800", textColor: "text-white" },
    { key: "active", label: "Hoạt động", color: "bg-green-300", textColor: "text-green-800" },
    { key: "blocked", label: "Khóa", color: "bg-yellow-300", textColor: "text-yellow-800" },
  ];

  const fetchUsers = async (page = 1, search = "", status = "") => {
    try {
      setError(null);
      const params = { page, limit, search };
      if (status === "active") params.status = 1;
      if (status === "blocked") params.status = 0;

      // Lấy danh sách người dùng
      const res = await axios.get(`${Constants.DOMAIN_API}/api/users`, { params });

      let list = [];
      let totalCount = 0;

      if (Array.isArray(res.data)) {
        list = res.data;
        totalCount = list.length;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        list = res.data.data;
        totalCount = res.data.total;
      } else {
        throw new Error("Dữ liệu người dùng không hợp lệ");
      }

      // Đánh dấu isBlocked
      const updated = list.map(u => ({
        ...u,
        isBlocked: u.status === 0,
      }));

      setUsers(updated);
      setTotalPages(Math.ceil(totalCount / limit));

      // Lấy tổng số trạng thái
      const countRes = await axios.get(`${Constants.DOMAIN_API}/api/users/count`, {
        params: { search },
      });

      setStatusCounts({
        all: countRes.data.all || totalCount,
        active: countRes.data.active || list.filter(u => u.status === 1).length,
        blocked: countRes.data.blocked || list.filter(u => u.status === 0).length,
      });
    } catch (err) {
      console.error("Lỗi khi lấy người dùng:", err);
      const msg = err.response?.data?.error || err.message || "Lỗi khi tải danh sách người dùng";
      setError(msg);
      toast.error(msg);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, filterStatus);
  }, [currentPage, filterStatus]);

  const toggleStatus = async (id) => {
    try {
      // Cập nhật cục bộ trước để giao diện phản ánh ngay
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id
            ? { ...user, status: user.status === 1 ? 0 : 1, isBlocked: user.status === 1 }
            : user
        )
      );

      // Gọi API để cập nhật trạng thái
      await axios.patch(`${Constants.DOMAIN_API}/api/users/${id}/toggle`);

      // Cập nhật lại status counts
      const countRes = await axios.get(`${Constants.DOMAIN_API}/api/users/count`, {
        params: { search: searchTerm },
      });

      setStatusCounts({
        all: countRes.data.all,
        active: countRes.data.active,
        blocked: countRes.data.blocked,
      });

      toast.success("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      toast.error(err.response?.data?.error || "Lỗi khi cập nhật trạng thái");
      // Nếu lỗi, gọi lại fetchUsers để đồng bộ dữ liệu
      fetchUsers(currentPage, searchTerm, filterStatus);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, searchTerm, filterStatus);
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Quản Lý Người Dùng</h2>
      </div>

      <div className="flex gap-2 mb-4 whitespace-nowrap">
        {statusList.map(({ key, label, color, textColor }) => (
          <button
            key={key}
            onClick={() => {
              const st = key === "all" ? "" : key;
              setFilterStatus(st);
              setCurrentPage(1);
              fetchUsers(1, searchTerm, st);
            }}
            className={`flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm transition-all ${filterStatus === (key === "all" ? "" : key) ? "bg-[#073272] text-white" : "bg-white text-gray-700"
              }`}
          >
            {label}
            <span className={`px-2 py-0.5 rounded ${color} ${textColor} text-xs font-semibold`}>
              {statusCounts[key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-center flex-wrap">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded py-2 px-4 text-gray-700 leading-tight focus:ring-2 focus:ring-blue-500"
          placeholder="Tìm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-1.5 rounded flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-collapse border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Họ Tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Địa chỉ</th>
              <th className="border p-2">Số điện thoại</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.address || "Không có"}</td>
                  <td className="border p-2">{user.phone || "Không có"}</td>
                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${user.isBlocked ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                      {user.isBlocked ? "Khóa" : "Hoạt động"}
                    </span>
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <Link
                      to={`/admin/users/viewUser/${user.id}`}
                      className="bg-yellow-500 text-white p-1.5 rounded w-8 h-8 inline-flex items-center justify-center hover:bg-yellow-600 transition duration-200"
                      title="Xem chi tiết"
                    >
                      <FaInfoCircle size={20} />
                    </Link>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`p-1.5 rounded w-8 h-8 inline-flex items-center justify-center ${user.isBlocked
                        ? "bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-700"
                        : "bg-yellow-50 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-700"
                        } transition duration-200`}
                      title={user.isBlocked ? "Mở khóa" : "Khóa"}
                    >
                      {user.isBlocked ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border p-2 text-center text-muted py-4">
                  Không có người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            if (page >= currentPage - 1 && page <= currentPage + 1) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${page === currentPage ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-100"
                    }`}
                >
                  {page}
                </button>
              );
            }
            return null;
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersAdmin;