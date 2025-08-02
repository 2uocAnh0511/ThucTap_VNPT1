import React from "react";

const AccessoryProducts = () => {
    const products = [
        { id: 1, name: "Kính mát thời trang", image: "/images/product3.webp", price: "1.200.000 VND" },
        { id: 2, name: "Thắt lưng da cao cấp", image: "/images/product3.webp", price: "850.000 VND" },
        { id: 3, name: "Ví da nam sang trọng", image: "/images/product3.webp", price: "950.000 VND" },
        { id: 4, name: "Găng tay da cừu", image: "/images/product3.webp", price: "1.500.000 VND" },
        { id: 44, name: "Găng tay da cừu", image: "/images/product3.webp", price: "1.500.000 VND" },
        { id: 42, name: "Găng tay da cừu", image: "/images/product3.webp", price: "1.500.000 VND" },
        { id: 47, name: "Găng tay da cừu", image: "/images/product3.webp", price: "1.500.000 VND" },
        { id: 5, name: "Mũ lưỡi trai phong cách", image: "/images/product3.webp", price: "600.000 VND" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Phụ kiện thời trang</h2>
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

export default AccessoryProducts;
