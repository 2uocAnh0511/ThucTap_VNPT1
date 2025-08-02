import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constanst from "../../../../Constanst";
import { toast } from "react-toastify"; // ✅ toast
import Swal from "sweetalert2";         // ✅ confirm

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${Constanst.DOMAIN_API}/api/products`);
    if (res.data.data) {
      const sorted = res.data.data.sort((a, b) => b.id - a.id); // sắp xếp mới nhất trước
      setProducts(sorted);
    } else {
      toast.warn("Không tìm thấy dữ liệu sản phẩm.");
      setError("Không tìm thấy dữ liệu sản phẩm.");
    }
  } catch (e) {
    console.error("API call error:", e);
    toast.error("Lỗi khi tải dữ liệu sản phẩm!");
    setError("Lỗi khi tải dữ liệu sản phẩm.");
  } finally {
    setLoading(false);
  }
};


  const handleDeleteProduct = async (productId) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Sản phẩm sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axios.delete(`${Constanst.DOMAIN_API}/api/products/${productId}`);

        if (response.status === 200) {
          toast.success("Xóa sản phẩm thành công!"); // ✅
          fetchProducts();
        } else {
          toast.error("Lỗi khi xóa sản phẩm!"); // ✅
        }
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        toast.error("Đã xảy ra lỗi khi xóa sản phẩm!"); // ✅
      }
    }
  };

  const renderProduct = (product, index) => (
    <tr key={index}>
      <td>{product.id}</td>
      <td>
        {product.image ? (
          <img
            src={`${product.image}`}
            alt={product.title}
            className="img-thumbnail rounded"
            style={{ width: "50px", height: "auto" }}
          />
        ) : (
          <span>Không có ảnh</span>
        )}
      </td>
      <td>{product.title}</td>
      <td>{product.price?.toLocaleString("vi-VN") || "N/A"} VND</td>
      <td>{product.category?.name || "N/A"}</td>
      <td title={product.short_description}>
        {product.short_description
          ? product.short_description.length > 20
            ? `${product.short_description.slice(0, 20)}...`
            : product.short_description
          : "Không có mô tả"}
      </td>
      <td>
        <Link
          to={`/admin/products/EditProduct?id=${product.id}`}
          className="btn btn-primary btn-sm me-2"
        >
          Sửa
        </Link>
        <button
          onClick={() => handleDeleteProduct(product.id)}
          className="btn btn-danger btn-sm"
        >
          Xóa
        </button>
      </td>
    </tr>
  );

  if (loading) return <p className="text-center mt-3">Đang tải dữ liệu sản phẩm...</p>;
  if (error) return <p className="text-danger text-center mt-3">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title fw-bold text-center mb-4">Quản Lý Sản Phẩm</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Hình Ảnh</th>
                  <th scope="col">Tên Sản Phẩm</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Danh Mục</th>
                  <th scope="col">Mô Tả</th>
                  <th scope="col">Thao Tác</th>
                </tr>
              </thead>
              <tbody>{products.map(renderProduct)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdmin;
