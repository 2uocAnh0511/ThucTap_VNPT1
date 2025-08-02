import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import dayjs from "dayjs";
import axios from "axios";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight, FaTrashAlt, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Constants from "../../../../Constanst";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [statusCounts, setStatusCounts] = useState({ all: 0, visible: 0, hidden: 0 });

  const limit = 10;

  const statusList = [
    { key: "all", label: "Tất cả", color: "bg-gray-800", textColor: "text-white" },
    { key: "visible", label: "Hiển thị", color: "bg-green-300", textColor: "text-green-800" },
    { key: "hidden", label: "Ẩn", color: "bg-yellow-300", textColor: "text-yellow-800" },
  ];

  const fetchBlogs = async (page = 1, search = "", status = "") => {
    try {
      setError(null);
      const params = { page, limit, search };
      if (status === "visible") params.status = 1;
      if (status === "hidden") params.status = 0;

      const res = await axios.get(`${Constants.DOMAIN_API}/api/blogs`, { params });

      if (!res.data.data || !Array.isArray(res.data.data)) {
        throw new Error("Dữ liệu bài viết không hợp lệ");
      }

      const updated = res.data.data.map((b) => ({
        ...b,
        isHidden: b.status === 0,
      }));

      setBlogs(updated);
      setTotalPages(Math.ceil(res.data.total / limit));

      // Cập nhật số lượng trạng thái
      const allCount = res.data.total;
      const visibleCount = res.data.data.filter((b) => b.status === 1).length;
      const hiddenCount = res.data.data.filter((b) => b.status === 0).length;
      setStatusCounts({ all: allCount, visible: visibleCount, hidden: hiddenCount });
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
      setError(err.response?.data?.error || "Lỗi khi tải bài viết");
      toast.error(err.response?.data?.error || "Lỗi khi tải bài viết");
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, searchTerm, filterStatus);
  }, [currentPage, filterStatus]);

  const toggleVisibility = async (id) => {
    try {
      await axios.patch(`${Constants.DOMAIN_API}/api/blogs/${id}/toggle`);
      fetchBlogs(currentPage, searchTerm, filterStatus);
      toast.success("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", err);
      toast.error(err.response?.data?.error || "Lỗi khi cập nhật trạng thái");
    }
  };

  const confirmDelete = async (blog) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: `Bài viết "${blog.title}" sẽ bị xóa vĩnh viễn.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      setSelectedBlog(blog);
      deleteBlog();
    }
  };

  const deleteBlog = async () => {
    if (!selectedBlog) return;
    try {
      await axios.delete(`${Constants.DOMAIN_API}/api/blogs/${selectedBlog.id}`);
      toast.success("Xóa bài viết thành công");
      fetchBlogs(currentPage, searchTerm, filterStatus);
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      toast.error(err.response?.data?.error || "Xóa bài viết thất bại");
    } finally {
      setSelectedBlog(null);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBlogs(1, searchTerm, filterStatus);
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh Sách Bài Viết</h2>
        <Link to="/admin/blogs/addBlog" className="bg-[#073272] hover:bg-[#05224f] text-white px-4 py-2 rounded shadow">
          <i className="bi bi-plus-circle me-1"></i> Thêm bài viết
        </Link>
      </div>

      <div className="flex gap-2 mb-4 whitespace-nowrap">
        {statusList.map(({ key, label, color, textColor }) => (
          <button
            key={key}
            onClick={() => {
              setFilterStatus(key === "all" ? "" : key);
              setCurrentPage(1);
              fetchBlogs(1, searchTerm, key === "all" ? "" : key);
            }}
            className={`flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm transition-all 
              ${filterStatus === (key === "all" ? "" : key) ? "bg-[#073272] text-white" : "bg-white text-gray-700"}`}
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
          placeholder="Tìm theo tiêu đề bài viết..."
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
              <th className="border p-2">Hình ảnh</th>
              <th className="border p-2">Tiêu đề</th>
              <th className="border p-2">Ngày tạo</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="border p-2 text-center text-muted py-4">
                  Không có bài viết nào
                </td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="border p-2 text-center">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <span className="text-muted">Không có ảnh</span>
                    )}
                  </td>
                  <td className="border p-2">{blog.title}</td>
                  <td className="border p-2 text-center">
                    {dayjs(blog.createdAt).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.isHidden ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {blog.isHidden ? "Ẩn" : "Hiển thị"}
                    </span>
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <Link
                      to={`/admin/blogs/editBlog/${blog.id}`}
                      className="bg-yellow-500 text-white p-1.5 rounded w-8 h-8 inline-flex items-center justify-center hover:bg-yellow-600 transition duration-200"
                    >
                      <FaEdit size={20} />
                    </Link>
                    <button
                      onClick={() => toggleVisibility(blog.id)}
                      className={`p-1.5 rounded w-8 h-8 inline-flex items-center justify-center ${
                        blog.isHidden
                          ? "bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-700"
                          : "bg-yellow-50 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-700"
                      } transition duration-200`}
                    >
                      {blog.isHidden ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                    </button>
                    <button
                      onClick={() => confirmDelete(blog)}
                      className="p-1.5 rounded w-8 h-8 inline-flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition duration-200"
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </td>
                </tr>
              ))
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
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
                  className={`px-3 py-1 border rounded ${
                    page === currentPage ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-100"
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
            onClick={() => setCurrentPage((prev) => prev + 1)}
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

export default Blog;