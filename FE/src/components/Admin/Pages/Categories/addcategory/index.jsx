import { Link } from "react-router-dom";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import Constanst from "../../../../../Constanst";
import { useState } from "react";

const AddCategory = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleAdd = async (props) => {
        setServerError("");
        setSuccessMessage("");

        try {
            const data = {
                name: props.name,
                status: props.status,
            };

            const res = await axios.post(`${Constanst.DOMAIN_API}/api/categories`, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            // Hiển thị thông báo thành công
            setSuccessMessage("Thêm danh mục thành công!");

            // Reset form
            reset();

            // (Tùy chọn) Chuyển trang sau vài giây
            setTimeout(() => {
                navigate("/admin/Categories");
            }, 1500);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
            } else {
                setServerError("Đã xảy ra lỗi khi thêm danh mục!");
            }
        }
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h4 className="mb-4">Thêm Danh Mục Sản Phẩm</h4>

                    {serverError && <Alert variant="danger">{serverError}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Form onSubmit={handleSubmit(handleAdd)}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên danh mục"
                                {...register("name", {
                                    required: "Tên danh mục không được để trống!",
                                    minLength: {
                                        value: 6,
                                        message: "Tên danh mục phải ít nhất 6 ký tự!",
                                    },
                                })}
                            />
                            {errors.name && (
                                <small className="text-danger">{errors.name.message}</small>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="status">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                {...register("status", {
                                    required: "Vui lòng chọn trạng thái!",
                                })}
                            >
                                <option value="">-- Chọn trạng thái --</option>
                                <option value="0">Hiển thị</option>
                                <option value="1">Ẩn</option>
                            </Form.Select>
                            {errors.status && (
                                <small className="text-danger">{errors.status.message}</small>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-start gap-2">
                            <Button variant="primary" type="submit">
                                Lưu
                            </Button>
                            <Link className="btn btn-danger btn-sm me-3" to="/admin/Categories">
                                Hủy
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddCategory;
