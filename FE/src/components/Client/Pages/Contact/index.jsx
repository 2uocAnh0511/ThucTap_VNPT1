import React from "react";
import { useForm } from "react-hook-form";


const Contact = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    
    } = useForm({
        defaultValues: {

        },
    });

    const handleRegister = (props) => {

        console.log("Register props ", props);

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
                                    <form >
                                        <div className="mb-3">
                                            <label className="form-label">Họ và Tên</label>
                                            <input  type="text"className="form-control" placeholder="Nhập họ và tên" id="username"
                                                {...register("username", {  required: { value: true, message: "Vui lòng nhập họ và tên!" },})}
                                            />
                                            {errors.username && <p className="text-danger">{errors.username.message}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" placeholder="Nhập email"   id="email" 
                                                {...register("email", {required: { value: true, message: "Vui lòng nhập Email!" },})}
                                            />
                                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nội dung</label>
                                            <textarea className="form-control"  rows="4"  placeholder="Nhập nội dung" id="content"
                                                {...register("content", {
                                                    required: { value: true, message: "Nội dung không được bỏ trống!" }, })}
                                            ></textarea>
                                            {errors.content && <p className="text-danger">{errors.content.message}</p>}
                                        </div>
                                        <button type="submit" onClick={handleSubmit(handleRegister)} className="btn btn-primary w-100">Gửi</button>
                                    </form>

                                </div>

                                <div className="col-md-6">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d584.1122741172355!2d105.75764297822931!3d9.98184582889019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1742641635037!5m2!1svi!2s"
                                        width="100%"
                                        height="350"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;