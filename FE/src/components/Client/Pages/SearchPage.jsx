import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Constants from "../../../Constanst";
import { Link } from "react-router-dom"; // ⬅️ THÊM dòng này ở đầu file

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery();
  const keyword = query.get("keyword");
  const [results, setResults] = useState([]);

// SearchPage.jsx
useEffect(() => {
  if (!keyword) return;
  const fetchData = async () => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/api/products`, {
        params: { searchTerm: keyword }
      });
      setResults(res.data.data);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
  };

  fetchData();
}, [keyword]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Kết quả cho: "{keyword}"</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {results.map((item) => (
  <Link
    to={`/product/${item.id}`}
    key={item.id}
    className="border rounded p-3 hover:shadow-md transition duration-200 block"
  >
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-400 object-cover"
    />
    <h3 className="text-sm font-medium mt-2">{item.title}</h3>
    <p className="text-red-600 font-semibold">
      {item.price?.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}
    </p>
    <p className="text-xs text-gray-500">
      Danh mục: {item.category?.name}
    </p>
  </Link>
))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
