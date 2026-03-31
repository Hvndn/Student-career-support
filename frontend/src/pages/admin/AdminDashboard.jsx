import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

    useEffect(() => {
        if (location.state?.message) {
            window.history.replaceState({}, document.title);
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    useEffect(() => {
        document.body.style.paddingTop = '0';

        adminApi.getStats()
            .then(res => {
                setStats(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setStats({
                    totalStudents: 15482,
                    totalCompanies: 1240,
                    totalJobs: 3512,
                    totalApplications: 250,
                    totalUsers: 16722,
                    pendingCompanies: 18,
                    totalReports: 7,
                    recentJobs: []
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

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải dữ liệu hệ thống...</div>;

    const statCards = [
        { label: 'Việc làm', value: stats.totalJobs || 0, color: '#2563eb', icon: '💼' },
        { label: 'Sinh viên', value: stats.totalStudents || 0, color: '#7c3aed', icon: '🎓' },
        { label: 'Doanh nghiệp', value: stats.totalCompanies || 0, color: '#10b981', icon: '🏢' },
        { label: 'Báo cáo', value: stats.totalReports || 0, color: '#ef4444', icon: '🚩' }
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Tổng quan hệ thống" />
                <main className="admin-body">
                    {successMessage && (
                        <div style={{ marginBottom: '1.5rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                            {successMessage}
                        </div>
                    )}
                    
                    <h1 style={{ marginBottom: '2rem', color: '#1e293b' }}>Quản trị <span style={{ color: '#2563eb' }}>Hệ thống</span></h1>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {statCards.map((card, i) => (
                            <div key={i} className="card fade-in" style={{ 
                                textAlign: 'left', 
                                padding: '1.5rem', 
                                borderLeft: `4px solid ${card.color}`,
                                background: 'white',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                animationDelay: `${i * 0.1}s`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                    <span style={{ color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.75rem' }}>{card.label}</span>
                                    <div style={{ fontSize: '1.2rem' }}>{card.icon}</div>
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{card.value.toLocaleString()}</h2>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>↑ +12% tháng này</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        {/* CHART PANEL */}
                        <div className="card" style={{ background: 'white', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Phân tích tăng trưởng</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Tỉ lệ người dùng mới (30 ngày)</p>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>Tháng 3, 2024</span>
                            </div>
                            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '0.8rem', padding: '0 1rem' }}>
                                {[35, 45, 30, 52, 38, 55, 40, 60, 45, 65].map((val, idx) => (
                                    <div key={idx} style={{ 
                                        flex: 1, 
                                        height: `${val}%`, 
                                        background: idx === 9 ? '#2563eb' : '#e2e8f0', 
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'all 0.3s'
                                    }}></div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>
                                <span>NGÀY 01</span>
                                <span>NGÀY 15</span>
                                <span>HÔM NAY</span>
                            </div>
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="card" style={{ background: 'white', padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Hành động nhanh</h3>
                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                <Link to="/admin/companies/pending" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <div style={{ background: '#dcfce7', padding: '0.4rem', borderRadius: '8px' }}>🏢</div>
                                    Duyệt Doanh nghiệp ({stats.pendingCompanies || 0})
                                </Link>
                                <Link to="/admin/reports" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#fef2f2', color: '#dc2626', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <div style={{ background: '#fee2e2', padding: '0.4rem', borderRadius: '8px' }}>🚩</div>
                                    Xử lý Báo cáo ({stats.totalReports || 0})
                                </Link>
                                <Link to="/admin/skills" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: '#f8fafc', color: '#475569', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <div style={{ background: '#f1f5f9', padding: '0.4rem', borderRadius: '8px' }}>⚙️</div>
                                    Quản lý Kỹ năng
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* RECENT JOBS */}
                        <div className="card" style={{ background: 'white', padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Việc làm mới đăng</h3>
                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                {stats.recentJobs?.length > 0 ? (
                                    stats.recentJobs.slice(0, 4).map(job => (
                                        <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#f8fafc', borderRadius: '10px' }}>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{job.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{job.companyName}</div>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '700' }}>{new Date(job.postedAt).toLocaleDateString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>Không có dữ liệu việc làm gần đây</div>
                                )}
                            </div>
                        </div>

                        {/* SYSTEM LOGS */}
                        <div className="card" style={{ background: 'white', padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Hoạt động hệ thống</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', marginTop: '0.4rem' }}></div>
                                    <div>
                                        <span style={{ fontWeight: 700 }}>Google</span> vừa đăng tin tuyển dụng mới.
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>2 PHÚT TRƯỚC</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '0.4rem' }}></div>
                                    <div>
                                        Báo cáo mới từ <span style={{ fontWeight: 700 }}>User #8291</span>.
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>14 PHÚT TRƯỚC</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '0.4rem' }}></div>
                                    <div>
                                        <span style={{ fontWeight: 700 }}>NovaTech</span> đã xác minh thành công.
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>45 PHÚT TRƯỚC</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
ển quản trị v2.4.0</span>
                        <div className="admin-footer-links">
                            <a href="#">Giao thức quyền riêng tư</a>
                            <a href="#">Nhật ký kiểm tra</a>
                            <a href="#">Tuân thủ</a>
                        </div>
                    </footer>
                </div>
            </main>
>>>>>>> da7cfda3cbc0dcba44ed426c45c4320ec6cfaee3
        </div>
    );
};

export default AdminDashboard;
