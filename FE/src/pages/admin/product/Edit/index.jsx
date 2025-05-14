import { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../../../../Constants.jsx";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "../../../../Upload/uploadToCloudinary.js";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/admin/products/edit/${id}`);
      const product = res.data.product;

      setValue("name", product.title);
      setValue("price", product.price);
      setValue("short_description", product.short_description);
      setValue("category", product.category_id);
      setValue("status", product.status); // ✅ Thêm dòng này
      setImageUrl(product.image);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
      toast.error("Không thể lấy dữ liệu sản phẩm.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/admin/category/list`);
      const activeCategories = res.data.data.filter(cat => cat.status === "active");
      setCategories(activeCategories);
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      toast.error("Không thể lấy danh mục.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadToCloudinary(file);
        setImageUrl(url);
        toast.success("Upload ảnh thành công!");
      } catch (err) {
        console.error("Lỗi upload ảnh:", err);
        toast.error("Upload ảnh thất bại!");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        name: data.name,
        category_id: data.category,
        price: data.price,
        short_description: data.short_description,
        image: imageUrl,
        status: data.status, // ✅ Thêm dòng này
      };

      const res = await axios.put(`${Constants.DOMAIN_API}/admin/products/${id}`, updatedData);

      if (res.status === 200) {
        toast.success("Cập nhật sản phẩm thành công!");
        navigate("/admin/products/getAll");
      } else {
        toast.error("Cập nhật thất bại.");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      toast.error("Đã xảy ra lỗi khi cập nhật.");
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h4 className="mb-4">Chỉnh sửa Sản Phẩm</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("name", {
                      required: "Tên sản phẩm không được bỏ trống",
                    })}
                  />
                  {errors.name && <small className="text-danger">{errors.name.message}</small>}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select {...register("category", { required: "Vui lòng chọn danh mục" })}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.category && (
                    <small className="text-danger">{errors.category.message}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    {...register("price", {
                      required: "Giá không được để trống",
                      min: { value: 1, message: "Giá phải lớn hơn 0" },
                    })}
                  />
                  {errors.price && (
                    <small className="text-danger">{errors.price.message}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    {...register("status", { required: "Vui lòng chọn trạng thái" })}
                  >
                    <option value="">-- Chọn trạng thái --</option>
                    <option value="active">Hiển thị</option>
                    <option value="inactive">Ẩn</option>
                  </Form.Select>
                  {errors.status && (
                    <small className="text-danger">{errors.status.message}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh sản phẩm</Form.Label>
                  <Form.Control type="file" onChange={handleImageUpload} />
                  {imageUrl && (
                    <div className="mt-2">
                      <img src={imageUrl} alt="Ảnh sản phẩm" style={{ height: "80px" }} />
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("short_description", {
                      required: "Mô tả không được bỏ trống",
                    })}
                  />
                  {errors.short_description && (
                    <small className="text-danger">
                      {errors.short_description.message}
                    </small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Button variant="success" type="submit">
              Lưu Thay Đổi
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditProduct;
