import { FaShoppingBag, FaUser, FaCog } from 'react-icons/fa'; // Thêm icon cài đặt (cog) cho trang admin
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../../../ExampleCarouselImage';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function Header() {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user']);
  const token = cookies.token;
  let user = cookies.user;
  const navigate = useNavigate();

  // Đảm bảo user là object JSON
  if (typeof user === "string") {
    try {
      user = JSON.parse(user);
    } catch (error) {
      console.error("Lỗi parse cookies.user trong Header:", error);
      user = null;
    }
  }

  return (
    <>
      {/* ... phần banner ... */}

      <div className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">

          {/* Logo */}
          <Link className="flex items-center" to={"/"}>
            <img src="/image.png" alt="Logo" className="h-16" />
          </Link>

          {/* Menu */}
          <nav className="flex space-x-6 font-semibold uppercase text-sm text-black">
            <Link className="text-black" to={"/"}>Trang Chủ</Link>
            <Link className="text-black" to={"/Product"}>Sản Phẩm</Link>
            <Link className="text-black" to={"/CoupleProducts"}>Cặp Đôi</Link>
            <Link className="text-black" to={"/Contact"}>Liên Hệ</Link>
            <Link className="text-black" to={"/NewsPage"}>Tin Tức</Link>
          </nav>

          {/* Tìm kiếm + Giỏ hàng + Tài khoản */}
          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="border rounded-full py-2 pl-4 pr-10 text-sm w-64 focus:ring focus:ring-gray-300"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 cursor-pointer">🔍</span>
            </div>

            {/* Giỏ hàng */}
            <div className="relative">
              <Link
                to="/cart"
                className="text-xl text-gray-700 hover:text-gray-500"
                onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
              >
                <FaShoppingBag size={24} />
              </Link>
              {isCartDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                  {/* Nội dung giỏ hàng */}
                  <p className="block px-4 py-2 text-gray-700">Giỏ hàng trống</p>
                  <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Xem giỏ hàng</Link>
                </div>
              )}
            </div>

            {/* Tài khoản */}
            <div className="relative">
              <a
                className="text-sm text-gray-700 hover:text-gray-500 flex items-center"
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
              >
                <FaUser size={20} className="mr-2" />
                {token && user?.username && <span>{`Xin chào, ${user.username}`}</span>}
                {!token && <span className=''>Tài khoản</span>}
              </a>
              {isLoginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                  {token ? (
                    <>
                      {user?.role === 1 && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                          <FaCog className="mr-2" /> Trang quản trị
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600 rounded-md no-underline"
                      >
                        <FaUser className="text-lg" />
                        <span>Thông tin tài khoản</span>
                      </Link>

                      <Link
                        to="/order_detail"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600 rounded-md no-underline"
                      >
                        📦
                        <span>Xem đơn hàng</span>
                      </Link>

                      <button className="block px-4 py-2 text-left w-full text-gray-70  0 hover:bg-gray-100" onClick={() => {
                        removeCookie('token', { path: '/' });
                        removeCookie('user', { path: '/' }); // Xóa cả thông tin user
                        toast.success("Đăng xuất thành công!");
                        setTimeout(() => {
                          window.location.reload(); // Reload sau khi toast hiển thị
                        }, 1500); // Delay 1.5s để toast hiển thị xong
                      }}>
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Đăng nhập</Link>
                      <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Đăng ký</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Banner() {
  return (
    <>
      <Carousel>
        <Carousel.Item>
          <ExampleCarouselImage src="/banner.jpg" alt="" />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <ExampleCarouselImage src="/banner4.jpg" alt="" />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <ExampleCarouselImage src="/banner5.jpg" alt="" />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
}

export {
  Header,
  Banner,
};
