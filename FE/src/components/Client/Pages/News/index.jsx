import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Constants from "../../../../Constanst";

const NewsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const fetchBlogs = async (page) => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/api/blogs`, {
        params: { page, limit, status: 1 }
      });
      setBlogs(res.data.data);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error("Lỗi lấy blog:", err);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        {pages}
        <button
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Tin tức & Xu hướng</h2>
      <div className="row">
        {blogs.map((news) => (
          <div key={news.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <img
                src={news.image || "/images/placeholder.jpg"}
                className="card-img-top"
                alt={news.title}
                style={{ height: "250px", objectFit: "cover", width: "100%" }}
              />
              <div className="card-body d-flex flex-column justify-content-between" style={{ height: "250px" }}>
                <div>
                  <h5 className="text-truncate" title={news.title}>{news.title}</h5>
                  <p className="text-muted">
                    {news.created_at ? new Date(news.created_at).toLocaleDateString("vi-VN") : "Chưa rõ ngày"}
                  </p>
                  <p className="text-truncate" title={news.content}>
                    {news.content?.replace(/<[^>]+>/g, "").substring(0, 100)}...
                  </p>
                </div>
                <Link to={`/blog/${news.id}`} className="btn btn-primary btn-sm mt-2">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default NewsPage;
