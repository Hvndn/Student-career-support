import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import './AdminDashboard.css';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.paddingTop = '0';
        loadStats();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const loadStats = async () => {
        try {
            const res = await adminApi.getStats();
            setStats(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Lấy thống kê thất bại:', err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải báo cáo...</div>;

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar" style={{ background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                        </svg>
                    </div>
                    <div className="brand-text-container">
                        <span className="brand-title">ScholarBridge</span>
                        <span className="brand-subtitle" style={{ fontSize: '0.65rem' }}>Hệ thống Quản trị</span>
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1 }}>
                    <Link to="/admin/dashboard" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Bảng điều khiển
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Quản lý người dùng
                    </Link>
                    <Link to="/admin/companies" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                        Xác minh doanh nghiệp
                    </Link>
                    <Link to="/admin/jobs" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        Kiểm duyệt việc làm
                    </Link>
                    <Link to="/admin/skills" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        Quản lý ngành nghề
                    </Link>
                    <div className="nav-item active" style={{ background: '#eef2ff', color: '#0d5cda' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        Báo cáo
                    </div>
                </nav>

                <div className="sidebar-bottom" style={{ padding: '0 1.5rem 1.5rem', marginTop: '1rem' }}>
                    <Link to="/admin/settings" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Cài đặt hệ thống
                    </Link>
                    <button onClick={handleLogout} className="nav-item danger" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit', color: '#dc2626' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main">
                {/* Custom HEADER for Reports */}
                <header className="admin-header" style={{ background: '#fff', borderBottom: '1px solid #eef0f4', padding: '0 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', height: '100%' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d5cda', margin: 0, letterSpacing: '-0.02em' }}>Báo cáo & Thống kê</h2>
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: 600, height: '100%', alignItems: 'center' }}>
                            <span style={{ color: '#6b7280', cursor: 'pointer' }}>Tổng quan</span>
                            <span style={{ color: '#0d5cda', cursor: 'pointer', borderBottom: '3px solid #0d5cda', height: '100%', display: 'flex', alignItems: 'center', paddingTop: '3px' }}>Báo cáo</span>
                            <span style={{ color: '#6b7280', cursor: 'pointer' }}>Cài đặt</span>
                        </div>
                    </div>
                    
                    <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="action-icon" style={{ cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </div>
                        <div className="action-icon" style={{ cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div style={{ width: '1px', height: '28px', background: '#d1d5db', margin: '0 0.5rem' }}></div>
                        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                            <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Admin Scholar</span>
                        </div>
                    </div>
                </header>

                <div className="admin-content" style={{ padding: '2.5rem', background: '#f8f9fc', overflowY: 'auto' }}>
                    
                    {/* PAGE HEADER */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.03em' }}>Trung tâm Phân tích</h1>
                            <p style={{ color: '#6b7280', fontSize: '1rem', margin: '0.5rem 0 0' }}>Dữ liệu cập nhật mới nhất lúc 09:45, 24/05/2024</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '0.6rem 1.2rem', borderRadius: '8px', color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                                Xuất PDF
                            </button>
                            <button style={{ background: '#0d5cda', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(13,92,218,0.2)' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                                Xuất CSV
                            </button>
                        </div>
                    </div>

                    {/* TOP STAT CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {/* Card 1 */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#e0ebff', color: '#0d5cda', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <span style={{ color: '#059669', background: '#ecfdf5', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    12%
                                </span>
                            </div>
                            <div style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sinh viên đăng ký</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.totalStudents?.toLocaleString() || '24,582'}</div>
                        </div>

                        {/* Card 2 */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#eef2ff', color: '#4f46e5', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                                </div>
                                <span style={{ color: '#059669', background: '#ecfdf5', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    5.4%
                                </span>
                            </div>
                            <div style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Doanh nghiệp xác thực</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.totalCompanies?.toLocaleString() || '1,890'}</div>
                        </div>

                        {/* Card 3 */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#ffedd5', color: '#ea580c', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                </div>
                                <span style={{ color: '#dc2626', background: '#fee2e2', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                                    2.1%
                                </span>
                            </div>
                            <div style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tin tuyển dụng mới</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.totalJobs?.toLocaleString() || '3,421'}</div>
                        </div>

                        {/* Card 4 */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#d1fae5', color: '#10b981', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="23 11 17 17 14 14"></polyline></svg>
                                </div>
                                <span style={{ color: '#059669', background: '#ecfdf5', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    8.7%
                                </span>
                            </div>
                            <div style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Số lượng hồ sơ</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats?.totalApplications || '0'}</div>
                        </div>
                    </div>

                    {/* BAR CHART SECTION */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>Xu hướng đăng ký người dùng</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>Thống kê dữ liệu trong 30 ngày qua</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '0.3rem', borderRadius: '8px' }}>
                                <button style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#111827', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>30 ngày</button>
                                <button style={{ background: 'transparent', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>90 ngày</button>
                                <button style={{ background: 'transparent', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>1 năm</button>
                            </div>
                        </div>

                        {/* Bar chart mockup */}
                        <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem', position: 'relative' }}>
                            {/* Grid lines */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderBottom: '1px dashed #e5e7eb', height: '1px' }}></div>
                            <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, borderBottom: '1px dashed #e5e7eb', height: '1px' }}></div>
                            <div style={{ position: 'absolute', top: '160px', left: 0, right: 0, borderBottom: '1px dashed #e5e7eb', height: '1px' }}></div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderBottom: '1px solid #d1d5db', height: '1px' }}></div>
                            
                            {/* Bars */}
                            {[40, 50, 45, 75, 90, 100, 60, 50, 70, 80].map((height, index) => (
                                <div key={index} style={{ width: '40px', height: `${height}%`, background: index === 5 ? '#0d5cda' : '#dbeafe', borderRadius: '4px 4px 0 0', position: 'relative', zIndex: 1 }}>
                                    {index === 5 && (
                                        <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#111827', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>285</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', padding: '0 1rem', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>
                            <span>TUẦN 1</span>
                            <span>TUẦN 2</span>
                            <span>TUẦN 3</span>
                            <span>TUẦN 4</span>
                            <span>HIỆN TẠI</span>
                        </div>
                    </div>

                    {/* MIDDLE SECTION (PIE CHART & INTERACTION) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* Domain Distribution / Donut Chart */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 2rem 0' }}>Phân bổ ngành nghề</h3>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flex: 1 }}>
                                {/* Donut representation */}
                                <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '50%', background: 'conic-gradient(#0d5cda 0% 40%, #ea580c 40% 75%, #4b5563 75% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{Object.keys(stats?.skillDistribution || {}).length}+</span>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em' }}>NGÀNH NGHỀ</span>
                                    </div>
                                </div>
                                
                                {/* Legends */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, maxHeight: '200px', overflowY: 'auto' }}>
                                    {stats?.skillDistribution && Object.entries(stats.skillDistribution).map(([category, count], idx) => {
                                        const total = Object.values(stats.skillDistribution).reduce((a, b) => a + b, 0);
                                        const percentage = Math.round((count / total) * 100);
                                        const colors = ['#0d5cda', '#ea580c', '#4b5563', '#8b5cf6', '#ec4899'];
                                        return (
                                            <div key={category}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111827', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                                                    <span>{category}</span>
                                                    <span style={{ color: colors[idx % colors.length] }}>{percentage}%</span>
                                                </div>
                                                <div style={{ width: '100%', background: '#e5e7eb', height: '6px', borderRadius: '3px' }}>
                                                    <div style={{ width: `${percentage}%`, background: colors[idx % colors.length], height: '100%', borderRadius: '3px' }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!stats?.skillDistribution || Object.keys(stats.skillDistribution).length === 0) && (
                                        <div style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center' }}>Chưa có dữ liệu ngành nghề</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interaction Stats */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: 0 }}>Tương tác tuyển dụng</h3>
                                <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0d5cda', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', marginBottom: 'auto' }}>
                                <div style={{ background: '#eef2ff', color: '#0d5cda', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.5rem' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>TRUNG BÌNH ỨNG TUYỂN/TIN</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>24.5 hồ sơ</div>
                                </div>
                                <div style={{ color: '#059669', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifySelf: 'flex-end', gap: '0.2rem' }}>
                                    +15%
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0d5cda' }}></div>
                                    Tin tuyển dụng
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#bfdbfe' }}></div>
                                    Lượt ứng tuyển
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SECTION */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', paddingBottom: '2rem' }}>
                        {/* System Activities */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: 0 }}>Hoạt động hệ thống gần đây</h3>
                                <span style={{ color: '#0d5cda', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Xem tất cả</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ background: '#eef2ff', color: '#0d5cda', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', marginBottom: '0.3rem' }}>
                                            Công ty <span style={{ color: '#0d5cda' }}>FPT Software</span> đã được xác thực
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Bởi Admin Minh Quân • 12 phút trước</div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>THÀNH CÔNG</span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ background: '#fff7ed', color: '#ea580c', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', marginBottom: '0.3rem' }}>
                                            Nhập dữ liệu tin tuyển dụng hàng loạt hoàn tất
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Hệ thống tự động • 45 phút trước</div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d5cda', background: '#e0ebff', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>HỆ THỐNG</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                                    <div style={{ background: '#fef2f2', color: '#dc2626', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', marginBottom: '0.3rem' }}>
                                            Phát hiện 5 tài khoản sinh viên trùng lặp
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Quét bảo mật • 2 giờ trước</div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>CẢNH BÁO</span>
                                </div>
                            </div>
                        </div>

                        {/* Popular Categories */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 2rem 0' }}>Danh mục phổ biến nhất</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa', padding: '0.8rem 1.2rem', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: '#0d5cda', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>1</div>
                                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>Backend Developer</span>
                                    </div>
                                    <span style={{ color: '#0d5cda', fontSize: '0.85rem', fontWeight: 600 }}>842 tin</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa', padding: '0.8rem 1.2rem', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: '#e5e7eb', color: '#4b5563', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>2</div>
                                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>UI/UX Designer</span>
                                    </div>
                                    <span style={{ color: '#0d5cda', fontSize: '0.85rem', fontWeight: 600 }}>521 tin</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa', padding: '0.8rem 1.2rem', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: '#e5e7eb', color: '#4b5563', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>3</div>
                                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>Data Analyst</span>
                                    </div>
                                    <span style={{ color: '#0d5cda', fontSize: '0.85rem', fontWeight: 600 }}>489 tin</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fa', padding: '0.8rem 1.2rem', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: '#e5e7eb', color: '#4b5563', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>4</div>
                                        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>Content Marketing</span>
                                    </div>
                                    <span style={{ color: '#0d5cda', fontSize: '0.85rem', fontWeight: 600 }}>312 tin</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
