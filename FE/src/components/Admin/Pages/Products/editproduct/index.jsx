import { useEffect, useState } from "react";
import axios from "axios";
import Constanst from "../../../../../Constanst";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "../../../../../Upload/uploadToCloudinary";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Thêm toast

const EditProduct = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); // Lưu URL ảnh sau khi upload
  const [currentProduct, setCurrentProduct] = useState(null);
  const [queryParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

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

  
  useEffect(() => {
    fetchProduct();
  }, [id, reset]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${Constanst.DOMAIN_API}/api/editproducts/${queryParams.get("id")}`
      );
      console.log("Response từ API:", res);

      const product = res.data.product;

      if (res.status === 200) {
        setCurrentProduct(product);
        reset({
          name: product.title,
          category: product.category_id,
          price: product.price,
          short_description: product.short_description,
        });
        setImageUrl(product.image);
      } else {
        throw new Error(`Lỗi từ server: ${res.status}`);
      }
    } catch (err) {
      console.error(
        "Lỗi khi lấy sản phẩm:",
        err.response ? err.response.data : err
      );
      toast.error("Không thể tải sản phẩm!"); // ✅ toast
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadToCloudinary(file);
        setImageUrl(url);
        console.log("Ảnh đã upload:", url);
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

      const updatedProductData = {
        name: data.name,
        category_id: data.category,
        price: data.price,
        short_description: data.short_description,
        image: imageUrl,
      };

      const res = await axios.put(
        `${Constanst.DOMAIN_API}/api/editproducts/${queryParams.get("id")}`,
        updatedProductData
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Cập nhật sản phẩm thành công!"); // ✅ toast
        setTimeout(() => {
          navigate("/admin/products"); // ⏳ Chờ toast hiển thị xong rồi chuyển trang
        }, 1000);
      } else {
        toast.error("Cập nhật sản phẩm thất bại!"); // ✅ toast
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      toast.error("Đã xảy ra lỗi!"); // ✅ toast
    }
  };

  if (!currentProduct) {
    return <div>Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h4 className="mb-4">Chỉnh Sửa Sản Phẩm</h4>
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
                  {errors.description && (
                    <small className="text-danger">
                      {errors.description.message}
                    </small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Cập nhật sản phẩm
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditProduct;
