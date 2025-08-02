import React from 'react';
import { ProductStatisticsChart, UserStatisticsChart } from '../StatisticsCharts';

const HomeAdmin = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Trang Thống Kê Quản Trị</h1>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">📦 Thống kê sản phẩm</h2>
            </div>
            <div className="card-body">
              <ProductStatisticsChart />
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h2 className="mb-0">👤 Thống kê người dùng</h2>
            </div>
            <div className="card-body">
              <UserStatisticsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
