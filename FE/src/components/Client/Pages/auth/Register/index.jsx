import { useForm } from "react-hook-form";
import axios from "axios";
import { Link ,useNavigate } from "react-router-dom";
import Constants from "../../../../../Constanst"; // đường dẫn tới file Constants.jsx
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      // Gọi API đăng ký
      const res = await axios.post(
        `${Constants.DOMAIN_API}/api/register`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          password: data.password
        }
      );

      if (res.status === 201) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login"); // chuyển hướng sang trang login
      }
    } catch (err) {
      console.error("Đăng ký thất bại:", err.response || err.message);
      const msg =
        err.response?.data?.message ||
        "Có lỗi xảy ra, vui lòng thử lại sau.";
        toast.error(msg);
      }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg rounded-3 p-4">
            <div className="card-header text-center">
              <h3>Đăng ký</h3>
            </div>
            <div className="card-body">
              <form
                id="registerForm"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Họ tên */}
                <div className="mb-3">
                  <label
                    htmlFor="registerName"
                    className="form-label text-start d-block"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    id="registerName"
                    placeholder="Nhập họ tên"
                    {...register("name", {
                      required: "Họ và tên không được để trống"
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.name?.message}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label
                    htmlFor="registerEmail"
                    className="form-label text-start d-block"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="registerEmail"
                    placeholder="Nhập email"
                    {...register("email", {
                      required: "Email không được để trống",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Email không hợp lệ"
                      }
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="mb-3">
                  <label
                    htmlFor="registerPhone"
                    className="form-label text-start d-block"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    id="registerPhone"
                    placeholder="Nhập SDT..."
                    {...register("phone", {
                      required: "Số điện thoại không được để trống",
                      pattern: {
                        value: /^[0-9]{9,11}$/,
                        message: "Số điện thoại không hợp lệ"
                      }
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.phone?.message}
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="mb-3">
                  <label
                    htmlFor="registerAddress"
                    className="form-label text-start d-block"
                  >
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    id="registerAddress"
                    placeholder="Nhập địa chỉ"
                    {...register("address", {
                      required: "Địa chỉ không được để trống"
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.address?.message}
                  </div>
                </div>

                {/* Mật khẩu */}
                <div className="mb-3">
                  <label
                    htmlFor="registerPassword"
                    className="form-label text-start d-block"
                  >
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="registerPassword"
                    placeholder="Nhập mật khẩu"
                    {...register("password", {
                      required: "Mật khẩu không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự"
                      }
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="mb-3">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label text-start d-block"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    id="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    {...register("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩu",
                      validate: (value) =>
                        value === password ||
                        "Mật khẩu xác nhận không khớp"
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.confirmPassword?.message}
                  </div>
                </div>

                {/* Nút đăng ký */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Đăng ký"}
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              <p>
                Đã có tài khoản? <Link to={"/login"} className="text-decoration-none">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
