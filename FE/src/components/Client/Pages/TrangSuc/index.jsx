import React from "react";

const JewelryProducts = () => {
    const products = [
        { id: 1, name: "Dây chuyền Vàng 18K", image: "/images/product3.webp", price: "3.500.000 VND" },
        { id: 2, name: "Nhẫn Kim Cương", image: "/images/product3.webp", price: "8.200.000 VND" },
        { id: 3, name: "Bông tai Ngọc Trai", image: "/images/product3.webp", price: "2.700.000 VND" },
        { id: 4, name: "Lắc tay Bạc Ý", image: "/images/product3.webp", price: "1.900.000 VND" },
        { id: 4, name: "Lắc tay Bạc Ý", image: "/images/product3.webp", price: "1.900.000 VND" },
        { id: 4, name: "Lắc tay Bạc Ý", image: "/images/product3.webp", price: "1.900.000 VND" },
        { id: 4, name: "Lắc tay Bạc Ý", image: "/images/product3.webp", price: "1.900.000 VND" },
        { id: 5, name: "Vòng cổ Sapphire", image: "/images/product3.webp", price: "5.400.000 VND" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Trang sức cao cấp</h2>
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

export default JewelryProducts;
