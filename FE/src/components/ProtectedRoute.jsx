// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [cookies] = useCookies(['token', 'user']);
  const token = cookies.token;
  let user = cookies.user;

  if (typeof user === "string") {
    try {
      user = JSON.parse(user);
    } catch (error) {
      console.error("Lỗi parse cookies.user:", error);
      user = null;
    }
  }
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Chưa login
    if (!token) {
      toast.warning("Bạn cần đăng nhập để xem trang này!", {
        toastId: 'warning-not-login',   // <-- đặt toastId để chặn lặp
        autoClose: 2000
      });
      setTimeout(() => {
        navigate('/login', { state: { from: location }, replace: true });
      }, 1000);
    }
    // Không đúng role
    else if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
      toast.error("Bạn không có quyền truy cập!", {
        toastId: 'error-no-permission', // <-- khác với toastId bên trên
        autoClose: 2000
      });
      setTimeout(() => {
        navigate('/login', { state: { from: location }, replace: true });
      }, 2000);
    }
  }, [token, user, allowedRoles, navigate, location]);

  if (token && (!allowedRoles.length || allowedRoles.includes(user?.role))) {
    return children;
  }

  return null;
};

export default ProtectedRoute;
