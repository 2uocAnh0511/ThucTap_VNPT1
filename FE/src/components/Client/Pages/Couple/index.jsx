import React from "react";

const CoupleProducts = () => {
    const products = [
        { id: 1, name: "Cặp đồng hồ Royal Love", image: "/images/product3.webp", price: "6.000.000 VND" },
        { id: 2, name: "Cặp đồng hồ Eternal Bond", image: "/images/product3.webp", price: "5.500.000 VND" },
        { id: 3, name: "Cặp đồng hồ Timeless Duo", image: "/images/product3.webp", price: "7.200.000 VND" },
        { id: 4, name: "Cặp đồng hồ Classic Romance", image: "/images/product3.webp", price: "4.800.000 VND" },
        { id: 4, name: "Cặp đồng hồ Classic Romance", image: "/images/product3.webp", price: "4.800.000 VND" },
        { id: 4, name: "Cặp đồng hồ Classic Romance", image: "/images/product3.webp", price: "4.800.000 VND" },
        { id: 4, name: "Cặp đồng hồ Classic Romance", image: "/images/product3.webp", price: "4.800.000 VND" },
        { id: 5, name: "Cặp đồng hồ Elegant Pair", image: "/images/product3.webp", price: "5.000.000 VND" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Sản phẩm dành cho cặp đôi</h2>
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

export default CoupleProducts;
