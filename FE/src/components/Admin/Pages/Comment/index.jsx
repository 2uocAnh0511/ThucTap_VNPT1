import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import dayjs from "dayjs";
import axios from "axios";

const Comment = () => {
  const [comments, setComments] = useState([]);

  const renderComments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/comments");

      // Sử dụng status từ API để xác định isHidden
      const updatedComments = res.data.map((comment) => ({
        ...comment,
        isHidden: comment.status === 1,
      }));

      setComments(updatedComments);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  useEffect(() => {
    renderComments();
  }, []);

  // Gửi request PATCH để toggle ẩn/hiện trong DB
  const toggleVisibility = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/comments/${id}/toggle`);
      renderComments(); // Refresh lại danh sách sau khi cập nhật
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title fw-bold text-center">Danh Sách Bình Luận</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Người Dùng</th>
                  <th scope="col">Sản Phẩm</th>
                  <th scope="col">Bình Luận</th>
                  <th scope="col">Ngày Bình Luận</th>
                  <th scope="col">Trạng Thái</th>
                  <th scope="col">Thao Tác</th>
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
                        className={`btn btn-sm ${
                          comment.isHidden ? "btn-outline-success" : "btn-outline-warning"
                        }`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
