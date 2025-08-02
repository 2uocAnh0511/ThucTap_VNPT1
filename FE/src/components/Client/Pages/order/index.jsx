import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { jwtDecode } from "jwt-decode";

// ... phần import giữ nguyên

function Orders() {
  const [cookies] = useCookies(["user"]);
  const [orderItems, setOrderItems] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    phone: "",
    paymentMethod: "cod", // mặc định thanh toán khi nhận hàng
  });

  // Lấy user ID từ token trong cookie
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

  
    useEffect(() => {
      initUserDataFromToken();
    }, []);
    
  
  const initUserDataFromToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  
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
  

  const getTotal = () => {
    return orderItems.reduce(
      (acc, item) => acc + item.product.price * item.qty,
      0
    );
  };

  const formatPrice = (value) => {
    return (value ).toLocaleString("vi-VN") + "₫";
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
    if (!userId) return alert("Không xác định được người dùng!");

    const paymentData = {
      user_id: userId,
      full_name: form.fullName,
      address: form.address,
      phone: form.phone,
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
      });
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-light">
        <Card.Body>
          <h3 className="mb-4">Giỏ Hàng Của Bạn</h3>{" "}
          {/* ✅ Tiêu đề đã sửa ở đây */}
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
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Orders;
