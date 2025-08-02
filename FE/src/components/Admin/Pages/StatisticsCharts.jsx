    import React, { useEffect, useState } from 'react';
    import { Bar, Pie } from 'react-chartjs-2';
    import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
    } from 'chart.js';

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

    // Biểu đồ thống kê sản phẩm
    export const ProductStatisticsChart = () => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/statistics');
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thống kê sản phẩm:', error);
        }
        };

        fetchStatistics();
    }, []);

    if (!statistics) return <div>Đang tải thống kê sản phẩm...</div>;

    const labels = statistics.byCategory.map(item => item.category || 'Không rõ');
    const counts = statistics.byCategory.map(item => item.count);

    const data = {
        labels,
        datasets: [{
        label: 'Sản phẩm theo danh mục',
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }]
    };

    const options = {
        responsive: true,
        plugins: {
        title: { display: true, text: 'Sản phẩm theo danh mục' }
        }
    };

    return <Bar data={data} options={options} />;
    };

    // Biểu đồ thống kê người dùng
    export const UserStatisticsChart = () => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/userstatistics');
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thống kê người dùng:', error);
        }
        };

        fetchStatistics();
    }, []);

    if (!statistics) return <div>Đang tải thống kê người dùng...</div>;

    const labels = statistics.byRole.map(item => item.role || 'Không rõ');
    const counts = statistics.byRole.map(item => item.count);

    const data = {
        labels,
        datasets: [{
        label: 'Người dùng theo vai trò',
        data: counts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    };

    return <Pie data={data} />;
    };
