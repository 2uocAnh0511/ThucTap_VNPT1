import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import axios from "axios";
import Constants from "../../../../Constanst";
import { FaGem, FaStar, FaWallet, FaGlasses } from "react-icons/fa";
import { GiWatch, GiDiamondRing, GiLeatherBoot, GiGears } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // File CSS tùy chỉnh

export default function Home() {
  const [cats, setCats] = useState([]);
  const [cols, setCols] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true); // Sử dụng useRef để theo dõi lần mount đầu tiên

  useEffect(() => {
    let mounted = true;
    if (!isInitialMount.current) return; // Chỉ chạy lần đầu tiên

    setLoading(true); // Bắt đầu loading
    axios
      .get(`${Constants.DOMAIN_API}/api/home`)
      .then((res) => {
        if (mounted) {
          console.log("API Response Data:", res.data); // Log dữ liệu chi tiết
          setCats(res.data.categories || []);
          setCols(res.data.collections || []);
          setFeatured(res.data.featuredProducts || []);
        }
      })
      .catch((error) => {
        console.error("API Error:", error.message || error);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false); // Kết thúc loading
          isInitialMount.current = false; // Đánh dấu đã mount xong
        }
      });

    return () => {
      mounted = false; // Cleanup khi unmount
    };
  }, []); // Dependency array rỗng để chạy một lần

  if (loading) return <div>Loading...</div>; // Hiển thị loading trong khi fetch

  return (
    <>
      {/* Featured Products */}
      <Container className="my-5">
        <section className="bg-light p-5 rounded-5 shadow-lg">
          <h2 className="text-center mb-5 fw-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#333' }}>
            SẢN PHẨM NỔI BẬT
          </h2>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {featured.map((p, index) => (
              <Col key={p.id || index} className="mb-4">
                <Card className="h-100 shadow-sm border-0 card-hover">
                  <div className="card-image-wrapper">
                    <Image
                      src={p.image}
                      fluid
                      className="rounded-top"
                      style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column justify-content-between p-4">
                    <div>
                      <Card.Title className="fw-bold fs-5 text-dark mb-2">
                        {p.title}
                      </Card.Title>
                      <Card.Text className="text-danger fw-bold fs-5">
                        {p.price.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </Card.Text>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        className="btn-custom"
                        as={Link}
                        to={`/product/${p.id}`}
                      >
                        Xem Chi Tiết
                      </Button>
                      <Button
                        variant="dark"
                        size="sm"
                        className="btn-custom"
                      >
                        Mua Ngay
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* Collections */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {cols[0] && (
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <Image src={cols[0].image} fluid className="w-full h-[500px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <h2 className="text-xl font-bold">{cols[0].title}</h2>
              <Link className="text-sm opacity-75 no-underline" to="/Product">Xem ngay</Link>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {cols.slice(1).map((co, index) => (
            <div key={co.id || index} className="relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src={co.image}
                fluid
                className={index < 2 ? "w-full h-[240px] object-cover" : "w-full h-[260px] object-cover"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-column justify-end p-4 text-white">
                <h2 className="text-lg font-bold">{co.title}</h2>
                <Link className="text-sm opacity-75 no-underline" to="/Product">Xem ngay</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export { Home as WatchCategoryGrid, Home as WatchCollection, Home as HomeProduct };