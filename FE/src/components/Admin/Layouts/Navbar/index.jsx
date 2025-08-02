import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { FaHome, FaUser, FaChartBar, FaCog, FaBox, FaList, FaUsers } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const HeaderAdmin = () => {
  return (
    <div className="sidebar bg-dark text-white vh-100 p-3">
      <h3 className="text-center mb-4">NGŨ HỔ</h3>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin" className="text-white">
          <FaHome className="me-2" /> Trang chủ
        </Nav.Link>
        {/* Dropdown Sản Phẩm */}
        <NavDropdown title={<><FaBox className="me-2" /> Sản Phẩm</>} className="text-white">
          <NavDropdown.Item as={Link} to="/admin/products">Danh sách sản phẩm</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/products/addProduct">Thêm sản phẩm</NavDropdown.Item>
        </NavDropdown>
        {/* Dropdown Danh Mục */}
        <NavDropdown title={<><FaList className="me-2" /> Danh Mục</>} className="text-white">
          <NavDropdown.Item as={Link} to="/admin/Categories">Danh sách danh mục</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/Categories/addCategory">Thêm danh mục</NavDropdown.Item>
        </NavDropdown>
        {/* Dropdown Người Dùng */}
        <NavDropdown title={<><FaUsers className="me-2" /> Người Dùng</>} className="text-white">
          <NavDropdown.Item as={Link} to="/admin/user">Danh sách người dùng</NavDropdown.Item>
        </NavDropdown>
        {/* Dropdown ORDER*/}
        <NavDropdown title={<><FaUsers className="me-2" /> Đơn hàng</>} className="text-white">
          <NavDropdown.Item as={Link} to="/admin/order">Danh sách order</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title={<><FaUsers className="me-2" /> Bình Luận</>} className="text-white">
          <NavDropdown.Item as={Link} to="/admin/comments">Danh sách Bình Luận</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title={<><FaUsers className="me-2" />Giảm giá</>} className="text-white">
          <NavDropdown.Item as={Link} to="/admin/promotions/getAll">Danh sách giảm giá</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/admin/promotionusers/getAll">Danh sách khách hàng</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title={<><FaUsers className="me-2" />Bài viết</>} className="text-white">
          <NavDropdown.Item as={Link} to="/admin/blogs">Danh sách bài viết</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
};


export default HeaderAdmin;