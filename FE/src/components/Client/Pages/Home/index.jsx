import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaGem, FaGlasses, FaWallet, FaStar } from "react-icons/fa";
import { GiWatch, GiDiamondRing, GiLeatherBoot, GiGears } from "react-icons/gi";

import Button from 'react-bootstrap/Button';



import Image from 'react-bootstrap/Image';

const categories = [
  { icon: <GiWatch size={40} className="text-secondary" />, label: "Đồng hồ thời trang xà cừ" },
  { icon: <FaStar size={40} className="text-secondary" />, label: "Phiên bản giới hạn" },
  { icon: <GiLeatherBoot size={40} className="text-secondary" />, label: "Mặt số siêu mỏng" },
  { icon: <GiGears size={40} className="text-secondary" />, label: "Đồng hồ Skeleton siêu" },
  { icon: <FaGem size={40} className="text-secondary" />, label: "Đồng hồ cao cấp vàng 18k" },
  { icon: <GiDiamondRing size={40} className="text-secondary" />, label: "Đá quý – Vật liệu hiếm" },
  { icon: <FaWallet size={40} className="text-secondary" />, label: "Ví da thật" },
  { icon: <FaGlasses size={40} className="text-secondary" />, label: "Kính Hải Triều" },
];

const collections = [
  {
    title: "BỘ SƯU TẬP MỚI",
    image: "/pr1.jpg",
    description: "ĐỒNG HỒ ĐÍNH ĐÁ TẦM GIÁ 5 TRIỆU ĐÁNG MUA NHẤT",
    size: "large",
  },
  {
    title: "NAM",
    image: "/anhnam1.jpg",
    description: "Xem ngay",
    size: "small",
  },
  {
    title: "NỮ",
    image: "/anhnu1.jpg",
    description: "Xem ngay",
    size: "small",
  },
  {
    title: "ĐỒNG HỒ ĐÔI",
    image: "/prdoi.jpg",
    description: "Xem ngay",
    size: "small",
  },
];

const products = [
  { id: 1, name: "Casio World Time", price: "1.506.000 đ", img: "/dongho.png" },
  { id: 2, name: "Orient SK", price: "8.000.000 đ", img: "/dongho.png" },
  { id: 3, name: "Tissot Le Locle", price: "17.500.000 đ", img: "/dongho.png" },
  { id: 4, name: "Doxa Noble", price: "49.240.000 đ", img: "/dongho.png" },
  

];
  
const WatchCategoryGrid = () => {
  return (
    <Container className="my-5">
      <Row className="g-4 justify-content-center">
        {categories.map((item, index) => (
          <Col key={index} xs={6} md={4} lg={3}>
            <Card className="text-center shadow-sm p-3 border-0 rounded-4 bg-light">
              <Card.Body>
                <div className="mb-2">{item.icon}</div>
                <Card.Text className="fw-medium">{item.label}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const WatchCollection = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {/* Ảnh lớn bên trái */}
      <div className="col-span-1">
        <div className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer">
          <img
            src={collections[0].image}
            alt={collections[0].title}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6 text-white">
            <h2 className="text-xl font-bold">{collections[0].title}</h2>
            <span className="text-sm opacity-75">Xem ngay</span>
          </div>
        </div>
      </div>

      {/* 3 ảnh nhỏ bên phải */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 col-span-1">
        {collections.slice(1, 3).map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[240px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <span className="text-sm opacity-75">Xem ngay</span>
            </div>
          </div>
        ))}
        {/* Ảnh lớn ở dưới */}
        <div className="relative col-span-2 rounded-xl overflow-hidden shadow-lg cursor-pointer">
          <img
            src={collections[3].image}
            alt={collections[3].title}
            className="w-full h-[260px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6 text-white">
            <h2 className="text-xl font-bold">{collections[3].title}</h2>
            <span className="text-sm opacity-75">Xem ngay</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeProduct =()=>{
  return (
    <Container className="mt-5">
      <section className="bg-light p-5 rounded-5 shadow-lg">
    <h2 className="text-center mb-4">ĐỒNG HỒ NAM BÁN CHẠY</h2>
    <Row>
      {products.map((product) => (
        <Col key={product.id} md={3} className="mb-4">
          <Card className="h-100 text-center shadow-sm border-0">
            <Image src={product.img} fluid className="p-3" />
            <Card.Body>
              <Card.Title className="fw-bold">{product.name}</Card.Title>
              <Card.Text className="text-danger fw-bold">{product.price}</Card.Text>
              <Button variant="primary" className="me-2">Xem Chi Tiết</Button>
              <Button variant="success">Mua Ngay</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </section>
  </Container>
  );
};


export { WatchCategoryGrid, WatchCollection, HomeProduct};
