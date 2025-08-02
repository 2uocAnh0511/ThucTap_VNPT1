import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import Constanst from "../../../../../Constanst";
import { useEffect, useState } from "react";

const EditCategory = () => {
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm();

    useEffect(() => {
        const id = queryParams.get("id");
        if (id) getCategoryInfo(id);
    }, []);

    const getCategoryInfo = async (id) => {
        try {
            const res = await axios.get(`${Constanst.DOMAIN_API}/api/categories/${id}`);
            setValue("name", res.data.name);
            setValue("status", res.data.status.toString());
        } catch (e) {
            console.log("Error get category:", e);
        }
    };

    const updateCategory = async (data) => {
        setServerError("");
        setSuccessMessage("");

        try {
            const id = queryParams.get("id");
            if (!id) return;

            const res = await axios.put(`${Constanst.DOMAIN_API}/api/categories/${id}`, {
                name: data.name,
                status: data.status,
            });

            setSuccessMessage("Cập nhật danh mục thành công!");

            // Chuyển trang sau 1.5 giây
            setTimeout(() => {
                navigate("/admin/Categories");
            }, 1500);
        } catch (error) {
            if (error.response?.data?.error) {
                setServerError(error.response.data.error);
            } else {
                setServerError("Có lỗi xảy ra khi cập nhật danh mục!");
            }
        }
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h4 className="mb-4">Chỉnh Sửa Danh Mục</h4>

                    {serverError && <Alert variant="danger">{serverError}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên danh mục"
                                {...register("name", {
                                    required: "Tên danh mục không được để trống!",
                                    minLength: {
                                        value: 6,
                                        message: "Tên danh mục ít nhất 6 ký tự!",
                                    },
                                })}
                            />
                            {errors.name && (
                                <small className="text-danger">{errors.name.message}</small>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="categoryStatus">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                {...register("status", {
                                    required: "Trạng thái không được để trống!",
                                })}
                            >
                                <option value="0">Hiển thị </option>
                                <option value="1">Ẩn</option>
                            </Form.Select>
                            {errors.status && (
                                <small className="text-danger">{errors.status.message}</small>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-start gap-2">
                            <Button
                                variant="primary"
                                onClick={handleSubmit(updateCategory)}
                                type="submit"
                            >
                                Lưu Thay Đổi
                            </Button>
                            <Link
                                className="btn btn-danger btn-sm me-3"
                                to="/admin/Categories"
                            >
                                Hủy
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditCategory;
