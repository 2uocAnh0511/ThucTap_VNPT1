import { useEffect, useState } from "react";
import axios from "axios";
import Constanst from "../../../../Constanst";
import { Link } from "react-router-dom"; // ✅ sửa lại import đúng

const CategoryAdmin = () => {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState(""); // ✅ state cho thông báo

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await axios.get(`${Constanst.DOMAIN_API}/api/categories`);
            setData(res.data);
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handleDelete = async (props) => {
        try {
            const { id } = props;

            await axios.delete(`${Constanst.DOMAIN_API}/api/categories/${id}`, {
                data: { id },
            });

            setMessage("Xóa danh mục thành công "); //  set thông báo
            getData();

            // Xóa thông báo sau 3 giây
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
        }
    };

    const renderCategory = (category, index) => (
        <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>{category.status == 0 ? " Hiển thị" : " Ẩn"}</td>
            <td>
                <Link to={`/admin/Categories/editCategory?id=${category.id}`} className="btn btn-primary m-3">Sửa</Link>
                <button className="btn btn-danger" onClick={() => handleDelete({ id: category.id })}>Xóa</button>
            </td>
        </tr>
    );

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="text-center mb-4">Quản Lý Danh Mục Sản Phẩm</h4>

                    {message && (
                        <div className="alert alert-success text-center" role="alert">
                            {message}
                        </div>
                    )}

                    <table className="table table-hover text-center align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Tên Danh Mục</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(renderCategory)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryAdmin;
