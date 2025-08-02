import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "../../../../../Upload/uploadToCloudinary";
import Constants from "../../../../../Constanst";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Chọn file: chỉ preview, chưa upload
  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };


  const onSubmit = async (data) => {
    // Validate độ dài name nếu cần
    if (data.name.length > 30) {
      setError("name", { type: "manual", message: "Tên không quá 30 ký tự" });
      return;
    }
    setSubmitting(true);

    try {
      // 1. Gửi register, nhận về token và user
      const res = await axios.post(
        `${Constants.DOMAIN_API}/api/register`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          password: data.password,
        }
      );

      // 2. Lấy token từ response
      const token = res.data.token;

      // 3. Nếu có avatarFile, upload lên Cloudinary
      if (avatarFile && token) {
        const uploadRes = await uploadToCloudinary(avatarFile);
        const avatarUrl = uploadRes.secure_url || uploadRes.url;

        // 4. Gọi API updateProfile để lưu avatar
        await axios.put(
          `${Constants.DOMAIN_API}/api/profile`,
          { avatar: avatarUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // 5. Thành công → thông báo và chuyển sang login
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      // Bắt lỗi trả về từ server
      const msg = err.response?.data?.message;
      if (/email/i.test(msg)) {
        setError("email", { type: "manual", message: msg });
      } else if (/phone/i.test(msg)) {
        setError("phone", { type: "manual", message: msg });
      } else {
        toast.error(msg || "Có lỗi xảy ra");
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4 p-4 border-0">
            <div className="card-header bg-transparent text-center mb-3">
              <h3 className="fw-bold">Đăng ký</h3>
              <div className="mx-auto" style={{ width: 200, height: 4, backgroundColor: '#FFBB38' }} />
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name', { required: 'Họ và tên không được để trống' })}
                    />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      {...register('phone', {
                        required: 'Số điện thoại không được để trống',
                        pattern: { value: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ' }
                      })}
                    />
                    <div className="invalid-feedback">{errors.phone?.message}</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', {
                        required: 'Email không được để trống',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' }
                      })}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      {...register('password', { required: 'Mật khẩu không được để trống', minLength: { value: 6, message: 'Ít nhất 6 ký tự' } })}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      {...register('confirmPassword', {
                        required: 'Vui lòng xác nhận mật khẩu',
                        validate: (val) => val === password || 'Mật khẩu xác nhận không khớp'
                      })}
                    />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </div>
                  <div className="mb-4 text-center col-12">
                    {avatarPreview && (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="rounded-circle mb-2"
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleAvatarSelect}
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={isSubmitting || submitting}
                  >
                    {isSubmitting || submitting ? 'Đang gửi...' : 'Đăng ký'}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center border-0 bg-transparent pt-0">
              <span>Đã có tài khoản? </span>
              <Link to="/login" className="text-decoration-none fw-medium">Đăng nhập ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
