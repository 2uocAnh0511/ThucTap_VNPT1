import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import dayjs from "dayjs";
import axios from "axios";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Constanst from "../../../../Constanst";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchComments = async (page = 1, search = "") => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/comments`, {
        params: { page, limit, search },
      });

      const updated = res.data.data.map(c => ({
        ...c,
        isHidden: c.status === 0,
      }));

      setComments(updated);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  useEffect(() => {
    fetchComments(currentPage, searchTerm);
  }, [currentPage]);

  const toggleVisibility = async (id) => {
    try {
      await axios.patch(`${Constanst.DOMAIN_API}/api/comments/${id}/toggle`);
      fetchComments(currentPage, searchTerm);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", err);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchComments(1, searchTerm);
  };

  return (
    <div className="container mt-4">
      <div className="mb-2 d-flex gap-2 align-items-center">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Tìm theo bình luận, người dùng, sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={handleSearch}>
          <i className="bi bi-search" />
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <h4 className="card-title fw-bold text-center">Danh Sách Bình Luận</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Người Dùng</th>
                  <th>Sản Phẩm</th>
                  <th>Bình Luận</th>
                  <th>Ngày</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id} className={comment.isHidden ? "table-secondary" : ""}>
                    <td>{comment.user?.name}</td>
                    <td>{comment.product?.title}</td>
                    <td>{comment.isHidden ? <i>(Đã ẩn)</i> : comment.content}</td>
                    <td>{dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                    <td>{comment.isHidden ? "Đã ẩn" : "Hiển thị"}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${comment.isHidden ? "btn-outline-success" : "btn-outline-warning"}`}
                        onClick={() => toggleVisibility(comment.id)}
                      >
                        <i className={`bi ${comment.isHidden ? "bi-eye" : "bi-eye-slash"}`}></i>{" "}
                        {comment.isHidden ? "Hiện" : "Ẩn"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
              <div className="btn-group">
                <button className="btn btn-light" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                  <FaAngleDoubleLeft />
                </button>
                <button className="btn btn-light" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                  <FaChevronLeft />
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page >= currentPage - 1 && page <= currentPage + 1) {
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
                <button className="btn btn-light" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                  <FaChevronRight />
                </button>
                <button className="btn btn-light" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                  <FaAngleDoubleRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
