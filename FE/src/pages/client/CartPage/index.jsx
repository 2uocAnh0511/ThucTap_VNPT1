import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyCardError from "../EmptyCardError";
import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/LayoutHomeThree";
import ProductsTable from "./ProductsTable";
import Constants from "../../../Constants";
import axios from "axios";

export default function CardPage({ cart = true }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalTotalPrice, setOriginalTotalPrice] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [activePromotions, setActivePromotions] = useState([]);
  const [selectedProductVariants, setSelectedProductVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    localStorage.removeItem("selectedPromoCode");
    localStorage.removeItem("selectedVoucher");
    localStorage.removeItem("finalTotal");
    localStorage.removeItem("checkoutData");
    setPromoCode("");
    setSelectedVoucher(null);
    setDiscountInfo(null);
    setError("");
  }, []);

  useEffect(() => {
    const fetchActivePromotions = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Vui lòng đăng nhập để xem mã giảm giá.");
          setActivePromotions([]);
          return;
        }

        if (totalPrice === 0) {
          setError("Vui lòng chọn sản phẩm trước khi áp dụng mã giảm giá.");
          setActivePromotions([]);
          return;
        }

        const response = await axios.get(`${Constants.DOMAIN_API}/promotions/active`, {
          params: { orderTotal: totalPrice },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setActivePromotions(response.data.data || []);
        setError("");
      } catch (err) {
        console.error('Error fetching active promotions:', err);
        setActivePromotions([]);
        if (err.response && err.response.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError("Đã xảy ra lỗi khi lấy danh sách mã giảm giá.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePromotions();
  }, [totalPrice]);

  useEffect(() => {
    let voucherDiscount = 0;
    if (selectedVoucher) {
      if (totalPrice < selectedVoucher.min_price_threshold) {
        setSelectedVoucher(null);
        setError(`Đơn hàng phải tối thiểu ${selectedVoucher.min_price_threshold.toLocaleString()}₫ để sử dụng voucher này.`);
        return;
      }
      if (selectedVoucher.discount_type === "shipping") {
        voucherDiscount = 0;
      } else if (selectedVoucher.discount_type === "percentage") {
        voucherDiscount = Math.min(
          (totalPrice * selectedVoucher.discount_value) / 100,
          selectedVoucher.max_price || Infinity
        );
      } else if (selectedVoucher.discount_type === "fixed") {
        voucherDiscount = Math.min(selectedVoucher.discount_value, totalPrice);
      }
    }

    setDiscountInfo((prev) => {
      const promoDiscount = prev?.promoDiscount || 0;
      const totalDiscount = Math.min(voucherDiscount + promoDiscount, totalPrice);
      return {
        ...prev,
        voucherDiscount,
        promoDiscount,
        discountAmount: totalDiscount,
        max_price: selectedVoucher?.max_price || prev?.max_price || 0,
      };
    });
  }, [selectedVoucher, totalPrice]);

  useEffect(() => {
    if (!promoCode) {
      setDiscountInfo((prev) => ({
        ...prev,
        promoDiscount: 0,
        discountAmount: prev?.voucherDiscount || 0,
        max_price: prev?.max_price || 0,
      }));
      setError("");
    }
  }, [promoCode]);

  const handleVoucherSelect = (voucher) => {
    if (selectedVoucher && selectedVoucher.id === voucher.id) {
      setSelectedVoucher(null);
      setError("");
    } else if (totalPrice >= voucher.min_price_threshold) {
      setSelectedVoucher(voucher);
      setError("");
      localStorage.setItem("selectedVoucher", JSON.stringify(voucher));
    } else {
      setSelectedVoucher(null);
      setError(`Đơn hàng phải tối thiểu ${voucher.min_price_threshold.toLocaleString()}₫ để sử dụng voucher này.`);
    }
  };

  const handleApplyDiscount = async () => {
    setError("");
    if (!promoCode.trim()) {
      setError("Vui lòng nhập mã giảm giá.");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để áp dụng mã giảm giá.");
        return;
      }
      const res = await fetch(`${Constants.DOMAIN_API}/promotions/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: promoCode.trim(),
          orderTotal: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi áp dụng mã.");
      }
      if (!data.data) {
        throw new Error("Dữ liệu giảm giá không hợp lệ.");
      }
      const promoDiscount = data.data.discountAmount || 0;
      const promotionUserId = data.data.promotion_user_id || null;
      const voucherDiscount = discountInfo?.voucherDiscount || 0;
      const totalDiscount = Math.min(voucherDiscount + promoDiscount, totalPrice);

      setDiscountInfo((prev) => ({
        ...prev,
        ...data.data,
        promoDiscount,
        voucherDiscount,
        promoDiscount,
        discountAmount: totalDiscount,
        max_price: selectedVoucher?.max_price || data.data.max_price || 0,
        promotion_user_id: promotionUserId
      }));

      localStorage.setItem(
        "selectedPromoCode",
        JSON.stringify({
          code: promoCode.trim(),
          discountAmount: promoDiscount,
          maxPrice: data.data.max_price,
          promotion_user_id: promotionUserId,
          appliedAt: Date.now(),
        })
      );

      setError("");
    } catch (err) {
      setDiscountInfo((prev) => ({
        ...prev,
        promoDiscount: 0,
        discountAmount: prev?.voucherDiscount || 0,
      }));
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearPromoCode = () => {
    setPromoCode("");
    setError("");
  };

  const finalTotal = discountInfo ? totalPrice - discountInfo.discountAmount : totalPrice;

  useEffect(() => {
    if (selectedProductVariants.length > 0) {
      const checkoutData = {
        selectedProductVariants,
        cartItems: cartItems.filter((item) =>
          selectedProductVariants.includes(item.product_variant_id)
        ),
        totalPrice,
        originalTotalPrice,
        discountInfo,
        finalTotal,
        promotion_user_id: discountInfo?.promotion_user_id || null,
      };
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    }
  }, [selectedProductVariants, cartItems, totalPrice, originalTotalPrice, discountInfo, finalTotal]);

  useEffect(() => {
    const savedVoucher = localStorage.getItem("selectedVoucher");
    if (savedVoucher) {
      const parsed = JSON.parse(savedVoucher);
      setSelectedVoucher(parsed);
    }
  }, []);

  const saveFinalTotalToLocalStorage = () => {
    const finalData = {
      label: discountInfo ? "Tổng sau giảm" : "Tổng cộng",
      amount: finalTotal,
      formattedAmount: Number(finalTotal).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      hasDiscount: !!discountInfo,
      discountAmount: discountInfo?.discountAmount || 0,
      originalTotalPrice,
    };

    localStorage.setItem("finalTotal", JSON.stringify(finalData));
  };

  useEffect(() => {
    saveFinalTotalToLocalStorage();
  }, [totalPrice, originalTotalPrice, discountInfo, finalTotal]);

  const handleTotalChange = (newTotal) => {
    setTotalPrice(newTotal.discountedTotal || newTotal);
    setOriginalTotalPrice(newTotal.originalTotal || newTotal);
  };

  return (
    <Layout childrenClasses={cart ? "pt-0 pb-0" : ""}>
      {cart === false ? (
        <div className="cart-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom
              paths={[
                { name: "Trang chủ", path: "/" },
                { name: "Giỏ hàng", path: "/cart" },
              ]}
            />
            <EmptyCardError />
          </div>
        </div>
      ) : (
        <div className="cart-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="Giỏ hàng của bạn"
              breadcrumb={[
                { name: "Trang chủ", path: "/" },
                { name: "Giỏ hàng", path: "/cart" },
              ]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable
                className="mb-[30px]"
                onTotalChange={handleTotalChange}
                onSelectedItemsChange={setSelectedProductVariants}
                onCartItemsChange={setCartItems}
              />

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="relative w-[150px] h-[50px]">
                      <InputCom
                        type="text"
                        placeholder="Mã giảm giá"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      {promoCode && (
                        <button
                          type="button"
                          onClick={handleClearPromoCode}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label="Xóa mã giảm giá"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="w-[120px] h-[50px] black-btn"
                      disabled={isLoading}
                    >
                      <span className="text-sm font-semibold">{isLoading ? "Đang xử lý..." : "Áp dụng"}</span>
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                  )}

                </div>

                <div className="lg:w-1/2 w-full">
                  <div className="border border-[#EDEDED] px-[30px] py-[26px]">
                    <div className="sub-total mb-6">
                      {originalTotalPrice > totalPrice && (
                        <div className="flex justify-between mb-3">
                          <p className="text-[15px] font-medium text-qblack">Tổng giá gốc</p>
                          <p className="text-[15px] font-medium text-gray-400 line-through">
                            {Number(originalTotalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between mb-3">
                        <p className="text-[15px] font-medium text-qblack">Tổng tiền</p>
                        <p className="text-[15px] font-medium text-qred">
                          {Number(totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                        </p>
                      </div>
                      <div className="w-full h-[1px] bg-[#EDEDED]"></div>
                    </div>

                    <button type="button" className="w-full mb-10">
                      <div className="w-full h-[50px] bg-[#F6F6F6] flex justify-center items-center">
                        <span className="text-sm font-semibold">Cập nhật giỏ hàng</span>
                      </div>
                    </button>

                    <div className="flex justify-between mb-3">
                      <p className="text-[18px] font-medium text-qblack">
                        {discountInfo ? "Tổng sau giảm" : "Tổng cộng"}
                      </p>
                      <p className="text-[18px] font-medium text-qred">
                        {Number(finalTotal).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </p>
                    </div>

                    {selectedProductVariants.length > 0 ? (
                      <Link
                        to={{
                          pathname: "/checkout",
                          state: {
                            selectedProductVariants,
                            cartItems: cartItems.filter((item) =>
                              selectedProductVariants.includes(item.product_variant_id)
                            ),
                            totalPrice,
                            originalTotalPrice,
                            discountInfo,
                            finalTotal,
                          },
                        }}
                        onClick={() => {
                          const checkoutData = {
                            selectedProductVariants,
                            cartItems: cartItems.filter((item) =>
                              selectedProductVariants.includes(item.product_variant_id)
                            ),
                            totalPrice,
                            originalTotalPrice,
                            discountInfo,
                            finalTotal,
                          };
                          localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
                        }}
                      >
                        <div className="w-full h-[50px] black-btn flex justify-center items-center">
                          <span className="text-sm font-semibold">Tiến hành thanh toán</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="w-full h-[50px] bg-gray-300 flex justify-center items-center cursor-not-allowed">
                        <span className="text-sm font-semibold text-gray-500">Tiến hành thanh toán</span>
                      </div>
                    )}
                    {selectedProductVariants.length === 0 && (
                      <p className="text-red-500 text-sm mt-2">Vui lòng chọn ít nhất một sản phẩm để thanh toán.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}