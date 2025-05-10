import { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../../../../Constants.jsx";
import { toast } from "react-toastify";
import Pagination from "../../../../pagination.jsx";

function CommentGetAll() {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10; // Số bình luận mỗi trang

  useEffect(() => {
    getComments(currentPage); // Lấy bình luận khi trang thay đổi
  }, [currentPage]);

  const getComments = async (page) => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/admin/comments/list`, {
        params: { page, limit: itemsPerPage },
      });
      setComments(res.data.data || []);
      setTotalComments(res.data.total); // Tổng số bình luận
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bình luận:", error);
      toast.error("Không thể tải bình luận.");
    }
  };

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Danh sách bình luận</h2>
      <table className="w-full table-auto border border-collapse border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Người dùng</th>
            <th className="border p-2">Bình luận</th>
            <th className="border p-2">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((cmt, index) => (
            <tr key={cmt.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center"> {(currentPage - 1) * itemsPerPage + (index + 1)}</td>
              <td className="border p-2 text-center">{cmt.user?.name || "Không rõ"}</td>
              <td className="border p-2">{cmt.comment_text}</td>
              <td className="border p-2 text-center">
                {new Date(cmt.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalItems={totalComments}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default CommentGetAll;
