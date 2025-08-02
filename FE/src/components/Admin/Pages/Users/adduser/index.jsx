import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Constanst from "../../../../../Constanst";

const AddUser = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                role: Number(data.role)
            };

            const res = await axios.post(`${Constanst.DOMAIN_API}/api/users`, payload);
            if (res.status === 201 || res.status === 200) {
                alert("Thêm người dùng thành công!");
                navigate("/admin/user");
            } else {
                alert("Đã xảy ra lỗi khi thêm người dùng.");
            }
        } catch (error) {
            console.error("Lỗi thêm người dùng:", error);
            alert("Lỗi khi thêm người dùng. Vui lòng kiểm tra lại.");
        }
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h4 className="mb-4">Thêm Người Dùng Mới</h4>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Họ tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập họ tên"
                                        {...register("name", {
                                            required: "Họ tên không được để trống.",
                                        })}
                                    />
                                    {errors.name && (
                                        <span className="text-danger">{errors.name.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        {...register("phone", {
                                            required: "Số điện thoại không được để trống.",
                                            pattern: {
                                                value: /^[0-9]{10,11}$/,
                                                message: "Số điện thoại không hợp lệ.",
                                            },
                                        })}
                                    />
                                    {errors.phone && (
                                        <span className="text-danger">{errors.phone.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        {...register("email", {
                                            required: "Email không được để trống.",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Email không hợp lệ.",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <span className="text-danger">{errors.email.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        {...register("password", {
                                            required: "Mật khẩu không được để trống.",
                                            minLength: {
                                                value: 6,
                                                message: "Mật khẩu phải có ít nhất 6 ký tự.",
                                            },
                                        })}
                                    />
                                    {errors.password && (
                                        <span className="text-danger">{errors.password.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập địa chỉ"
                                        {...register("address", {
                                            required: "Địa chỉ không được để trống.",
                                        })}
                                    />
                                    {errors.address && (
                                        <span className="text-danger">{errors.address.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vai trò</Form.Label>
                                    <Form.Select
                                        {...register("role", {
                                            required: "Vui lòng chọn vai trò.",
                                            validate: (value) =>
                                                value !== "" || "Vai trò không hợp lệ.",
                                        })}
                                    >
                                        <option value="">Chọn vai trò</option>
                                        <option value="1">Admin</option>
                                        <option value="0">Khách hàng</option>
                                    </Form.Select>
                                    {errors.role && (
                                        <span className="text-danger">{errors.role.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-start gap-2">
                            <Button variant="primary" type="submit">
                                Thêm Người Dùng
                            </Button>
                            <Link className="btn btn-danger btn-sm me-3" to={"/admin/user"}>
                                Hủy
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddUser;
