import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Constanst from "../../../../../Constanst";

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
  

  useEffect(() => {
    // Check if user is authenticated (e.g., by checking if token exists)
    const token = getCookie("token");
setIsAuthenticated(!!token); // chuyển sang true nếu có token


    // Fetch product details
    axios.get(`${Constanst.DOMAIN_API}/api/products/${id}`)
      .then(res => {
        if (!res.data.thumbnails) res.data.thumbnails = [];
        setProduct(res.data);
      })
      .catch(err => console.error("Lỗi khi lấy sản phẩm:", err));
  
    // Lấy bình luận của sản phẩm
    axios.get(`${Constanst.DOMAIN_API}/api/products/${id}/comments`) // Đảm bảo URL này chính xác
    .then(res => {
      setComments(res.data);  // Lưu dữ liệu vào state
    })
    .catch(err => console.error("Lỗi khi lấy bình luận:", err)); 
  }, [id]);
  

  if (!product) {
    return <div className="text-center mt-5">Đang tải chi tiết sản phẩm...</div>;
  }

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Bạn cần đăng nhập để gửi bình luận.");
        return;
      }

      // Gửi bình luận mới tới server
      const userId = 1; // Thay bằng ID người dùng thực tế khi đăng nhập
      const productId = product.id;

      axios.post(`${Constanst.DOMAIN_API}/api/comments`, {
        content: newComment,
        user_id: userId, // Đảm bảo bạn truyền ID người dùng đúng
        product_id: productId,
      })
        .then(response => {
          // Sau khi gửi thành công, cập nhật giao diện (ví dụ: làm mới danh sách bình luận)
          setComments([...comments, response.data]);
          setNewComment(""); // Reset lại ô nhập bình luận
        })
        .catch(err => {
          console.error("Lỗi khi gửi bình luận:", err);
          alert("Có lỗi khi gửi bình luận.");
        });
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }
  
    const userCookieRaw = getCookie("user");
let userId = null;



if (userCookieRaw) {
  try {
    const decoded = decodeURIComponent(userCookieRaw); // Giải mã URL
    const userObj = JSON.parse(decoded);               // Parse JSON
    userId = userObj.id;
  } catch (error) {
    console.error("Lỗi khi parse cookie user:", error);
  }
}

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
  
      
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };
  

  return (
    <div className="container my-5">
      <div className="row g-5">
        {/* Hình ảnh sản phẩm */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <img
              src={product.image}
              className="card-img-top rounded-top"
              alt={product.title}
              style={{ height: '350px', objectFit: 'cover' }}
            />
            <div className="d-flex justify-content-center flex-wrap p-3">
              {product.thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  className="img-thumbnail m-1"
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Thông tin sản phẩm */}
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

            {/* Chọn số lượng + thêm vào giỏ */}
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

      {/* Bình luận */}
      <div className="mt-5 p-4 border rounded shadow-sm bg-white">
        <h5 className="mb-3">Đánh giá sản phẩm</h5>
        <textarea
          className="form-control mb-2"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập đánh giá của bạn..."
        />
        <button className="btn btn-success" onClick={handleAddComment}>Gửi đánh giá</button>
        <ul className="mt-4 list-group">
          {comments.length === 0 ? (
            <li className="list-group-item text-muted">Chưa có đánh giá.</li>
          ) : (
            comments.map((comment, index) => (
              <li key={index} className="list-group-item">{comment.content}</li> // Assuming each comment has 'content' property
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetail;
