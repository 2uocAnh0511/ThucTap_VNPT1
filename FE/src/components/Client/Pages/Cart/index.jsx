import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Constants from '../../../../Constanst';

function Cart() {
  const [cookies] = useCookies(['user']);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id;
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      axios.get(`${Constants.DOMAIN_API}/api/carts/${userId}`)
        .then(res => {
          setCartItems(res.data.data);
        })
        .catch(err => {
          console.error('Lỗi khi tải giỏ hàng:', err);
        });
    }
  }, []);

  const formatPrice = (value) => {
    return Number(value).toLocaleString('vi-VN') + '₫';
  };

  const removeItem = (itemId) => {
    axios.delete(`${Constants.DOMAIN_API}/api/carts/${itemId}`, {
      data: { user_id: getUserIdFromToken() }
    }).then(() => {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }).catch(err => {
      console.error('Lỗi khi xóa sản phẩm:', err);
    });
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      const allIds = cartItems.map(item => item.id);
      setSelectedItems(allIds);
    }
  };

  const getTotalSelected = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.product.price * item.qty, 0);
  };

  const goToOrder = () => {
    if (selectedItems.length === 0) {
      setError('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    const selected = cartItems.filter(item => selectedItems.includes(item.id));
    navigate('/order', { state: { checkoutData: selected } });
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-light">
        <Card.Body>
          <h3 className="mb-4 fw-bold">🛒 Giỏ Hàng Của Bạn</h3>

          {error && (
            <Alert variant="warning" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {cartItems.length > 0 ? (
            <>
              <Table striped bordered hover responsive>
                <thead className="table-light text-center">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        title="Chọn tất cả"
                      />
                    </th>
                    <th>Hình Ảnh</th>
                    <th>Sản Phẩm</th>
                    <th>Giá</th>
                    <th>Số Lượng</th>
                    <th>Thành Tiền</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                        />
                      </td>
                      <td><Image src={item.product.image || "/default.png"} width={60} rounded /></td>
                      <td>{item.product.title}</td>
                      <td>{formatPrice(item.product.price)}</td>
                      <td>{item.qty}</td>
                      <td>{formatPrice(item.product.price * item.qty)}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => removeItem(item.id)}>
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <h5 className="text-end mb-0">
                  Tổng tiền đã chọn: <span className="text-danger fw-bold">{formatPrice(getTotalSelected())}</span>
                </h5>

                <Button variant="success" onClick={goToOrder}>
                  Thanh toán sản phẩm đã chọn
                </Button>
              </div>
            </>
          ) : (
            <Alert variant="info" className="text-center">
              Giỏ hàng của bạn đang trống.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Cart;
