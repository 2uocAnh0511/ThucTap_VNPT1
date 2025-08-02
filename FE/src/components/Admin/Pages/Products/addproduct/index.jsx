import { useEffect, useState } from "react";
import axios from "axios";
import Constanst from "../../../../../Constanst";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../../../../Upload/uploadToCloudinary";
import { toast } from "react-toastify";


const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); // Lưu URL ảnh sau khi upload

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${Constanst.DOMAIN_API}/api/categories`);
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        alert("Lỗi khi tải danh mục!");
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadToCloudinary(file);
        setImageUrl(url);
        console.log("Ảnh đã upload:", url);
      } catch (err) {
        console.error("Lỗi upload ảnh:", err);
        alert("Upload ảnh thất bại!");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      toast.error("Lỗi khi tải danh mục!"); // ✅ toast
    }
  };
  fetchCategories();
}, []);

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      console.log("Ảnh đã upload:", url);
      toast.success("Upload ảnh thành công!"); // ✅ thêm thông báo
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      toast.error("Upload ảnh thất bại!"); // ✅ toast
    }
  }
};

 const onSubmit = async (data) => {
  try {
    if (!imageUrl) {
      toast.warning("Vui lòng chọn và upload ảnh trước khi submit."); // ✅ toast
      return;
    }

    const productData = {
      name: data.name,
      category_id: data.category,
      price: data.price,
      short_description: data.short_description,
      image: imageUrl,
    };

    const res = await axios.post(
      `${Constanst.DOMAIN_API}/api/addproducts`,
      productData
    );

    if (res.status === 200 || res.status === 201) {
      toast.success("Thêm sản phẩm thành công!"); // ✅ toast
      navigate("/admin/products");
      reset();
      setImageUrl(""); // reset ảnh
    } else {
      toast.error("Thêm sản phẩm thất bại!"); // ✅ toast
    }
  } catch (err) {
    console.error("Lỗi thêm sản phẩm:", err);
    toast.error("Đã xảy ra lỗi!"); // ✅ toast
  }
};

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h4 className="mb-4">Thêm Sản Phẩm Mới</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="productName">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    {...register("name", {
                      required: "Tên sản phẩm không được bỏ trống",
                      minLength: {
                        value: 4,
                        message: "Tên sản phẩm phải có ít nhất 4 ký tự",
                      },
                    })}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name.message}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="productCategory">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    {...register("category", {
                      required: "Vui lòng chọn danh mục",
                    })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories
                      .filter((category) => category.status === 0)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </Form.Select>
                  {errors.category && (
                    <small className="text-danger">
                      {errors.category.message}
                    </small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="productPrice">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá sản phẩm"
                    {...register("price", {
                      required: "Giá không được để trống",
                      min: {
                        value: 1,
                        message: "Giá phải lớn hơn 0",
                      },
                    })}
                  />
                  {errors.price && (
                    <small className="text-danger">
                      {errors.price.message}
                    </small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="productImage">
                  <Form.Label>Ảnh sản phẩm</Form.Label>
                  <Form.Control type="file" onChange={handleImageUpload} />
                  {!imageUrl && (
                    <small className="text-danger">
                      Vui lòng chọn và upload ảnh
                    </small>
                  )}
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        style={{ height: "80px", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3" controlId="productDescription">
                  <Form.Label>Mô tả sản phẩm</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập mô tả"
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

            <Button variant="primary" type="submit">
              Thêm Sản Phẩm
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;
