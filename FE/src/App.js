// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useCookies } from 'react-cookie';

import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainUser from './components/Client/Layouts/MainUser';
import MainAdmin from './components/Admin/Layouts/MainAdmin';

// Client pages
import HomeMain from './components/Client/Pages/Home/HomeMain';
import NewsPage from './components/Client/Pages/News';
import MenProducts from './components/Client/Pages/Men';
import WomenProducts from './components/Client/Pages/Women';
import CoupleProducts from './components/Client/Pages/Couple';
import JewelryProducts from './components/Client/Pages/TrangSuc';
import AccessoryProducts from './components/Client/Pages/PhuKien';
import Contact from './components/Client/Pages/Contact';
import Cart from './components/Client/Pages/Cart';
import ProductDetail from './components/Client/Pages/Product/Product_Detail';
import Login from './components/Client/Pages/auth/Login';
import Register from './components/Client/Pages/auth/Register';
import Profile from './components/Client/Pages/auth/Profile';
import Product from './components/Client/Pages/Product';

// Admin pages
import HomeAdmin from './components/Admin/Pages/Home';
import ProductAdmin from './components/Admin/Pages/Products';
import AddProduct from './components/Admin/Pages/Products/addproduct';
import EditProduct from './components/Admin/Pages/Products/editproduct';
import CategoryAdmin from './components/Admin/Pages/Categories';
import AddCategory from './components/Admin/Pages/Categories/addcategory';
import EditCategory from './components/Admin/Pages/Categories/editcategory';
import UsersAdmin from './components/Admin/Pages/Users';
import ViewUser from './components/Admin/Pages/Users/detail';
import AddUser from './components/Admin/Pages/Users/adduser';
import EditUser from './components/Admin/Pages/Users/edituser';
import OrderList from './components/Admin/Pages/Order';
import OrderDetail from './components/Admin/Pages/Order/Order-detail';
import Comment from './components/Admin/Pages/Comment';
import Orders from './components/Client/Pages/order';
import Order_Detail from './components/Client/Pages/order/order_detail';
import PromotionGetAll from './components/Admin/Pages/promotions/getAll';
import PromotionCreate from './components/Admin/Pages/promotions/Create';
import PromotionEdit from './components/Admin/Pages/promotions/Edit';
import PromotionList from './components/Admin/Pages/promotionUsers/getAll';
import Blog from './components/Admin/Pages/Blog';
import AddBlog from './components/Admin/Pages/Blog/addBlog';
import EditBlog from './components/Admin/Pages/Blog/editBlog';

function App() {
  return (
    <>
      <ToastContainer position="top-right" />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainUser />}>
          <Route index element={<HomeMain />} />
          <Route path="NewsPage" element={<NewsPage />} />
          <Route path="MenProducts" element={<MenProducts />} />
          <Route path="WomenProducts" element={<WomenProducts />} />
          <Route path="CoupleProducts" element={<CoupleProducts />} />
          <Route path="JewelryProducts" element={<JewelryProducts />} />
          <Route path="AccessoryProducts" element={<AccessoryProducts />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="Product" element={<Product />} />
          {/* Các trang cho user đã đăng nhập (role 0 và 1) */}
          <Route
            path="contact"
            element={
              <ProtectedRoute allowedRoles={[0, 1]}>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute allowedRoles={[0, 1]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="Order_Detail"
            element={
              <ProtectedRoute allowedRoles={[0, 1]}>
                <Order_Detail />
              </ProtectedRoute>
            }
          />
          <Route
            path="order"
            element={
              <ProtectedRoute allowedRoles={[0, 1]}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={[0, 1]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin routes (role 1) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <MainAdmin />
            </ProtectedRoute>
          }
        >
          <Route
            path="cart"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route index element={<HomeAdmin />} />

          <Route path="products" element={<ProductAdmin />} />
          <Route path="products/addProduct" element={<AddProduct />} />
          <Route path="products/EditProduct" element={<EditProduct />} />

          <Route path="Categories" element={<CategoryAdmin />} />
          <Route path="Categories/addCategory" element={<AddCategory />} />
          <Route path="Categories/editCategory" element={<EditCategory />} />

          <Route path="user" element={<UsersAdmin />} />
          <Route path="user/addUser" element={<AddUser />} />
          <Route path="user/editUser" element={<EditUser />} />
          <Route path="users/viewUser/:id" element={<ViewUser />} />

          

          <Route path="order" element={<OrderList />} />
          <Route path="order/:id" element={<OrderDetail />} />

          <Route path="comments" element={<Comment />} />
          <Route path="blogs" element={<Blog />} />
          <Route path="blogs/addBlog" element={<AddBlog />} />
          <Route path="blogs/editBlog/:id" element={<EditBlog />} />


          <Route path="promotions">
            <Route path="getAll" element={<PromotionGetAll />} />
            <Route path="create" element={<PromotionCreate />} />
            <Route path="edit/:id" element={<PromotionEdit />} />
            {/* <Route path="applied/:id" element={<PromotionOrderListModal />} /> */}
          </Route>
          <Route path="promotionusers">
            <Route path="getAll" element={<PromotionList />} />
          </Route>
        </Route>

        {/* Nếu không khớp bất cứ route nào → về home hoặc login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
