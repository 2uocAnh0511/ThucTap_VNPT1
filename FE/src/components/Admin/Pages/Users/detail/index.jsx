import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import Constants from "../../../../../Constanst";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${Constants.DOMAIN_API}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` }
        });
        console.log("API response:", res.data);
        if (!res.data) throw new Error("Người dùng không tồn tại");
        setUser({ ...res.data, isBlocked: res.data.status === 0 });
      } catch (err) {
        console.error("Lỗi khi tải chi tiết người dùng:", err);
        const msg = err.response?.data?.error || "Lỗi khi tải chi tiết người dùng";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, cookies.token]);

  const toggleStatus = async () => {
    try {
      await axios.patch(`${Constants.DOMAIN_API}/api/users/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${cookies.token}` }
      });
      setUser(prev => ({ ...prev, isBlocked: !prev.isBlocked, status: prev.status === 1 ? 0 : 1 }));
      toast.success("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      toast.error(err.response?.data?.error || "Lỗi khi cập nhật trạng thái");
    }
  };

  const handleBack = () => {
    navigate("/admin/user");
  };

  if (loading) return <Container className="mt-5"><div className="text-center">Đang tải...</div></Container>;
  if (error || !user) return (
    <Container className="mt-5">
      <div className="alert alert-danger">{error || "Không tìm thấy người dùng"}</div>
      <Button variant="secondary" onClick={handleBack}>Quay lại</Button>
    </Container>
  );

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h4 className="mb-4 text-left">Chi Tiết Người Dùng</h4>
          <Row>
            <Col md={12} className="text-center mb-4">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="rounded-circle"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label font-medium d-block">Họ Tên</label>
                <p className="form-control">{user.name}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label font-medium d-block">Email</label>
                <p className="form-control">{user.email}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label font-medium d-block">Địa chỉ</label>
                <p className="form-control">{user.address || "Không có"}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label font-medium d-block">Số điện thoại</label>
                <p className="form-control">{user.phone || "Không có"}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label font-medium d-block">Trạng thái</label>
                <p className={`form-control ${user.isBlocked ? "bg-warning-subtle text-warning" : "bg-success-subtle text-success"}`}>
                  {user.isBlocked ? "Khóa" : "Hoạt động"}
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label className="form-label font-medium d-block">Vai trò</label>
                <p className="form-control">{user.role === 1 ? "Admin" : "Khách hàng"}</p>
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-start gap-2">
            <Button variant="secondary" onClick={handleBack}>Quay lại</Button>
            <Button variant={user.isBlocked ? "success" : "warning"} onClick={toggleStatus}>
              {user.isBlocked ? "Mở khóa" : "Khóa"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewUser;