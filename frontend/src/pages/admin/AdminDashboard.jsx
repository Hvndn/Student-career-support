import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';
import '../../assets/css/admin/AdminSidebar.css';
import '../../assets/css/admin/AdminNavbar.css';
import '../../assets/css/admin/AdminDashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 50,
        totalCompanies: 3,
        totalJobs: 5,
        totalApplications: 0,
        pendingCompanies: 0,
        totalReports: 0,
        successRate: 0,
        recentJobs: []
    });
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Mock data based on design
    const metrics = [
        { label: 'Sinh viên', value: '50', icon: 'group', color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Doanh nghiệp', value: '3', icon: 'domain', color: '#ef4444', bg: '#fef2f2' },
        { label: 'Việc làm', value: '5', icon: 'work', color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Thử thách dự án', value: '1', icon: 'emoji_events', color: '#10b981', bg: '#ecfdf5' },
        { label: 'Lượt truy cập', value: '70', icon: 'show_chart', color: '#8b5cf6', bg: '#f5f3ff' },
        { label: 'Ứng tuyển', value: '0', icon: 'assignment', color: '#ec4899', bg: '#fdf2f8' },
        { label: 'Lịch hẹn', value: '3', icon: 'event', color: '#0ea5e9', bg: '#f0f9ff' },
        { label: 'Bài viết tin tức', value: '2', icon: 'article', color: '#14b8a6', bg: '#f0fdfa' }
    ];

    const lineData = [
        { name: '10', sv: 10, vl: 5 },
        { name: '15', sv: 15, vl: 8 },
        { name: '20', sv: 18, vl: 12 },
        { name: '25', sv: 16, vl: 10 },
        { name: '30', sv: 25, vl: 15 }
    ];

    const pieData = [
        { name: 'CNTT', value: 35 },
        { name: 'Xây dựng', value: 25 },
        { name: 'Kiến trúc', value: 20 },
        { name: 'Marketing', value: 12 },
        { name: 'Khác', value: 8 }
    ];
    const COLORS = ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#94a3b8'];

    if (loading) return (
        <div className="admin-loading">
            <div className="loader"></div>
            <span>Đang tải dữ liệu...</span>
        </div>
    );

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar />
                <main className="admin-body">
                    <section className="dau-header-section">
                        <div className="dau-header-left">
                            <div className="status-badge-dau">
                                <span className="status-dot"></span>
                                ADMIN DASHBOARD
                            </div>
                            <h1>Chào buổi tối, <span className="text-red">Admin</span> 👋</h1>
                            <p>Tổng quan hệ thống DAU Connect hôm nay</p>
                        </div>
                        <div className="dau-header-right">
                            <button className="btn-refresh">
                                <span className="material-symbols-outlined">refresh</span>
                                Làm mới
                            </button>
                        </div>
                    </section>

                    <section className="dau-metrics-grid">
                        {metrics.map((metric, i) => (
                            <div key={i} className="dau-metric-card">
                                <div className="dau-metric-icon" style={{ backgroundColor: metric.bg, color: metric.color }}>
                                    <span className="material-symbols-outlined">{metric.icon}</span>
                                </div>
                                <div className="dau-metric-content">
                                    <h2 className="dau-metric-value">{metric.value}</h2>
                                    <span className="dau-metric-label">{metric.label}</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className="dau-charts-grid">
                        <div className="dau-chart-card">
                            <div className="dau-chart-header">
                                <div className="dau-chart-title">
                                    <h3>Xu hướng tăng trưởng</h3>
                                    <p>Sinh viên & Việc làm mới theo tháng</p>
                                </div>
                                <div className="dau-chart-legend">
                                    <div className="legend-item"><span className="dot" style={{background:'#a31919'}}></span>Sinh viên mới</div>
                                    <div className="legend-item"><span className="dot" style={{background:'#f97316'}}></span>Việc làm mới</div>
                                </div>
                            </div>
                            
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                        <YAxis tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Line type="monotone" dataKey="sv" stroke="#a31919" strokeWidth={3} dot={{r:6, fill:'#a31919'}} activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="vl" stroke="#f97316" strokeWidth={3} dot={{r:6, fill:'#f97316'}} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="dau-chart-card">
                            <div className="dau-chart-header">
                                <div className="dau-chart-title">
                                    <h3>Phân bố ngành nghề</h3>
                                    <p>Doanh nghiệp theo lĩnh vực</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', height: 300, paddingRight: '20px' }}>
                                <div style={{ flex: 1, height: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="pie-custom-legend">
                                    {pieData.map((entry, index) => (
                                        <div key={index} className="pie-legend-item">
                                            <div className="pie-legend-left">
                                                <span className="dot" style={{ background: COLORS[index % COLORS.length] }}></span>
                                                <span className="name">{entry.name}</span>
                                            </div>
                                            <span className="value">{entry.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dau-bottom-grid">
                        <div className="dau-list-card">
                            <div className="dau-list-header">
                                <div className="dau-list-title">
                                    <span className="material-symbols-outlined icon-orange">trending_up</span>
                                    <div>
                                        <h3>Top việc làm nổi bật</h3>
                                        <p>Nhiều lượt xem nhất</p>
                                    </div>
                                </div>
                                <a href="#all" className="link-red">Xem tất cả <span className="material-symbols-outlined">arrow_forward</span></a>
                            </div>
                            <div className="dau-list-content">
                                <div className="job-top-item">
                                    <span className="rank-badge rank-1">#1</span>
                                    <div className="job-info">
                                        <h4>Họa viên Kiến trúc (Draftsman) 22</h4>
                                        <p>CÔNG TY TNHH PHƯƠNG ANH</p>
                                    </div>
                                    <div className="job-stats">
                                        <span className="stat"><span className="material-symbols-outlined">visibility</span> 23</span>
                                        <span className="stat hl"><span className="material-symbols-outlined">person_outline</span> 0</span>
                                    </div>
                                </div>
                                <div className="job-top-item">
                                    <span className="rank-badge rank-2">#2</span>
                                    <div className="job-info">
                                        <h4>Chỉ Huy Trưởng Công Trình - Ưu Tiên Nam</h4>
                                        <p>CÔNG TY TNHH PHƯƠNG ANH</p>
                                    </div>
                                    <div className="job-stats">
                                        <span className="stat"><span className="material-symbols-outlined">visibility</span> 19</span>
                                        <span className="stat hl"><span className="material-symbols-outlined">person_outline</span> 0</span>
                                    </div>
                                </div>
                                <div className="job-top-item">
                                    <span className="rank-badge rank-3">#3</span>
                                    <div className="job-info">
                                        <h4>Nhân Viên Kế Toán Xây Dựng (Tuyển Gấp)</h4>
                                        <p>CÔNG TY TNHH PHƯƠNG ANH</p>
                                    </div>
                                    <div className="job-stats">
                                        <span className="stat"><span className="material-symbols-outlined">visibility</span> 11</span>
                                        <span className="stat hl"><span className="material-symbols-outlined">person_outline</span> 0</span>
                                    </div>
                                </div>
                                <div className="job-top-item">
                                    <span className="rank-badge rank-other">#5</span>
                                    <div className="job-info">
                                        <h4>Kỹ sư Thiết kế Kết cấu</h4>
                                        <p>Green Space Construction</p>
                                    </div>
                                    <div className="job-stats">
                                        <span className="stat"><span className="material-symbols-outlined">visibility</span> 8</span>
                                        <span className="stat hl"><span className="material-symbols-outlined">person_outline</span> 0</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dau-list-card">
                            <div className="dau-list-header">
                                <div className="dau-list-title">
                                    <span className="material-symbols-outlined icon-blue">schedule</span>
                                    <div>
                                        <h3>Hoạt động gần đây</h3>
                                        <p>Cập nhật real-time</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dau-list-content">
                                <div className="activity-row">
                                    <div className="avatar-icon"><span className="material-symbols-outlined">person_add</span></div>
                                    <div className="activity-info">
                                        <p>Sinh viên <strong>Tran Hoang Lan</strong> vừa tham gia hệ thống</p>
                                        <span>18 ngày trước</span>
                                    </div>
                                </div>
                                <div className="activity-row">
                                    <div className="avatar-icon"><span className="material-symbols-outlined">person_add</span></div>
                                    <div className="activity-info">
                                        <p>Sinh viên <strong>Vu Anh Tai</strong> vừa tham gia hệ thống</p>
                                        <span>18 ngày trước</span>
                                    </div>
                                </div>
                                <div className="activity-row">
                                    <div className="avatar-icon"><span className="material-symbols-outlined">person_add</span></div>
                                    <div className="activity-info">
                                        <p>Sinh viên <strong>Le Minh Dat</strong> vừa tham gia hệ thống</p>
                                        <span>18 ngày trước</span>
                                    </div>
                                </div>
                                <div className="activity-row">
                                    <div className="avatar-icon"><span className="material-symbols-outlined">person_add</span></div>
                                    <div className="activity-info">
                                        <p>Sinh viên <strong>Pham Huu Tri</strong> vừa tham gia hệ thống</p>
                                        <span>18 ngày trước</span>
                                    </div>
                                </div>
                                <div className="activity-row">
                                    <div className="avatar-icon"><span className="material-symbols-outlined">person_add</span></div>
                                    <div className="activity-info">
                                        <p>Sinh viên <strong>Hoang Hoang Trinh</strong> vừa tham gia hệ thống</p>
                                        <span>18 ngày trước</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dau-full-card mt-20">
                        <div className="dau-list-header">
                            <div className="dau-list-title">
                                <span className="material-symbols-outlined icon-yellow">error</span>
                                <div>
                                    <h3>Doanh nghiệp chờ duyệt</h3>
                                    <p>Cần xét duyệt để kích hoạt</p>
                                </div>
                            </div>
                            <a href="#manage" className="link-red">Quản lý <span className="material-symbols-outlined">arrow_forward</span></a>
                        </div>
                        <div className="dau-empty-state">
                            <div className="empty-icon-wrapper">
                                <span className="material-symbols-outlined success-icon">task_alt</span>
                            </div>
                            <h4>Không có doanh nghiệp nào chờ duyệt</h4>
                            <p>Tất cả đã được xử lý ✨</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
