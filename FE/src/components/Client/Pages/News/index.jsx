import React from "react";

const NewsPage = () => {
    const newsList = [
        { id: 1, title: "Xu hướng đồng hồ 2025", image: "/images/banner.jpg", description: "Khám phá những mẫu đồng hồ hot nhất trong năm 2025.", date: "30/03/2025" },
        { id: 2, title: "Cách chọn đồng hồ phù hợp", image: "/images/news2.webp", description: "Hướng dẫn chọn đồng hồ theo phong cách và cá tính.", date: "28/03/2025" },
        { id: 3, title: "Bảo quản đồng hồ đúng cách", image: "/images/news3.webp", description: "Những mẹo đơn giản để giữ đồng hồ bền đẹp.", date: "25/03/2025" },
        { id: 4, title: "Phụ kiện thời trang đi kèm đồng hồ", image: "/images/news4.webp", description: "Kết hợp đồng hồ với trang phục và phụ kiện chuẩn phong cách.", date: "22/03/2025" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Tin tức & Xu hướng</h2>
            <div className="row">
                {newsList.map((news) => (
                    <div key={news.id} className="col-md-6 mb-4">
                        <div className="card">
                            <img src={news.image} className="card-img-top" alt={news.title} style={{ height: '250px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5>{news.title}</h5>
                                <p className="text-muted">{news.date}</p>
                                <p>{news.description}</p>
                                <button className="btn btn-primary btn-sm">Xem chi tiết</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsPage;
