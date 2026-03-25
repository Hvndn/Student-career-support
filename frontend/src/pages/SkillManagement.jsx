import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import './AdminDashboard.css';

const SkillManagement = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.paddingTop = '0';
        loadSkills();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const loadSkills = async () => {
        try {
            const res = await adminApi.getSkills();
            setSkills(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSkill) return;
        try {
            await adminApi.addSkill(newSkill);
            setNewSkill('');
            loadSkills();
        } catch (err) {
            alert('Thêm kỹ năng thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa kỹ năng này?')) return;
        try {
            await adminApi.deleteSkill(id);
            loadSkills();
        } catch (err) {
            alert('Xóa thất bại!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải dữ liệu...</div>;

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
                    <div className="nav-item active" style={{ background: '#eef2ff', color: '#0d5cda' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        Quản lý ngành nghề
                    </div>
                    <Link to="/admin/reports" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        Báo cáo
                    </Link>
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
                {/* HEADER */}
                <header className="admin-header" style={{ background: '#fff', borderBottom: '1px solid #eef0f4' }}>
                    <div className="header-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Tìm kiếm ngành nghề..." style={{ fontSize: '0.9rem' }}/>
                    </div>
                    
                    <div className="header-actions">
                        <div className="action-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </div>
                        <div className="action-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">Admin ScholarBridge</span>
                                <span className="user-role">Quản trị viên hệ thống</span>
                            </div>
                            <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" className="user-avatar" />
                        </div>
                    </div>
                </header>

                <div className="admin-content" style={{ padding: '2.5rem', background: '#f8f9fc', overflowY: 'auto' }}>
                    
                    <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>Quản lý Ngành nghề</h1>
                        <p style={{ color: '#4b5563', fontSize: '1rem', margin: '0.5rem 0 0', maxWidth: '600px', lineHeight: 1.5 }}>
                            Thêm mới hoặc loại bỏ các ngành nghề, kỹ năng trong hệ thống để người dùng lựa chọn thuận tiện.
                        </p>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '2rem', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: '0 0 1.5rem 0' }}>Thêm ngành nghề mới</h3>
                        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Nhập tên ngành nghề (ví dụ: Công nghệ thông tin, Thiết kế...)" 
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', fontSize: '1rem', outline: 'none' }}
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                />
                            </div>
                            <button type="submit" style={{ background: '#0d5cda', color: '#fff', border: 'none', padding: '0 2rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(13,92,218,0.2)' }}>
                                Lưu thay đổi
                            </button>
                        </form>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: 0 }}>Danh sách ngành nghề hiện có</h3>
                            <span style={{ background: '#e0ebff', color: '#0d5cda', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>Tổng cộng: {skills.length}</span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                            {skills.map(skill => (
                                <div key={skill.id} style={{ 
                                    padding: '1.2rem', 
                                    borderRadius: '10px', 
                                    background: '#f8f9fa',
                                    border: '1px solid #eef0f4',
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease',
                                    cursor: 'default'
                                }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.background = '#eef2ff'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = '#eef0f4'; e.currentTarget.style.background = '#f8f9fa'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ color: '#0d5cda' }}>
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem' }}>{skill.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(skill.id)} 
                                        style={{ 
                                            background: 'transparent', 
                                            color: '#ef4444', 
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            padding: '0.4rem',
                                            borderRadius: '6px'
                                        }}
                                        title="Xóa ngành nghề"
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        {skills.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontStyle: 'italic', background: '#f9fafb', borderRadius: '10px', border: '1px dashed #e5e7eb' }}>
                                Chưa có chuyên mục ngành nghề nào trong hệ thống.
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SkillManagement;
