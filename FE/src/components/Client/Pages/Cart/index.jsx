// giữ nguyên import của bạn
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
import { toast } from 'react-toastify';

function Cart() {
  const [cookies] = useCookies(['user']);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePromotions, setActivePromotions] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
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

  useEffect(() => {
    const total = getTotalSelected();
    const safeTotal = total > 0 ? total : 0.01;

    axios.get(`${Constants.DOMAIN_API}/api/active`, {
      params: { orderTotal: safeTotal }
    })
      .then(res => setActivePromotions(res.data.data || []))
      .catch(err => {
        console.error("Lỗi khi tải voucher:", err);
        setActivePromotions([]);
      });
  }, [selectedItems]);

  const formatPrice = (value) => Number(value).toLocaleString('vi-VN') + '₫';

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

  const totalPrice = getTotalSelected();

  const calculateDiscount = () => {
    if (!selectedVoucher || totalPrice < selectedVoucher.min_price_threshold) return 0;
    return selectedVoucher.discount_type === 'percentage'
      ? (totalPrice * selectedVoucher.discount_value) / 100
      : selectedVoucher.discount_value;
  };

  const discountAmount = calculateDiscount();
  const finalPrice = totalPrice - discountAmount;

  const handleClearPromoCode = () => {
    setPromoCode('');
  };

  const handleApplyDiscount = async () => {
    if (!promoCode || selectedItems.length === 0) {
      toast.error("Vui lòng nhập mã và chọn sản phẩm.");
      return;
    }

    setIsLoading(true);

    try {
      const total = getTotalSelected();
      const res = await axios.post(`${Constants.DOMAIN_API}/api/promotions/apply`, {
        code: promoCode,
        orderTotal: total,
      }, {
        headers: {
          Authorization: `Bearer ${cookies.token}`
        }
      });

      const data = res.data.data;
      toast.success(res.data.message);

      setSelectedVoucher({
        id: data.promotion_id,
        discount_type: data.discountType,
        discount_value: data.discountValue,
        min_price_threshold: 0,
        ...data
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi áp dụng mã giảm giá.");
      setSelectedVoucher(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
  };

  const goToOrder = () => {
    if (selectedItems.length === 0) {
      setError('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    const selected = cartItems.filter(item => selectedItems.includes(item.id));
    navigate('/order', {
      state: {
        checkoutData: selected,
        selectedVoucher,
        discountAmount,
        finalPrice
      }
    });
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
                    <th><Form.Check type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} title="Chọn tất cả" /></th>
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
                      <td><Button variant="danger" size="sm" onClick={() => removeItem(item.id)}>Xóa</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                <div>
                  <h5 className="mb-1">Tổng tiền đã chọn: <span className="fw-bold text-primary">{formatPrice(totalPrice)}</span></h5>
                  {selectedVoucher && (
                    <>
                      <div>Giảm giá: <span className="text-success fw-semibold">
                        {discountAmount > 0 ? `- ${formatPrice(discountAmount)}` : 'Không đủ điều kiện áp dụng'}
                      </span></div>
                      <div>Tổng thanh toán: <span className="fw-bold text-danger">{formatPrice(finalPrice)}</span></div>
                    </>
                  )}
                </div>

                <Button variant="success" onClick={goToOrder}>Thanh toán sản phẩm đã chọn</Button>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
                <Form.Control
                  type="text"
                  placeholder="Mã giảm giá"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ maxWidth: "200px" }}
                />
                {promoCode && (
                  <Button variant="outline-secondary" onClick={handleClearPromoCode}>✕</Button>
                )}
                <Button variant="dark" onClick={handleApplyDiscount} disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Áp dụng"}
                </Button>
              </div>

              <div className="mt-4 max-w-md max-h-[300px] overflow-y-auto">
                <h5 className="fw-semibold">Chọn Voucher</h5>
                {isLoading ? (
                  <p>Đang tải voucher...</p>
                ) : (
                  <>
                    {activePromotions.length === 0 && <p>Không có voucher khả dụng.</p>}
                    {activePromotions.map((voucher) => {
                      const disabled = totalPrice < voucher.min_price_threshold;
                      const isSelected = selectedVoucher?.id === voucher.id;
                      return (
                        <div
                          key={voucher.id}
                          className={`border p-3 mb-2 rounded ${isSelected ? "border-success" : "border-secondary"} ${disabled ? "opacity-50" : "cursor-pointer"}`}
                          onClick={() => !disabled && handleVoucherSelect(voucher)}
                        >
                          <strong>{voucher.name}</strong> - {voucher.discount_type === 'percentage'
                            ? `Giảm ${voucher.discount_value}%`
                            : `Giảm ${formatPrice(voucher.discount_value)}`}
                          <div>Đơn tối thiểu: {formatPrice(voucher.min_price_threshold)}</div>
                          {voucher.end_date && (
                            <div>HSD: {new Date(voucher.end_date).toLocaleDateString('vi-VN')}</div>
                          )}
                          <div>Còn lại: {voucher.quantity} lượt</div>
                        </div>
                      );
                    })}
                  </>
                )}
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
