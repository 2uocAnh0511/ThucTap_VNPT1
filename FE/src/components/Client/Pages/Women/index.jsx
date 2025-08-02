import React from "react";

const WomenProducts = () => {
    const products = [
        { id: 1, name: "Đồng hồ Elegance", image: "/images/product3.webp", price: "3.000.000 VND" },
        { id: 2, name: "Đồng hồ Luxora", image: "/images/product3.webp", price: "2.800.000 VND" },
        { id: 3, name: "Đồng hồ Sophia", image: "/images/product3.webp", price: "4.500.000 VND" },
        { id: 4, name: "Đồng hồ Bella", image: "/images/product3.webp", price: "2.200.000 VND" },
        { id: 44, name: "Đồng hồ Bella", image: "/images/product3.webp", price: "2.200.000 VND" },
        { id: 34, name: "Đồng hồ Bella", image: "/images/product3.webp", price: "2.200.000 VND" },
        { id: 4, name: "Đồng hồ Bella", image: "/images/product3.webp", price: "2.200.000 VND" },
        { id: 5, name: "Đồng hồ Chic", image: "/images/product3.webp", price: "1.900.000 VND" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Sản phẩm dành cho nữ</h2>
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-md-3">
                        <div className="card">
                            <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body text-center">
                                <h6>{product.name}</h6>
                                <p className="text-danger">{product.price}</p>
                                <button className="btn btn-sm btn-primary">Xem chi tiết</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WomenProducts;
