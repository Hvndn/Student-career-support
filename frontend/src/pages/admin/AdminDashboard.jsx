import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';
import '../../assets/css/admin/AdminSidebar.css';
import '../../assets/css/admin/AdminNavbar.css';
import '../../assets/css/admin/AdminDashboard.css';
import globeImage from '../../assets/images/admin/global_reach_globe.png';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        totalJobs: 0,
        totalApplications: 0,
        pendingCompanies: 0,
        totalReports: 0,
        successRate: 0,
        recentJobs: []
    });
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminApi.getStats();
                if (res.data && res.data.data) {
                    const data = res.data.data;
                    setStats({
                        totalStudents: data.totalStudents || 0,
                        totalCompanies: data.totalCompanies || 0,
                        totalJobs: data.totalJobs || 0,
                        totalApplications: data.totalApplications || 0,
                        pendingCompanies: data.pendingCompanies || 0,
                        totalReports: data.totalReports || 0,
                        successRate: data.successRate || 0,
                        recentJobs: data.recentJobs || []
                    });
                }
            } catch (err) {
                console.error("Lấy thống kê admin thất bại:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="admin-loading">
            <div className="loader"></div>
            <span>Đang tải dữ liệu vận hành...</span>
        </div>
    );

    const metrics = [
        { label: 'Sinh viên đăng ký', value: stats.totalStudents.toLocaleString(), trend: '+ 12%', trendType: 'up', icon: 'person', color: '#3b82f6' },
        { label: 'Nhà tuyển dụng', value: stats.totalCompanies.toLocaleString(), trend: '+ 8.4%', trendType: 'up', icon: 'business_center', color: '#6366f1' },
        { label: 'Tin tuyển dụng', value: stats.totalJobs.toLocaleString(), trend: 'Ổn định', trendType: 'stable', icon: 'work', color: '#f97316' },
        { label: 'Tổng ứng tuyển', value: stats.totalApplications.toLocaleString(), trend: 'Mới', trendType: 'new', icon: 'person_add', color: '#ef4444' }
    ];

    const chartData = [35, 45, 30, 52, 38, 55, 40, 60, 45, 65, 58, 62, 50, 75, 85];

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar />
                <main className="admin-body">
                    <section className="admin-header-section">
                        <div className="header-text">
                            <h1>Tổng quan vận hành</h1>
                            <p>Theo dõi hiệu suất hệ sinh thái ScholarBridge.</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-secondary">
                                <span className="material-symbols-outlined">file_download</span>
                                Xuất báo cáo
                            </button>
                            <button className="btn-primary">
                                <span className="material-symbols-outlined">add</span>
                                Mới đối tác
                            </button>
                        </div>
                    </section>

                    <section className="metrics-grid">
                        {metrics.map((metric, i) => (
                            <div key={i} className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon" style={{ backgroundColor: metric.color + '15', color: metric.color }}>
                                        <span className="material-symbols-outlined">{metric.icon}</span>
                                    </div>
                                    <div className={`metric-trend ${metric.trendType}`}>
                                        {metric.trendType === 'up' && <span className="material-symbols-outlined">trending_up</span>}
                                        {metric.trendType === 'stable' && <span className="material-symbols-outlined">sync</span>}
                                        {metric.trend === 'New' && <span className="new-dot"></span>}
                                        {metric.trend}
                                    </div>
                                </div>
                                <div className="metric-info">
                                    <span className="metric-label">{metric.label}</span>
                                    <h2 className="metric-value">{metric.value}</h2>
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className="main-dashboard-grid">
                        <div className="left-column">
                            {/* GROWTH CHART */}
                            <div className="dashboard-card growth-chart-card">
                                <div className="card-header">
                                    <div className="card-title-group">
                                        <h3>Phân tích tăng trưởng</h3>
                                        <p>Tỉ lệ chấp nhận người dùng (30 ngày)</p>
                                    </div>
                                    <button className="chart-filter-btn">30 ngày qua</button>
                                </div>
                                <div className="bar-chart-container">
                                    {chartData.map((val, idx) => (
                                        <div key={idx} className="bar-wrapper">
                                            <div
                                                className={`chart-bar ${idx === chartData.length - 1 ? 'active' : ''}`}
                                                style={{ height: `${val}%` }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="chart-labels">
                                    <span>NGÀY 01</span>
                                    <span>NGÀY 15</span>
                                    <span>HÔM NAY</span>
                                </div>
                            </div>

                            {/* SYSTEM ACTIVITY */}
                            <div className="dashboard-card activity-card">
                                <div className="card-header">
                                    <h3>Hoạt động hệ thống gần đây</h3>
                                    <Link to="/admin/jobs" className="see-all-link">Xem tất cả việc làm</Link>
                                </div>
                                <div className="activity-list">
                                    {stats.recentJobs && stats.recentJobs.length > 0 ? stats.recentJobs.map((job, index) => (
                                        <div key={job.id || index} className="activity-item">
                                            <div className="activity-avatar bg-blue">
                                                {job.companyName ? job.companyName.charAt(0) : 'J'}
                                            </div>
                                            <div className="activity-content">
                                                <p><span className="bold">{job.companyName}</span> đã đăng một công việc mới: <span className="bold">{job.title}</span></p>
                                                <span className="time">{job.postedAt ? new Date(job.postedAt).toLocaleDateString('vi-VN') : 'Mới đây'}</span>
                                            </div>
                                            <span className="activity-tag job">BÀI ĐĂNG VIỆC</span>
                                        </div>
                                    )) : (
                                        <div className="activity-item">
                                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Chưa có hoạt động mới nào được ghi lại.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="right-column">
                            {/* QUICK ACTIONS */}
                            <div className="right-sidebar-section">
                                <h3>Thao tác nhanh</h3>
                                <div className="quick-action-list">
                                    <div className="action-item" onClick={() => navigate('/admin/reports')} style={{ cursor: 'pointer' }}>
                                        <div className="action-icon red">
                                            <span className="material-symbols-outlined">policy</span>
                                        </div>
                                        <div className="action-info">
                                            <h4>Báo cáo & Khiếu nại</h4>
                                            <p>{stats.totalReports} báo cáo cần xử lý</p>
                                        </div>
                                    </div>
                                    <div className="action-item">
                                        <div className="action-icon purple">
                                            <span className="material-symbols-outlined">hub</span>
                                        </div>
                                        <div className="action-info">
                                            <h4>Thông báo hệ thống</h4>
                                            <p>Gửi thông báo toàn hệ thống</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* GLOBAL REACH */}
                            <div className="dashboard-card global-reach-card">
                                <div className="card-header">
                                    <div className="card-title-group">
                                        <h3>Phạm vi toàn cầu</h3>
                                        <p>Lưu lượng truy cập theo khu vực</p>
                                    </div>
                                </div>
                                <div className="globe-visualization">
                                    <img src={globeImage} alt="Global Reach Map" />
                                </div>
                                <div className="region-stats">
                                    <div className="region-item">
                                        <span className="region-label">BẮC MỸ</span>
                                        <span className="region-value">45%</span>
                                    </div>
                                    <div className="region-item">
                                        <span className="region-label">CHÂU ÂU</span>
                                        <span className="region-value">32%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="admin-footer">
                        <p>© 2024 ScholarBridge Inc. | Bảng điều khiển quản trị v2.4.0</p>
                        <div className="footer-links">
                            <Link to="#">Giao thức quyền riêng tư</Link>
                            <Link to="#">Nhật ký kiểm tra</Link>
                            <Link to="#">Tuân thủ</Link>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
