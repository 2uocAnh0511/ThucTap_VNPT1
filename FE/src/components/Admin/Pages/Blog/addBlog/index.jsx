import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import Constants from "../../../../../Constanst";
import { uploadToCloudinary } from "../../../../../Upload/uploadToCloudinary";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const AddBlog = () => {
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      // Lấy user_id từ cookie
      let user_id = null;
      if (cookies.user) {
        const user = typeof cookies.user === "string"
          ? JSON.parse(cookies.user)
          : cookies.user;
        user_id = user.id;
      }

      const data = {
        title: formData.title,
        content: formData.content,
        image: imageUrl,
        user_id,
        status: 1,
      };

      const response = await axios.post(
        `${Constants.DOMAIN_API}/api/blogs`,
        data
      );
      toast.success(response.data.message || "Thêm bài viết thành công!");
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Lỗi khi thêm bài viết:", err);
      toast.error(err.response?.data?.error || "Lỗi khi thêm bài viết!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded mt-6">
      <h2 className="text-2xl font-semibold mb-6">Thêm Bài Viết</h2>
      <div className="card border-0 shadow-lg">
        <div className="card-body p-6">
          <form onSubmit={handleSubmit}>
            {/* Tiêu đề */}
            <div className="mb-5">
              <label htmlFor="title" className="form-label font-medium">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control border border-gray-300 rounded py-2 px-4 focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>

            {/* Nội dung */}
            <div className="mb-5">
              <label htmlFor="content" className="form-label font-medium">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <Editor
                apiKey="bmv0wiy7ujts5t0mv0otx985uack51siw7nzibkv6hdtl56o"
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={formData.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 300,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic | \
                     alignleft aligncenter alignright alignjustify | \
                     bullist numlist outdent indent | link image | removeformat",
                  content_style:
                    "body { font-family: Arial, sans-serif; font-size: 16px }",
                }}
              />
            </div>

            {/* Ảnh minh họa */}
            <div className="mb-5">
              <label htmlFor="image" className="form-label font-medium">
                Hình ảnh minh họa
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control border border-gray-300 rounded py-2 px-4"
              />
              <small className="text-gray-500">
                (Tùy chọn: chọn ảnh minh họa cho bài viết)
              </small>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/blogs")}
                disabled={loading}
                className="inline-block px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang lưu...
                  </span>
                ) : (
                  "Lưu"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
