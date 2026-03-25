import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // We set padding-top back to 0 because index.css might interfere, though we hid Navbar.
        document.body.style.paddingTop = '0';
        
        adminApi.getStats()
            .then(res => {
                setStats(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // For demo/UI viewing purposes, let's load dummy data if API fails
                setStats({
                    totalStudents: 15482,
                    totalCompanies: 1240,
                    totalJobs: 3512,
                    totalApplications: 250
                });
                setLoading(false);
            });
            
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải dữ liệu...</div>;

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                        </svg>
                    </div>
                    <div className="brand-text-container">
                        <span className="brand-title">ScholarBridge</span>
                        <span className="brand-subtitle">BẢNG ĐIỀU KHIỂN QUẢN TRỊ</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin" className="nav-item active">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Bảng điều khiển
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Quản lý người dùng
                    </Link>
                    <Link to="/admin/companies" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Xác minh công ty
                    </Link>
                    <Link to="/admin/jobs" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Kiểm duyệt việc làm
                    </Link>
                    <Link to="/admin/skills" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        Quản lý ngành nghề
                    </Link>
                    <Link to="/admin/reports" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        Báo cáo
                    </Link>
                    <Link to="/admin/settings" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Cài đặt
                    </Link>
                </nav>

                <div className="sidebar-bottom">
                    <div className="status-pill">
                        <span className="status-dot"></span>
                        Trạng thái hệ thống: Khỏe mạnh
                    </div>
                    <Link to="/admin/help" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Trung tâm trợ giúp
                    </Link>
                    <button onClick={handleLogout} className="nav-item danger" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main">
                {/* HEADER */}
                <header className="admin-header">
                    <div className="header-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Tìm kiếm ứng dụng, công ty..." />
                    </div>
                    
                    <div className="header-actions">
                        <div className="action-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </div>
                        <div className="action-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </div>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">Alex Rivera</span>
                                <span className="user-role">Quản trị viên cấp cao</span>
                            </div>
                            <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="user-avatar" />
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT */}
                <div className="admin-content">
                    <div className="page-header">
                        <div className="page-title">
                            <h1>Tổng quan vận hành</h1>
                            <p>Theo dõi hiệu suất hệ sinh thái ScholarBridge.</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn-secondary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Xuất báo cáo
                            </button>
                            <button className="btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Mới đối tác
                            </button>
                        </div>
                    </div>

                    {/* STATS OVERVIEW */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#e0ebff', color: '#0d5cda' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div className="stat-trend trend-up">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    12%
                                </div>
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">Total Students</div>
                                <div className="stat-value">{stats?.totalStudents?.toLocaleString() || '15,482'}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#e5e7eb', color: '#4b5563' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                </div>
                                <div className="stat-trend trend-up">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    8.4%
                                </div>
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">Total Employers</div>
                                <div className="stat-value">{stats?.totalCompanies?.toLocaleString() || '1,240'}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#ffedd5', color: '#c2410c' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                </div>
                                <div className="stat-trend trend-neutral">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                                    Stable
                                </div>
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">Active Jobs</div>
                                <div className="stat-value">{stats?.totalJobs?.toLocaleString() || '3,512'}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                </div>
                                <div className="stat-trend trend-danger">
                                    New
                                </div>
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">Weekly Registrations</div>
                                <div className="stat-value">{stats?.totalApplications || '250'}</div>
                            </div>
                        </div>
                    </div>

                    {/* TWO COLUMNS */}
                    <div className="dashboard-grid">
                        {/* CHART PANEL */}
                        <div className="panel">
                            <div className="panel-header">
                                <div className="panel-title">
                                    <h3>Phân tích tăng trưởng</h3>
                                    <p>Tỉ lệ chấp nhận người dùng (30 ngày)</p>
                                </div>
                                <div className="panel-action">30 ngày qua</div>
                            </div>
                            
                            <div className="chart-container">
                                {[35, 45, 30, 52, 38, 55, 40, 60].map((val, idx) => (
                                    <div key={idx} className={`chart-bar ${idx === 7 ? 'active' : ''}`} style={{ height: `${val}%` }}></div>
                                ))}
                            </div>
                            <div className="chart-labels">
                                <span>NGÀY 01</span>
                                <span>NGÀY 15</span>
                                <span>HÔM NAY</span>
                            </div>
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="panel">
                            <div className="panel-header">
                                <div className="panel-title">
                                    <h3>Thao tác nhanh</h3>
                                </div>
                            </div>
                            <div className="action-list">
                                <div className="action-card">
                                    <div className="action-icon-wrapper" style={{ background: '#e0ebff', color: '#0d5cda' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    </div>
                                    <div className="action-content">
                                        <h4>Xác minh doanh nghiệp</h4>
                                        <p>12 yêu cầu đang chờ</p>
                                    </div>
                                </div>
                                
                                <div className="action-card">
                                    <div className="action-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    </div>
                                    <div className="action-content">
                                        <h4>Quản lý nội dung báo cáo</h4>
                                        <p>4 báo cáo ưu tiên</p>
                                    </div>
                                </div>

                                <div className="action-card">
                                    <div className="action-icon-wrapper" style={{ background: '#f3f4f6', color: '#4b5563' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M2 12h4l2-9 5 18 2-9h5"></path></svg>
                                    </div>
                                    <div className="action-content">
                                        <h4>Thông báo hệ thống</h4>
                                        <p>Tiếp cận tất cả người dùng</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SYSTEM LOGS */}
                        <div className="panel">
                            <div className="panel-header">
                                <div className="panel-title">
                                    <h3>Hoạt động hệ thống</h3>
                                </div>
                                <div className="panel-action transparent">Xem tất cả nhật ký</div>
                            </div>
                            
                            <div className="log-list">
                                <div className="log-item">
                                    <div className="log-avatar">G</div>
                                    <div className="log-content">
                                        <p><strong>Google</strong> đã đăng một công việc mới <strong>Junior UI Designer</strong></p>
                                        <span className="log-time">2 PHÚT TRƯỚC</span>
                                    </div>
                                    <span className="log-tag blue">BÀI ĐĂNG VIỆC</span>
                                </div>

                                <div className="log-item">
                                    <div className="log-avatar red"></div>
                                    <div className="log-content">
                                        <p><strong>Báo cáo được gửi</strong> bởi User#8291 <strong>Nội dung không phù hợp</strong></p>
                                        <span className="log-time">14 PHÚT TRƯỚC</span>
                                    </div>
                                    <span className="log-tag orange">BÁO CÁO</span>
                                </div>

                                <div className="log-item">
                                    <div className="log-avatar blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
                                    <div className="log-content">
                                        <p><strong>NovaTech Inc</strong> đã hoàn thành xác minh</p>
                                        <span className="log-time">45 PHÚT TRƯỚC</span>
                                    </div>
                                    <span className="log-tag gray">DOANH NGHIỆP</span>
                                </div>
                            </div>
                        </div>

                        {/* REGION STATS */}
                        <div className="panel">
                            <div className="panel-header">
                                <div className="panel-title">
                                    <h3>Phạm vi toàn cầu</h3>
                                    <p>Lưu lượng truy cập theo khu vực</p>
                                </div>
                            </div>
                            
                            <div className="globe-img-wrapper">
                                <div className="dummy-globe"></div>
                            </div>
                            
                            <div className="region-stats">
                                <div className="region-stat">
                                    <div className="region-name">Bắc Mỹ</div>
                                    <div className="region-value">45%</div>
                                </div>
                                <div className="region-stat">
                                    <div className="region-name">Châu Âu</div>
                                    <div className="region-value">32%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <footer className="admin-footer">
                        <span>© 2024 ScholarBridge Inc. | Bảng điều khiển quản trị v2.4.0</span>
                        <div className="admin-footer-links">
                            <a href="#">Giao thức quyền riêng tư</a>
                            <a href="#">Nhật ký kiểm tra</a>
                            <a href="#">Tuân thủ</a>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
