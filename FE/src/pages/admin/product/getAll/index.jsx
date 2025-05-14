import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Constants from "../../../../Constants.jsx";
import { toast } from "react-toastify";
import FormDelete from "../../../../components/formDelete";

function ProductGetAll() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/admin/products`);
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error("Không thể tải sản phẩm.");
    }
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await axios.delete(`${Constants.DOMAIN_API}/admin/products/${selectedProduct.id}`);

      toast.success("Xóa sản phẩm thành công");
      getProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);

     if (error.response?.status === 409) {
  toast.error("Không thể xóa vì sản phẩm này đang được sử dụng.");
} else {
  toast.error("Xóa thất bại. Vui lòng thử lại.");
}

    } finally {
      setSelectedProduct(null);
    }
  };

  const toggleProductStatus = async (prod) => {
    const newStatus = prod.status === "active" ? "inactive" : "active";
    try {
      await axios.patch(`${Constants.DOMAIN_API}/admin/product/${prod.id}/status`, {
        status: newStatus,
      });
      toast.success("Cập nhật trạng thái thành công");
      getProducts();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái sản phẩm.");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
        <Link
          to="/admin/products/create"
          className="inline-block bg-[#073272] text-white px-4 py-2 rounded"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <table className="w-full table-auto border border-collapse border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr key={prod.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{prod.title}</td>
              <td className="border p-2">{prod.price}</td>
              <td className="border p-2">{prod.short_description || "-"}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => toggleProductStatus(prod)}
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    prod.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {prod.status === "active" ? "Hiển thị" : "Ẩn"}
                </button>
              </td>
              <td className="border p-2 text-center space-x-2">
                <Link
                  to={`/admin/products/edit/${prod.id}`}
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <button
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <FormDelete
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          onConfirm={deleteProduct}
          message={`Bạn có chắc chắn muốn xóa sản phẩm "${selectedProduct.title}" không?`}
        />
      )}
    </div>
  );
}

export default ProductGetAll;
