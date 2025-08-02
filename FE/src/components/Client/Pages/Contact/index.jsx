import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Contact = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Gửi liên hệ thành công!");
        reset();
      } else {
        toast.error("Lỗi: " + result.error);
      }
    } catch (err) {
      console.error("Lỗi khi gửi:", err);
      toast.error("Đã xảy ra lỗi khi gửi liên hệ.");
    }
  };

  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-lg p-4">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="text-center mb-4">Liên Hệ</h3>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label className="form-label">Họ và Tên</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập họ và tên"
                        {...register("username", {
                          required: "Vui lòng nhập họ và tên!",
                        })}
                      />
                      {errors.username && (
                        <p className="text-danger">{errors.username.message}</p>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Nhập email"
                        {...register("email", {
                          required: "Vui lòng nhập Email!",
                        })}
                      />
                      {errors.email && (
                        <p className="text-danger">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nội dung</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Nhập nội dung"
                        {...register("content", {
                          required: "Nội dung không được bỏ trống!",
                        })}
                      ></textarea>
                      {errors.content && (
                        <p className="text-danger">{errors.content.message}</p>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      Gửi
                    </button>
                  </form>
                </div>

                <div className="col-md-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=..."
                    width="100%"
                    height="350"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
