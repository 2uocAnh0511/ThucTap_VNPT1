//--------------------CLIENT--------------------
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayouts";
import ClientLayout from "./layouts/ClientLayouts";
import Dashboard from "./pages/admin/dashboard";
import Home from "./pages/client/Home";
import Bus from "./pages/client/Bus";
import AboutUs from "./pages/client/About-us";
import Blog from "./pages/client/Blog";
import Contact from "./pages/client/Contact";
import BusDetail from "./pages/client/BusDetail";
import BookingHistory from "./pages/client/BookingHistory";
import Profile from "./pages/client/Profile";
import Login from "./pages/authenticator/Login";
import Register from "./pages/authenticator/Register";
import BookingTickets from "./pages/client/BookingTickets";

//------------ADMIN-------------
import OrderGetAll from "./pages/admin/order/getAll";
import CategoryGetAll from "./pages/admin/category/getAll";
import CategoryCreate from "./pages/admin/category/Create";
import CategoryEdit from "./pages/admin/category/Edit";


const AppRoutes = () => {
  return (
    <Routes>

      {/*--------------------CLIENT-------------------- */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="bus" element={<Bus />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />

        {/* Các route cần bảo vệ được bọc riêng lẻ bằng <PrivateRoute> */}
        <Route
          path="bookingHistory"
          element={
            <BookingHistory />
          }
        />
        <Route
          path="profile"
          element={
            <Profile />
          }
        />
        <Route
          path="bookingTickets/:tripId"
          element={
            <BookingTickets />
          }
        />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      {/* <Route path="resetForm" element={<ResetForm />} />
      <Route path="resetPassword/:token" element={<ResetPassword />} /> */}


      {/*--------------------ADMIN-------------------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders">
          <Route path="getAll" element={<OrderGetAll />} />
        </Route>

        <Route path="categories">
          <Route path="getAll" element={<CategoryGetAll />} />
          <Route path="create" element={<CategoryCreate />} />
          <Route path="edit/:id" element={<CategoryEdit />} />
        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;