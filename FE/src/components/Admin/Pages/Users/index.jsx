import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Constanst from "../../../../Constanst"; // đường dẫn hằng số API

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${Constanst.DOMAIN_API}/api/users`);
            console.log(res.data);  // Kiểm tra dữ liệu trả về từ API
            
            setUsers(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy người dùng:", error);
            setUsers([]); // fallback rỗng
        }
    };


    const deleteUser = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
            try {
                await axios.delete(`${Constanst.DOMAIN_API}/api/users/${id}`);
                fetchUsers(); // refresh lại
            } catch (err) {
                console.error("Lỗi khi xóa người dùng:", err);
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="text-center mb-4">Quản Lý Người Dùng</h4>
                    <table className="table table-hover text-center align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Họ Tên</th>
                                <th>Email</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.address}</td>
                                        <td>{u.phone}</td>
                                        <td>
                                            <Link className="btn btn-primary btn-sm me-2" to={`/admin/user/editUser?id=${u.id}`}>Chi tiết</Link>
                                            {/* <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Xóa</button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Không có người dùng nào.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersAdmin;
