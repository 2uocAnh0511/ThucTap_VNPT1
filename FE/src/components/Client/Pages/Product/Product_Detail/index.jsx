import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Constanst from "../../../../../Constanst";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  const getUserIdFromToken = () => {
    const token = getCookie("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id;
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
    return null;
  };

  useEffect(() => {
    const token = getCookie("token");
    setIsAuthenticated(!!token);

    axios.get(`${Constanst.DOMAIN_API}/api/products/${id}`)
      .then(res => {
        if (!res.data.thumbnails) res.data.thumbnails = [];
        setProduct(res.data);
      })
      .catch(err => console.error("Lỗi khi lấy sản phẩm:", err));

    axios.get(`${Constanst.DOMAIN_API}/api/products/${id}/comments`)
      .then(res => setComments(res.data))
      .catch(err => console.error("Lỗi khi lấy bình luận:", err));
  }, [id]);

  const handleAddComment = () => {
    const token = getCookie("token");
    const userId = getUserIdFromToken();

    if (!token || !userId || newComment.trim() === "") {
      alert("Bạn cần đăng nhập để gửi bình luận.");
      return;
    }

    axios.post(`${Constanst.DOMAIN_API}/api/comments`, {
      content: newComment,
      user_id: userId,
      product_id: product.id,
    }).then(response => {
      setComments([...comments, response.data]);
      setNewComment("");
    }).catch(err => {
      console.error("Lỗi khi gửi bình luận:", err);
      alert("Có lỗi khi gửi bình luận.");
    });
  };

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }

    try {
      const res = await axios.post(`${Constanst.DOMAIN_API}/api/carts`, {
        user_id: parseInt(userId),
        product_id: product.id,
        qty: quantity,
      });
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  if (!product) return <div className="text-center mt-5">Đang tải chi tiết sản phẩm...</div>;

  return (
    <div className="container my-5">
      <div className="row g-5">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <img src={product.image} className="card-img-top rounded-top" alt={product.title}
              style={{ height: '350px', objectFit: 'cover' }} />
            <div className="d-flex justify-content-center flex-wrap p-3">
              {product.thumbnails.map((thumb, index) => (
                <img key={index} src={thumb} className="img-thumbnail m-1"
                  alt={`Thumbnail ${index + 1}`} style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 border rounded shadow-sm bg-white h-100 d-flex flex-column justify-content-between">
            <div>
              <h2 className="mb-2">{product.title}</h2>
              <p className="">Danh mục: <strong>{product.category_id?.name}</strong></p>
              <h4 className="text-danger mb-3">
                {product.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </h4>
              <p className="text-secondary">{product.short_description}</p>
              <p><strong>Tồn kho:</strong> {product.stock ?? 0}</p>
            </div>

            <div className="mt-4">
              <div className="d-flex align-items-center mb-3">
                <span className="me-2">Số lượng:</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleDecrease}>-</button>
                <span className="mx-3">{quantity}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleIncrease}>+</button>
              </div>

              <button
                className="btn btn-primary w-100"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                {product.stock === 0 ? "Hết hàng" : `Thêm ${quantity} vào giỏ hàng`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 border rounded shadow-sm bg-white">
        <h5 className="mb-3">Đánh giá sản phẩm</h5>
        <textarea className="form-control mb-2" rows={3}
          value={newComment} onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập đánh giá của bạn..." />
        <button className="btn btn-success" onClick={handleAddComment}>Gửi đánh giá</button>
        <ul className="mt-4 list-group">
          {comments.length === 0 ? (
            <li className="list-group-item text-muted">Chưa có đánh giá.</li>
          ) : (
            comments.map((comment, index) => (
              <li key={index} className="list-group-item">{comment.content}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;
