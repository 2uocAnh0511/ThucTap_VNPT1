import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Constants from "../../../../../Constanst";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${Constants.DOMAIN_API}/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center">Đang tải...</p>;

  return (
    <div className="container my-5">
      <Link to="/NewsPage" className="btn btn-secondary mb-3">
        ← Quay lại
      </Link>
      <h2 className="mb-3">{blog.title}</h2>
      <p className="text-muted">
        Ngày đăng: {new Date(blog.created_at).toLocaleDateString("vi-VN")}
      </p>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="img-fluid mb-4"
          style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
    </div>
  );
};

export default BlogDetail;
