import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Constants from "../../../../../Constanst";
import { uploadToCloudinary } from "../../../../../Upload/uploadToCloudinary";
import "bootstrap/dist/css/bootstrap.min.css";
import { Editor } from "@tinymce/tinymce-react";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,           // File object mới
    status: 1,             // 1 = Hiển thị, 0 = Ẩn
    currentImage: null,    // URL preview (có thể là ảnh cũ hoặc preview tạm)
  });
  const [objectUrl, setObjectUrl] = useState(null); // để revoke URL.createObjectURL
  const [loading, setLoading] = useState(false);

  // Fetch blog khi mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${Constants.DOMAIN_API}/api/blogs/${id}`);
        setFormData({
          title: res.data.title,
          content: res.data.content,
          image: null,
          status: res.data.status,
          currentImage: res.data.image, // URL ảnh cũ
        });
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
        toast.error("Lỗi khi tải bài viết!");
      }
    };
    fetchBlog();
  }, [id]);

  // Cleanup object URL khi unmount hoặc khi đổi objectUrl
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // Khi chọn file ảnh mới: tạo URL tạm để preview, revoke URL cũ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: file,
        currentImage: previewUrl
      }));
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setObjectUrl(previewUrl);
    }
  };

  const handleEditImage = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload lên Cloudinary nếu có chọn file mới
      let imageUrl = formData.currentImage;
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const data = {
        title: formData.title,
        content: formData.content,
        status: parseInt(formData.status, 10),
        ...(imageUrl && { image: imageUrl }),
      };

      await axios.put(`${Constants.DOMAIN_API}/api/blogs/${id}`, data);
      toast.success("Cập nhật bài viết thành công!");
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Lỗi khi cập nhật bài viết:", err);
      toast.error(err.response?.data?.error || "Lỗi khi cập nhật bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Bạn có chắc muốn hủy?",
      text: "Các thay đổi sẽ không được lưu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy",
      cancelButtonText: "Tiếp tục chỉnh sửa",
    }).then(result => {
      if (result.isConfirmed) {
        navigate("/admin/blogs");
      }
    });
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-6">Sửa Bài Viết</h2>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Tiêu đề */}
            <div className="mb-4">
              <label htmlFor="title" className="form-label font-medium">Tiêu đề</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control border-gray-300 rounded py-2 px-4 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nội dung */}
            <div className="mb-4">
              <label htmlFor="content" className="form-label font-medium">Nội dung</label>
              <Editor
                apiKey="bmv0wiy7ujts5t0mv0otx985uack51siw7nzibkv6hdtl56o"
                value={formData.content}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | help",
                }}
                onEditorChange={handleContentChange}
              />
            </div>

            {/* Trạng thái & Ảnh */}
            <div className="row mb-4">
              <div className="col-6">
                <label htmlFor="status" className="form-label font-medium">Trạng thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control border-gray-300 rounded py-2 px-4 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Hiển thị</option>
                  <option value="0">Ẩn</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label font-medium">Hình ảnh</label>
                {formData.currentImage && (
                  <div className="d-flex flex-column mb-2">
                    <img
                      src={formData.currentImage}
                      alt="Preview"
                      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
                    />
                    <button
                      type="button"
                      onClick={handleEditImage}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mt-2"
                    >
                      Chọn lại ảnh
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="d-none"
                />
              </div>
            </div>

            {/* Nút Lưu / Hủy */}
            <div className="flex gap-3 justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#073272] hover:bg-[#05224f] text-white px-4 py-2 rounded ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
