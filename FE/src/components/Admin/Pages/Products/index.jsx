import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constanst from "../../../../Constanst";

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
            console.log("Products fetched:", res.data);
            if (res.data.data && res.data.data) {
                setProducts(res.data.data);
            } else {
                setError("No product data found.");
            }
            setLoading(false);
        } catch (e) {
            console.log("API call error:", e);
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const response = await axios.delete(`${Constanst.DOMAIN_API}/api/products/${productId}`);

                if (response.status === 200) {
                    fetchProducts();
                    alert("Xóa sản phẩm thành công!");
                } else {
                    alert("Lỗi khi xóa sản phẩm!");
                }
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error);
                alert("Lỗi khi xóa sản phẩm!");
            }
        }
    };

    const renderProduct = (product, index) => {
        return (
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
                <td>{product.price?.toLocaleString('vi-VN') || "N/A"} VND</td>
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
    };

    if (loading) {
        return <p className="text-center mt-3">Đang tải dữ liệu sản phẩm...</p>;
    }

    if (error) {
        return <p className="text-danger text-center mt-3">{error}</p>;
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title fw-bold text-center mb-4">Quản Lý Sản Phẩm</h4>
                    <div className="mb-3">
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Hình Ảnh</th>
                                    <th scope="col">Tên Sản Phẩm</th>
                                    <th scope="col">Giá</th>
                                    <th scope="col">Danh Mục</th>
                                    <th scope="col">Mô Tả</th> {/* New column for description */}
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
