import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
<<<<<<< HEAD
import { useLocation } from "react-router-dom";
=======
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
<<<<<<< HEAD
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

=======
import { jwtDecode } from "jwt-decode";

// ... phần import giữ nguyên

function Orders() {
  const [cookies] = useCookies(["user"]);
  const [orderItems, setOrderItems] = useState([]);
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    phone: "",
<<<<<<< HEAD
    email: "",
    paymentMethod: "cod",
  });

=======
    paymentMethod: "cod", // mặc định thanh toán khi nhận hàng
  });

  // Lấy user ID từ token trong cookie
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
  const getUserIdFromToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
<<<<<<< HEAD
=======

>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
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

<<<<<<< HEAD
=======
  
    useEffect(() => {
      initUserDataFromToken();
    }, []);
    
  
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
  const initUserDataFromToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
<<<<<<< HEAD

    if (token) {
      try {
        const decoded = jwtDecode(token);
=======
  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
  
        // Gọi API lấy giỏ hàng theo user ID
        axios
          .get(`http://localhost:3000/api/carts/${userId}`)
          .then((res) => {
            setOrderItems(res.data.data);
          })
          .catch((err) => {
            console.error("Lỗi khi tải giỏ hàng:", err);
          });
  
        // Gán thông tin user vào form
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
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
<<<<<<< HEAD

  useEffect(() => {
    initUserDataFromToken();
  }, []);
=======
  
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d

  const getTotal = () => {
    return orderItems.reduce(
      (acc, item) => acc + item.product.price * item.qty,
      0
    );
  };

  const formatPrice = (value) => {
<<<<<<< HEAD
    return value.toLocaleString("vi-VN") + "₫";
=======
    return (value ).toLocaleString("vi-VN") + "₫";
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
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
<<<<<<< HEAD
    if (!userId) return toast.error("Không xác định được người dùng!");

    if (orderItems.length === 0) {
      return toast.warning("Không có sản phẩm nào để thanh toán.");
    }
=======
    if (!userId) return alert("Không xác định được người dùng!");
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d

    const paymentData = {
      user_id: userId,
      full_name: form.fullName,
      address: form.address,
      phone: form.phone,
<<<<<<< HEAD
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
=======
      email: form.email || '',
      payment_method: form.paymentMethod,
      total: getTotal(),
    };

    axios
      .post("http://localhost:3000/api/orders", paymentData)
      .then((res) => {
        alert("Thanh toán thành công!");
        initUserDataFromToken();
        // Có thể reset form hoặc load lại danh sách đơn hàng
      })
      .catch((err) => {
        console.error("Lỗi khi thanh toán:", err);
        alert("Thanh toán thất bại.");
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
      });
  };

  return (
    <Container className="mt-4">
<<<<<<< HEAD
      <ToastContainer />
      <Card className="shadow-sm border-light">
        <Card.Body>
          <h3 className="mb-4">Giỏ Hàng Của Bạn</h3>
=======
      <Card className="shadow-sm border-light">
        <Card.Body>
          <h3 className="mb-4">Giỏ Hàng Của Bạn</h3>{" "}
          {/* ✅ Tiêu đề đã sửa ở đây */}
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
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

<<<<<<< HEAD
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
=======
      {/* Form thanh toán */}
      <Card className="shadow-sm border-light mt-4">
        <Card.Body>
          <h4>Thông Tin Thanh Toán</h4>
          <Form>
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
            <Button variant="success" onClick={handlePayment}>
              Thanh Toán Ngay
            </Button>
>>>>>>> 22408f7aa3788672996b07d02b94359950f58b9d
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Orders;
