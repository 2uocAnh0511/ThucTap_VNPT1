import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Constants from "../../../../Constants";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch blog details by ID
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${Constants.DOMAIN_API}/admin/blog/getById/${id}`);
        const blog = res.data.data;

        setValue("title", blog.title);
        setValue("short_description", blog.short_description);
        editorRef.current?.setContent(blog.content || "");
        setPreviewImage(`${Constants.DOMAIN_API}/uploads/${blog.image}`);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
        setErrorMessage("Không thể tải dữ liệu bài viết.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, setValue]);

  const validateImage = (fileList) => {
    if (fileList.length === 0) return true; // Cho phép không chọn ảnh mới
    const file = fileList[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) return "Ảnh phải là jpeg, png hoặc jpg";
    if (file.size > 5 * 1024 * 1024) return "Ảnh không vượt quá 5MB";
    return true;
  };

  const onSubmit = async (data) => {
    try {
      const content = editorRef.current?.getContent();
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("short_description", data.short_description);
      formData.append("content", content);

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const response = await axios.put(
        `${Constants.DOMAIN_API}/admin/blog/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate("/admin/blog/getAll");
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      setErrorMessage("Cập nhật bài viết thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-full mx-auto">
        <h3 className="text-2xl font-bold mb-4">Sửa bài viết</h3>

        {errorMessage && (
          <div className="text-red-500 mb-4 font-semibold">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded-md shadow-lg">
          <div className="mb-4">
            <label className="block font-medium mb-2">Tiêu đề bài viết</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("title", { required: "Tiêu đề không được để trống" })}
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Mô tả ngắn</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              {...register("short_description", {
                required: "Mô tả ngắn không được để trống",
              })}
            />
            {errors.short_description && (
              <p className="text-red-500">{errors.short_description.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Nội dung</label>
            <Editor
              apiKey="hxo8p07686juzc8t31sz6h654xhecoydtwwa89l3dcx3plg2"
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                height: 400,
                menubar: false,
                plugins: ["table", "link", "image", "code", "lists"],
                toolbar:
                  "undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | link image | table | code",
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Hình ảnh</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Ảnh hiện tại"
                className="mb-2 w-48 h-32 object-cover border"
              />
            )}
            <input
              type="file"
              className="w-full p-2 border rounded"
              {...register("image", { validate: validateImage })}
            />
            {errors.image && <p className="text-red-500">{errors.image.message}</p>}
          </div>

          <button type="submit" className="px-4 py-2 bg-[#073272] text-white rounded hover:bg-blue-900">
            Cập nhật bài viết
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogEdit;
