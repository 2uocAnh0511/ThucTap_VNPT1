import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBell, FaSignOutAlt } from "react-icons/fa";

const HeaderNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm px-3">
      <Container>
        {/* Tiêu đề Navbar */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          Quản lý hệ thống
        </Navbar.Brand>

        {/* Nút mở menu trên mobile */}
        <Navbar.Toggle aria-controls="navbarNav" />

        {/* Nội dung Navbar */}
    
      </Container>
    </Navbar>
  );
};

export default HeaderNavbar;
