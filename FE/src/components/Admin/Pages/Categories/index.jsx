import { useEffect, useState } from "react";
import axios from "axios";
import Constanst from "../../../../Constanst";
import { Link } from "react-router-dom";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const CategoryAdmin = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    getData(currentPage, searchTerm);
  }, [currentPage]);

  const getData = async (page = 1, search = "") => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/categories`, {
        params: { page, limit, search },
      });

      const total = parseInt(res.data?.total || 0);
      setData(res.data?.data || []);
      setTotalPages(total > 0 ? Math.ceil(total / limit) : 1);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu:", error);
      setData([]);
      setTotalPages(1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getData(1, searchTerm);
  };

  const handleDelete = async ({ id }) => {
    try {
      await axios.delete(`${Constanst.DOMAIN_API}/api/categories/${id}`);
      setMessage("Xóa danh mục thành công");
      getData(currentPage, searchTerm);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const renderCategory = (category) => (
    <tr key={category.id}>
      <td>{category.id}</td>
      <td>{category.name}</td>
      <td>{category.status == 0 ? "Hiển thị" : "Ẩn"}</td>
      <td>
        <Link
          to={`/admin/Categories/editCategory?id=${category.id}`}
          className="btn btn-primary m-2"
        >
          Sửa
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => handleDelete({ id: category.id })}
        >
          Xóa
        </button>
      </td>
    </tr>
  );

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center mb-4">Quản Lý Danh Mục Sản Phẩm</h4>

          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Tìm theo tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="btn btn-sm btn-primary d-flex align-items-center gap-1"
              onClick={handleSearch}
            >
              <i className="bi bi-search" />
            </button>
          </div>

          {message && (
            <div className="alert alert-success text-center">{message}</div>
          )}

          <table className="table table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tên Danh Mục</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>{data.map(renderCategory)}</tbody>
          </table>

          <div className="d-flex justify-content-center mt-3">
            <div className="btn-group">
              <button
                className="btn btn-light"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                className="btn btn-light"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <FaChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`btn ${
                        page === currentPage ? "btn-primary" : "btn-light"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
              <button
                className="btn btn-light"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <FaChevronRight />
              </button>
              <button
                className="btn btn-light"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdmin;
