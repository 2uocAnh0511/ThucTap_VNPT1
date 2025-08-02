import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cookies] = useCookies(['user']);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Hàm lấy user ID từ token trong cookie
  const getUserIdFromToken = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        return decoded.id;
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    console.log("User ID:", userId);

    if (userId) {
      axios.get(`http://localhost:3000/api/carts/${userId}`)
        .then(res => {
          setCartItems(res.data.data);
          console.log(res.data.data);
        })
        .catch(err => {
          console.error('Lỗi khi tải giỏ hàng:', err);
        });
    }
  }, []);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  };

  const formatPrice = (value) => {
    return (value).toLocaleString('vi-VN') + '₫';
  };

  const removeItem = (itemId) => {
    axios.delete(`http://localhost:3000/api/carts/${itemId}`, {
      data: { user_id: getUserIdFromToken() }
    }).then(() => {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    }).catch(err => {
      console.error('Lỗi khi xóa sản phẩm:', err);
    });
  };

  // 👉 Hàm chuyển hướng đến trang đơn hàng
  const goToOrderDetail = () => {
    navigate('/order_detail');
  };
  const goToOrder = () => {
    navigate('/order');
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-light">
        <Card.Body>
          <h3 className="mb-4">Giỏ Hàng Của Bạn</h3>
          <Table striped bordered hover responsive className="border-light">
            <thead>
              <tr>
                <th>Hình Ảnh</th>
                <th>Sản Phẩm</th>
                <th>Giá</th>
                <th>Số Lượng</th>
                <th>Tổng</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td><Image src={item.product.image || "/default.png"} width={50} fluid /></td>
                  <td>{item.product.title}</td>
                  <td>{formatPrice(item.product.price)}</td>
                  <td>{item.qty}</td>
                  <td>{formatPrice(item.product.price * item.qty)}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeItem(item.id)}>Xóa</Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td colSpan={4}></td>
                <td><strong>Tổng cộng: {formatPrice(getTotal())}</strong></td>
                <td className="d-flex flex-column gap-2">
                  <Button variant="primary" size="sm"onClick={goToOrder}>Thanh Toán</Button>
                  <Button variant="success" size="sm" onClick={goToOrderDetail}>
                    Xem Đơn Hàng
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Cart;
