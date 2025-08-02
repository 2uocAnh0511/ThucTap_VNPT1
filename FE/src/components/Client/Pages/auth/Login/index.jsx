import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Constants from "../../../../../Constanst"; // Điều chỉnh đường dẫn nếu cần
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token", "role", "user"]);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError(""); // Reset lỗi cũ
    try {
      const res = await axios.post(`${Constants.DOMAIN_API}/api/login`, {
        email: data.email,
        password: data.password,
      });
      console.log("Data gửi lên:", data);


      // console.log("Response from server:", res.data);

      if (res.data && res.data.token && res.data.user) {
        let expiresDate = new Date();
        expiresDate.setHours(expiresDate.getHours() + 10); // Cookie hết hạn sau 10 giờ

        // Lưu token vào cookie
        setCookie("token", res.data.token, { path: "/", expires: expiresDate });

        // Lưu user vào cookie dưới dạng JSON string
        setCookie("user", JSON.stringify(res.data.user), {
          path: "/",
          expires: expiresDate,
        });

        console.log("Dữ liệu nhận được từ API:", res.data);

        // console.log("User info:", res.data.user);
        // console.log("typeof cookies.user:", typeof cookies.user);
        // console.log("cookies.user:", cookies.user);

        toast.success(res.data.message || "Đăng nhập thành công!");
        navigate("/");
      } else {
        console.error("User data is missing in the response");
        setApiError("Đăng nhập thất bại, vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Login error:", err);

      const msg =
        err.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!";
        toast.error(msg);

      setApiError(msg);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg">
            <div className="card-header text-center">
              <h3>Đăng nhập</h3>
            </div>
            <div className="card-body">
              <form id="loginForm" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label text-start d-block">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="loginEmail"
                    placeholder="Nhập email"
                    {...register("email", {
                      required: "Email không được để trống",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>

                {/* Mật khẩu */}
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label text-start d-block">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    id="loginPassword"
                    placeholder="Nhập mật khẩu"
                    {...register("password", {
                      required: "Mật khẩu không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </div>

                {/* Hiện lỗi API nếu có */}
                {apiError && (
                  <div className="alert alert-danger py-2">{apiError}</div>
                )}

                {/* Nút đăng nhập */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              <p>
                Chưa có tài khoản?{" "}
                <Link to={"/register"} className="text-decoration-none">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
