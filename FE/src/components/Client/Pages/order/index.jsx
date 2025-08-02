import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { jwtDecode } from "jwt-decode";
import Constants from "../../../../Constanst";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Orders() {
  const location = useLocation();
  const [cookies] = useCookies(["user"]);
  const selectedOrderItems = location.state?.checkoutData || [];
  const [orderItems, setOrderItems] = useState(selectedOrderItems);

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "cod",
  });

  const getUserIdFromToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
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

  const initUserDataFromToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setForm((prev) => ({
          ...prev,
          fullName: decoded.name || "",
          email: decoded.email || "",
          address: decoded.address || "",
          phone: decoded.phone || "",
        }));
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
  };

  useEffect(() => {
    initUserDataFromToken();
  }, []);

  const getTotal = () => {
    return orderItems.reduce(
      (acc, item) => acc + item.product.price * item.qty,
      0
    );
  };

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN") + "₫";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = () => {
    const userId = getUserIdFromToken();
    if (!userId) return toast.error("Không xác định được người dùng!");

    if (orderItems.length === 0) {
      return toast.warning("Không có sản phẩm nào để thanh toán.");
    }

    const paymentData = {
      user_id: userId,
      full_name: form.fullName,
      address: form.address,
      phone: form.phone,
      email: form.email || "",
      payment_method: form.paymentMethod,
      total: getTotal(),
      items: orderItems.map((item) => ({
        cart_id: item.id,
        product_id: item.product.id,
        quantity: item.qty,
      })),
    };

    axios
      .post(`${Constants.DOMAIN_API}/api/orders`, paymentData)
      .then((res) => {
        toast.success("Thanh toán thành công!");
        // Optionally: redirect or clear state
      })
      .catch((err) => {
        console.error("Lỗi khi thanh toán:", err);
        toast.error("Thanh toán thất bại. Vui lòng thử lại.");
      });
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
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
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Image
                      src={item.product.image || "/default.png"}
                      width={50}
                      fluid
                    />
                  </td>
                  <td>{item.product.title}</td>
                  <td>{formatPrice(item.product.price)}</td>
                  <td>{item.qty}</td>
                  <td>{formatPrice(item.product.price * item.qty)}</td>
                  <td>{item.status || "Đang xử lý"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td colSpan={4}></td>
                <td>
                  <strong>Tổng cộng: {formatPrice(getTotal())}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-light mt-4">
        <Card.Body>
          <h4 className="mb-4">Thông Tin Thanh Toán</h4>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ tên..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ giao hàng</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Phương thức thanh toán</Form.Label>
                  <Form.Select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                    <option value="banking">Chuyển khoản ngân hàng</option>
                    <option value="momo">Momo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="success" onClick={handlePayment}>
                Thanh Toán Ngay
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Orders;
