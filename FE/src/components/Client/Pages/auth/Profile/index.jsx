import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const Profile = (props) => {

    const [cookies] = useCookies(["user"]);
    const [user, setUser] = useState(null);


    useEffect(() => {
        let parsedUser = null;
        if (cookies.user && typeof cookies.user === "string") {
            try {
                parsedUser = JSON.parse(cookies.user);
            } catch (error) {
                console.error("Lỗi khi parse user từ cookie:", error);
            }
        } else if (cookies.user && typeof cookies.user === "object") {
            parsedUser = cookies.user;
        }

        setUser(parsedUser);
    }, [cookies.user]);


    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <h4>Không tìm thấy thông tin người dùng.</h4>
            </div>
        );
    }

    return (

        <div className="container mt-5">
            <h2 className="text-center">Thông Tin Cá Nhân</h2>

            <div className="card p-4 shadow">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img
                            src="images/avatar.jpg"
                            className="img-fluid rounded-circle"
                            alt="Avatar"
                            width="350"
                        />
                    </div>
                    <div className="col-md-8">
                        {user ? (
                            <>
                                <p><strong>Họ và Tên:</strong> {user.name || "Chưa cập nhật"}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
                                <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
                            </>
                        ) : (
                            <p>Không tìm thấy thông tin người dùng.</p>
                        )}
                        <Link to="/logout" className="btn btn-danger">Đăng xuất</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;