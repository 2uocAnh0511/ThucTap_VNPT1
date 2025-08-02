import { Link } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaList,
  FaUsers,
  FaClipboardList,
  FaComments,
  FaTags,
  FaBlog
} from "react-icons/fa";

const HeaderAdmin = () => {
  return (
    <div className="sidebar bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-6 text-indigo-300">NGŨ HỔ</h3>
      <nav className="flex flex-col space-y-2">

        {/* Trang chủ */}
        <Link
          to="/admin"
          className="flex items-center py-2 px-3 rounded-lg hover:bg-white hover:text-black transition no-underline"
        >
          <FaHome className="mr-2" /> Trang chủ
        </Link>

        {/* Dropdown Sản phẩm */}
        <div className="group">
          <div className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
            <FaBox className="mr-2" /> Sản phẩm
          </div>
          <div className="hidden group-hover:block bg-gray-800 ml-4 mt-1 rounded-md shadow-md">
            <Link to="/admin/products" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách sản phẩm</Link>
            <Link to="/admin/products/addProduct" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Thêm sản phẩm</Link>
          </div>
        </div>

        {/* Dropdown Danh mục */}
        <div className="group">
          <div className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
            <FaList className="mr-2" /> Danh mục
          </div>
          <div className="hidden group-hover:block bg-gray-800 ml-4 mt-1 rounded-md shadow-md">
            <Link to="/admin/Categories" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách danh mục</Link>
            <Link to="/admin/Categories/addCategory" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Thêm danh mục</Link>
          </div>
        </div>

        {/* Dropdown Người dùng */}
        <div className="group">
          <div className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
            <FaUsers className="mr-2" /> Người dùng
          </div>
          <div className="hidden group-hover:block bg-gray-800 ml-4 mt-1 rounded-md shadow-md">
            <Link to="/admin/user" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách người dùng</Link>
          </div>
        </div>

        {/* Dropdown Đơn hàng */}
        <div className="group">
          <div className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
            <FaClipboardList className="mr-2" /> Đơn hàng
          </div>
          <div className="hidden group-hover:block bg-gray-800 ml-4 mt-1 rounded-md shadow-md">
            <Link to="/admin/order" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách đơn hàng</Link>
          </div>
        </div>

        {/* Dropdown Bình luận */}
        <div className="group">
          <div className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
            <FaComments className="mr-2" /> Bình luận
          </div>
          <div className="hidden group-hover:block bg-gray-800 ml-4 mt-1 rounded-md shadow-md">
            <Link to="/admin/comments" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách bình luận</Link>
          </div>
        </div>

        {/* Dropdown Giảm giá */}
        <div className="group">
          <div className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
            <FaTags className="mr-2" /> Giảm giá
          </div>
          <div className="hidden group-hover:block bg-gray-800 ml-4 mt-1 rounded-md shadow-md">
            <Link to="/admin/promotions/getAll" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách giảm giá</Link>
            <Link to="/admin/promotionusers/getAll" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách khách hàng</Link>
          </div>
        </div>

        {/* Dropdown Bài viết */}
        <div className="group">
          <div className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
            <FaBlog className="mr-2" /> Bài viết
          </div>
          <div className="hidden group-hover:block bg-gray-800 ml-4 mt-1 rounded-md shadow-md">
            <Link to="/admin/blogs" className="block py-2 px-4 text-sm hover:bg-white hover:text-black rounded-md no-underline">Danh sách bài viết</Link>
          </div>
        </div>

      </nav>
    </div>
  );
};

export default HeaderAdmin;
