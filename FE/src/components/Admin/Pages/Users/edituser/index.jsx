import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import Constanst from "../../../../../Constanst"; // đường dẫn đến hằng số API
import { Link } from "react-router-dom";

const EditUser = () => {
    const location = useLocation(); // Lấy thông tin từ URL
    const queryParams = new URLSearchParams(location.search); // Lấy các query params
    const id = queryParams.get("id"); // Lấy giá trị của query param 'id'
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    // Sử dụng useForm để quản lý form
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    // Lấy thông tin người dùng từ API
    useEffect(() => {
        if (!id) {
            console.error("Không có ID người dùng trong URL");
            return;
        }
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${Constanst.DOMAIN_API}/api/users/${id}`);
                console.log(res);  // Log toàn bộ để kiểm tra

                if (res && res.data) {
                    const userData = res.data;
                    setUser(userData);
                    setValue("name", userData.name);
                    setValue("email", userData.email);
                    setValue("phone", userData.phone);
                    setValue("address", userData.address);
                    setValue("role", userData.role?.toString()); // Set giá trị role
                } else {
                    console.error("Không tìm thấy dữ liệu người dùng");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUserData();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            // Nếu người dùng không nhập mật khẩu mới thì xóa khỏi object gửi đi
            if (!data.password) {
                delete data.password;
            }

            // Chuyển role sang số
            const payload = {
                ...data,
                role: Number(data.role),
            };

            // Gửi dữ liệu lên API để cập nhật người dùng
            await axios.put(`${Constanst.DOMAIN_API}/api/users/${id}`, payload);
            alert("Cập nhật thông tin người dùng thành công!");
            navigate("/admin/user"); // Sau khi cập nhật thành công, chuyển về danh sách người dùng
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        }
    };

    if (!user) {
        return <div>Đang tải dữ liệu...</div>; // Chờ khi có dữ liệu người dùng
    }

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h4 className="mb-4">Chỉnh Sửa Người Dùng</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="userName">
                                    <Form.Label>Họ và Tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập họ tên"
                                        {...register("name", {
                                            required: "Họ tên không được bỏ trống",
                                            minLength: {
                                                value: 4,
                                                message: "Họ tên phải có ít nhất 4 ký tự",
                                            }
                                        })}
                                        disabled />
                                    {errors.name && <small className="text-danger">{errors.name.message}</small>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="userEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        {...register("email", {
                                            required: "Email không được bỏ trống",
                                            pattern: {
                                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                message: "Email không hợp lệ"
                                            }
                                        })}
                                        disabled />
                                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="userPhone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        {...register("phone", {
                                            required: "Số điện thoại không được bỏ trống",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Số điện thoại phải có 10 chữ số"
                                            }
                                        })}
                                        disabled />
                                    {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="userAddress">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập địa chỉ"
                                        {...register("address", {
                                            required: "Địa chỉ không được bỏ trống",
                                        })}
                                        disabled />
                                    {errors.address && <small className="text-danger">{errors.address.message}</small>}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vai trò</Form.Label>
                                    <Form.Select
                                        {...register("role", {
                                            required: "Vui lòng chọn vai trò",
                                            validate: value => value !== "" || "Vai trò không hợp lệ",
                                        })}
                                        disabled>
                                        <option value="">Chọn vai trò</option>
                                        <option value="1">Admin</option>
                                        <option value="0">Khách hàng</option>
                                    </Form.Select>
                                    {errors.role && (
                                        <small className="text-danger">{errors.role.message}</small>
                                    )}
                                </Form.Group>
                            </Col>

                            <div className="d-flex justify-content-start gap-2">
                                {/* <Button variant="primary" type="submit">Lưu Thay Đổi</Button> */}
                                <Link className="btn btn-danger btn-sm me-3" to="/admin/user">Trở lại</Link>
                            </div>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditUser;
