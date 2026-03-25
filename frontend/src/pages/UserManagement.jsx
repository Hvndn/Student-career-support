import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import './AdminDashboard.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.paddingTop = '0';
        loadUsers();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const loadUsers = async () => {
        try {
            const res = await adminApi.getUsers();
            setUsers(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái user này?')) return;
        try {
            await adminApi.toggleUserStatus(userId);
            loadUsers(); // Reload to get updated status
        } catch (err) {
            alert('Cập nhật trạng thái người dùng thất bại!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải danh sách người dùng...</div>;

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
                    <Link to="/admin/dashboard" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Bảng điều khiển
                    </Link>
                    <Link to="/admin/users" className="nav-item active">
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
                <div className="admin-content" style={{ padding: '2rem' }}>
                    
                    <div className="page-header" style={{ marginBottom: '2rem' }}>
                        <div className="page-title">
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', margin: 0 }}>Quản lý người dùng</h1>
                            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginTop: '0.3rem' }}>Kiểm soát và quản trị danh sách tài khoản toàn diện.</p>
                        </div>
                        <div className="page-actions">
                            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#0d5cda', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Thêm mới
                            </button>
                        </div>
                    </div>

                    <div className="panel" style={{ padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', margin: 0 }}>Danh sách tài khoản</h3>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Người dùng</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Email</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Vai trò</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Trạng thái</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f9fafb'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>{user.fullName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>ID: #{user.id}</div>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{user.email}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{ 
                                                    fontSize: '0.75rem', 
                                                    color: '#0d5cda', 
                                                    fontWeight: 600,
                                                    background: '#e0ebff',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '6px'
                                                }}>{user.role}</span>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{ 
                                                    padding: '0.3rem 0.8rem', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: user.active ? '#ecfdf5' : '#fef2f2',
                                                    color: user.active ? '#059669' : '#dc2626',
                                                }}>
                                                    {user.active ? '● Hoạt động' : '○ Đã khóa'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => handleToggleStatus(user.id)} 
                                                    style={{ 
                                                        background: 'transparent',
                                                        border: `1px solid ${user.active ? '#fca5a5' : '#6ee7b7'}`,
                                                        fontSize: '0.8rem', 
                                                        padding: '0.4rem 1rem',
                                                        color: user.active ? '#dc2626' : '#059669',
                                                        borderRadius: '6px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={e => { e.currentTarget.style.background = user.active ? '#fef2f2' : '#ecfdf5'; }}
                                                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                                                >
                                                    {user.active ? 'Khóa' : 'Mở khóa'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: '0.95rem' }}>
                                                Không có dữ liệu người dùng.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* PAGINATION */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0 2rem' }}>
                        <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                            Hiển thị <span style={{ fontWeight: 600, color: '#111827' }}>1-4</span> trên <span style={{ fontWeight: 600, color: '#111827' }}>1.240</span> người dùng
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#6b7280' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d5cda', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>1</button>
                            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>2</button>
                            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>3</button>
                            <span style={{ color: '#6b7280', margin: '0 0.2rem' }}>...</span>
                            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>12</button>
                            <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#6b7280' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    </div>

                    {/* USER STATS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* Card 1 */}
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Tổng người dùng</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', lineHeight: 1 }}>12,408</div>
                            <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>+12% từ tháng trước</div>
                            <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', width: '48px', height: '48px', background: '#e0ebff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d5cda' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Xác minh doanh nghiệp</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', lineHeight: 1 }}>42</div>
                            <div style={{ color: '#d97706', fontSize: '0.85rem', fontWeight: 600 }}>18 đang chờ duyệt</div>
                            <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Nội dung bị báo cáo</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', lineHeight: 1 }}>07</div>
                            <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>Cần xử lý ngay</div>
                            <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', width: '48px', height: '48px', background: '#ffedd5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                            </div>
                        </div>
                    </div>
                    <footer className="admin-footer" style={{ marginTop: '2rem' }}>
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

export default UserManagement;
