import { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../../../Constants";
import { FaTrashAlt } from "react-icons/fa";
import FormDelete from "../../../components/formDelete";
import { toast } from "react-toastify";

const ProductsTable = ({ className, onTotalChange, onSelectedItemsChange, onCartItemsChange }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const selectedTotal = calculateSelectedTotal();
    if (onTotalChange) {
      onTotalChange(selectedTotal);
    }
  }, [selectedItems, cartItems, onTotalChange]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (onSelectedItemsChange) {
      onSelectedItemsChange(selectedItems);
    }
  }, [selectedItems, onSelectedItemsChange]);

  useEffect(() => {
    if (onCartItemsChange) {
      onCartItemsChange(cartItems);
    }
  }, [cartItems, onCartItemsChange]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product?.promotion?.discounted_price || item.product?.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return total + price * quantity;
    }, 0);
  };

  const calculateSelectedTotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.product_id)) {
        const price = parseFloat(item.product?.promotion?.discounted_price || item.product?.price || 0);
        const quantity = parseInt(item.quantity || 0);
        return total + price * quantity;
      }
      return total;
    }, 0);
  };

  const handleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.product_id));
    }
  };

  const handleConfirmDelete = (productId) => {
    const item = cartItems.find((c) => c.product_id === productId);
    const title = item?.product?.title || "sản phẩm";
    setDeleteItemId(productId);
    setDeleteMessage(`Bạn có chắc chắn muốn xóa sản phẩm ${title} này khỏi giỏ hàng?`);
    setShowConfirm(true);
  };

  const handleDelete = async ({ id }) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${Constants.DOMAIN_API}/delete-to-carts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== id)
      );

      toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
      await fetchCart();
    } catch (error) {
      const message = error.response?.data?.message || "";
      if (message === "Không tìm thấy sản phẩm trong giỏ hàng để xóa") {
        toast.warning("Sản phẩm không tồn tại trong giỏ hàng");
      } else {
        toast.error("Xóa sản phẩm thất bại");
      }
    } finally {
      setShowConfirm(false);
      setDeleteItemId(null);
      setDeleteMessage("");
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${Constants.DOMAIN_API}/clear-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems([]);
      toast.success("Đã xóa toàn bộ giỏ hàng");
      await fetchCart();
    } catch (error) {
      toast.error("Không thể xóa toàn bộ giỏ hàng");
    } finally {
      setShowConfirmClear(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const token = localStorage.getItem("token");
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `${Constants.DOMAIN_API}/update-to-carts/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      await fetchCart();
    } catch (error) {
      toast.error("Cập nhật số lượng thất bại");
    }
  };

  const QuantityInput = ({ quantity, onChange }) => {
    const handleDecrease = () => {
      if (quantity > 1) {
        onChange(quantity - 1);
      }
    };

    const handleIncrease = () => {
      onChange(quantity + 1);
    };

    return (
      <div className="inline-flex items-center border rounded-md overflow-hidden w-[120px] h-9">
        <button
          onClick={handleDecrease}
          className="w-9 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl"
          type="button"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= 1) {
              onChange(val);
            }
          }}
          className="w-16 h-full text-center outline-none"
          readOnly
        />
        <button
          onClick={handleIncrease}
          className="w-9 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl"
          type="button"
        >
          +
        </button>
      </div>
    );
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="flex justify-end items-center mb-4 pr-2">
        <button
          onClick={() => setShowConfirmClear(true)}
          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition duration-200"
          title="Xóa toàn bộ giỏ hàng"
        >
          <FaTrashAlt size={20} className="font-bold" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto w-full">
        <table className="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 bg-[#F6F6F6] z-10">
            <tr className="text-[13px] font-medium text-black uppercase">
              <th className="py-4 text-center w-[50px]">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                />
              </th>
              <th className="py-4 pl-10 w-[320px]">Sản phẩm</th>
              <th className="py-4 text-center w-[180px]"></th>
              <th className="py-4 text-center w-[120px]">Giá tiền</th>
              <th className="py-4 text-center w-[140px]">Số lượng</th>
              <th className="py-4 text-center w-[140px]">Tổng tiền</th>
              <th className="py-4 text-right w-[80px]"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Giỏ hàng trống.
                </td>
              </tr>
            ) : (
              cartItems.map((item) => {
                const product = item.product;
                const image = product?.image || "";
                const originalPrice = parseFloat(product.price || 0);
                const price = parseFloat(product.promotion?.discounted_price || product.price || 0);
                const discountPercent = parseFloat(product.promotion?.discount_percent || 0);
                const quantity = item.quantity;
                const total = price * quantity;

                return (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.product_id)}
                        onChange={() => handleSelect(item.product_id)}
                      />
                    </td>
                    <td className="pl-10 py-4">
                      <div className="flex space-x-6 items-center">
                        <div className="w-[80px] h-[80px] overflow-hidden border border-[#EDEDED] flex justify-center items-center">
                          <img
                            src={image}
                            alt="product"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[15px] text-qblack">{product.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 w-[180px] align-top">
                    </td>
                    <td className="text-center py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-semibold ${discountPercent > 0 ? "text-red-500" : "text-black"}`}>
                          {Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </span>
                        {discountPercent > 0 && price < originalPrice && (
                          <span className="text-black-400 line-through text-xs">
                            {Number(originalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-center align-middle">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <QuantityInput
                          quantity={quantity}
                          onChange={(newQuantity) =>
                            handleQuantityChange(item.product_id, newQuantity)
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center py-4">
                      {Number(total).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                    <td className="text-right py-4">
                      <button
                        onClick={() => handleConfirmDelete(item.product_id)}
                        className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition duration-200"
                        title="Xóa sản phẩm"
                      >
                        <FaTrashAlt size={20} className="font-bold" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <FormDelete
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        message={deleteMessage}
        Id={deleteItemId}
      />

      <FormDelete
        isOpen={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        onConfirm={handleClearCart}
        message="Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?"
      />
    </div>
  );
};

export default ProductsTable;