import { Link } from "react-router-dom";
import FormDelete from "../../../../components/formDelete";
import { useState, useEffect } from "react";
import axios from "axios";
import Constants from "../../../../Constants";

const BlogGetAll = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogData, setData] = useState([]);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/admin/blog/list`);
      if (res.data && res.data.data) {
        setData(res.data.data); // Gán dữ liệu vào state blogData
      } else {
        console.log("Không có dữ liệu blog.");
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu blog:", error);
    }
  };

  const deleteBlog = async () => {
    if (!selectedBlog) return;
    try {
      await axios.delete(`${Constants.DOMAIN_API}/admin/blog/${selectedBlog.id}`);
      setSelectedBlog(null);
      getAll();
    } catch (error) {
      console.log("Lỗi khi xóa:", error);
    }
  };

  const renderBlog = (blog, index) => (
    <tr key={blog.id} className="border-b hover:bg-gray-50">
      <td className="p-2 border text-center">{index + 1}</td>
      <td className="p-2 border">{blog.title}</td>
      <td className="p-2 border line-clamp-2">{blog.short_description || "-"}</td>
      <td className="p-2 border text-center">
        <img
          className="w-[50px] h-[50px] object-cover mx-auto"
          src={`${Constants.DOMAIN_API}/public/images/${blog.image}`}
          alt="blog"
        />
      </td>
      <td className="p-2 border text-center">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            blog.status === 1 // Kiểm tra nếu trạng thái là 1 (hiển thị)
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {blog.status === 1 ? "Hiển thị" : "Ẩn"}
        </span>
      </td>
      <td className="p-2 border text-center">
        {new Date(blog.created_at).toLocaleDateString()}
      </td>
      <td className="p-2 border text-center space-x-2">
        <Link
          to={`/admin/blog/edit/${blog.id}`}
          className="bg-yellow-500 text-white py-1 px-3 rounded"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </Link>
        <button
          onClick={() => setSelectedBlog(blog)}
          className="bg-red-500 text-white py-1 px-3 rounded"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto p-2">
      <div className="bg-white p-4 shadow rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Danh sách bài viết</h2>
          <Link
            to="/admin/blog/create"
            className="bg-[#073272] text-white px-4 py-2 rounded"
          >
            + Thêm bài viết
          </Link>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border text-center">#</th>
              <th className="p-2 border">Tiêu đề</th>
              <th className="p-2 border">Mô tả ngắn</th>
              <th className="p-2 border text-center">Hình ảnh</th>
              <th className="p-2 border text-center">Trạng thái</th>
              <th className="p-2 border text-center">Ngày tạo</th>
              <th className="p-2 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogData.length > 0 ? (
              blogData.map(renderBlog)
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  Không có bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <FormDelete
          isOpen={selectedBlog !== null}
          onClose={() => setSelectedBlog(null)}
          onConfirm={deleteBlog}
          message={`Bạn có chắc chắn muốn xóa bài viết "${selectedBlog?.title}" không?`}
        />
      </div>
    </div>
  );
};

export default BlogGetAll;
