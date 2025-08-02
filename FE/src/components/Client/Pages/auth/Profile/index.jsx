import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { uploadToCloudinary } from '../../../../../Upload/uploadToCloudinary';
import Constants from '../../../../../Constanst';
import { toast } from "react-toastify";


export default function Profile() {
  const [cookies, setCookie] = useCookies(["user", "token"]);
  const token = cookies.token;

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", province: "", district: "", ward: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (cookies.user) {
      const u = typeof cookies.user === 'string' ? JSON.parse(cookies.user) : cookies.user;
      setUser(u);
      setFormData({
        name: u.name || "",
        phone: u.phone || "",
        province: u.province || "",
        district: u.district || "",
        ward: u.ward || "",
      });
      if (u.avatar) setAvatarPreview(u.avatar);
    }
    // load provinces
    axios.get(`${Constants.DOMAIN_API}/api/provinces`)
      .then(res => setProvinces(res.data))
      .catch(console.error);
  }, [cookies.user]);

  // load districts when province changes
  useEffect(() => {
    if (!formData.province) return;
    axios.get(`${Constants.DOMAIN_API}/api/districts/${formData.province}`)
      .then(res => setDistricts(res.data))
      .catch(console.error);
  }, [formData.province]);

  // load wards when district changes
  useEffect(() => {
    if (!formData.district) return;
    axios.get(`${Constants.DOMAIN_API}/api/wards/${formData.district}`)
      .then(res => setWards(res.data))
      .catch(console.error);
  }, [formData.district]);

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      // 1. Update text fields
      const updateRes = await axios.put(
        `${Constants.DOMAIN_API}/api/auth/profile`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 2. If avatarFile present, upload then update avatar
      if (avatarFile) {
        const uploadRes = await uploadToCloudinary(avatarFile);
        const avatarUrl = uploadRes.secure_url || uploadRes.url;
        await axios.put(
          `${Constants.DOMAIN_API}/api/auth/profile`,
          { avatar: avatarUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const newUser = updateRes.data.user;
      setCookie('user', JSON.stringify(newUser), { path: '/', sameSite: 'lax' });
      toast.success('Cập nhật thành công');
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật thất bại');
    }
  };

  if (!user) return <Container className="mt-5 text-center"><h4>Không tìm thấy người dùng</h4></Container>;

  return (
    <Container className="mt-5">
      <Card className="p-4 rounded-4 shadow-sm">
        <Card.Header className="bg-transparent text-center">
          <h2 className="fw-bold">Cập nhật thông tin</h2>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            <Col md={4} className="text-center">
              {avatarPreview && <img src={avatarPreview} alt="Avatar" className="rounded-circle mb-2" style={{width:120, height:120, objectFit:'cover'}}/>}
              <Button variant="outline-secondary" onClick={()=>fileRef.current.click()}>Đổi avatar</Button>
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleAvatarSelect}/>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleInput}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control name="phone" value={formData.phone} onChange={handleInput}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Row className="g-2">
                  <Col>
                    <Form.Select name="province" value={formData.province} onChange={handleInput}>
                      <option value="">Chọn tỉnh</option>
                      {provinces.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Select name="district" value={formData.district} onChange={handleInput} disabled={!districts.length}>
                      <option value="">Chọn huyện</option>
                      {districts.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Select name="ward" value={formData.ward} onChange={handleInput} disabled={!wards.length}>
                      <option value="">Chọn xã/phường</option>
                      {wards.map(w=> <option key={w.id} value={w.id}>{w.name}</option>)}
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={handleSave}>Lưu</Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
