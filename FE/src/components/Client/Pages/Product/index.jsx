import { useState, useEffect } from 'react';
import {
  Card, Button, Container, Row, Col,
  ListGroup, Image, Form
} from 'react-bootstrap';
import axios from 'axios';
import Constanst from '../../../../Constanst';
import { useNavigate } from "react-router-dom";

function Product() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategory();
    getProduct();
  }, []);

  const getCategory = async () => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getProduct = async () => {
    try {
      const res = await axios.get(`${Constanst.DOMAIN_API}/api/products`);
      setProducts(res.data.data);
    } catch (error) {
      console.log("Error", error);
    }
  };
  

  const filteredProducts = products.filter((prod) => {
    const matchCategory = categoryFilter === 'all' || prod.category_id === categoryFilter;

    const matchPrice =
      priceFilter === 'all' ||
      (priceFilter === 'under1k' && prod.price < 1000) ||
      (priceFilter === '1kto3k' && prod.price >= 1000 && prod.price <= 3000) ||
      (priceFilter === 'above3k' && prod.price > 3000);

    return matchCategory && matchPrice;
  });

  const renderCategory = (category, index) => {
    return (
      <ListGroup.Item
        key={index}
        onClick={() => setCategoryFilter(category.id)}
        active={categoryFilter === category.id}
      >
        {category.name}
      </ListGroup.Item>
    );
  };

  const renderProduct = (product, index) => {
    return (
      <Col key={index} sm={6} md={4} lg={3}>
        <Card className="h-100 shadow-sm border-light">
          <Image src={product.image} fluid className="rounded-top" />
          <Card.Body className="text-center">
            <Card.Title className="fs-6 fw-semibold">{product.title}</Card.Title>
            <Card.Text className="text-danger small fw-bold">
              {product.price?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND"
              })}
            </Card.Text>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              Chi tiết
            </Button>
          </Card.Body>
        </Card>

      </Col>
    );
  };

  return (
    <Container className="mt-4"><Card className="border-light shadow-sm">
      <Card.Body>
        <Row>
          {/* Danh mục sản phẩm */}
          <Col md={3} className="h-100">
            <Card className="shadow-sm border-light p-2 h-100">
              <Card.Body>
                <h4 className="text-center">Danh Mục Sản Phẩm</h4>
                <ListGroup className="mb-3">
                  <ListGroup.Item
                    action
                    active={categoryFilter === 'all'}
                    onClick={() => setCategoryFilter('all')}
                  >
                    Tất cả danh mục
                  </ListGroup.Item>

                  {categories
                    .filter((category) => category.status === 0)
                    .map((category) => (
                      <ListGroup.Item
                        key={category.id}
                        action
                        active={categoryFilter === category.id}
                        onClick={() => setCategoryFilter(category.id)}
                      >
                        {category.name}
                      </ListGroup.Item>
                    ))}
                </ListGroup>


                {/* Lọc giá */}
                <Form.Select
                  onChange={(e) => setPriceFilter(e.target.value)}
                  value={priceFilter}
                >
                  <option value="all">Tất cả giá</option>
                  <option value="under1k">Dưới 1 triệu</option>
                  <option value="1kto3k">1 - 3 triệu</option>
                  <option value="above3k">Trên 3 triệu</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>

          {/* Danh sách sản phẩm */}
          <Col md={9}>
            <Row className="g-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(renderProduct)
              ) : (
                <p className="text-center mt-3">Không tìm thấy sản phẩm phù hợp.</p>
              )}
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
    </Container>
  );
}

export default Product;