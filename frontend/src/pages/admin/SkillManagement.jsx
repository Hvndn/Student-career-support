import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import './AdminDashboard.css';

const SkillManagement = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingCategory, setEditingCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
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
            setSkills(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        if (e) e.preventDefault();
        if (!newSkill.trim()) return;
        try {
            await adminApi.addSkill(newSkill, newCategory || 'General');
            setNewSkill('');
            setNewCategory('');
            setShowAddModal(false);
            loadSkills();
        } catch (err) {
            alert('Thêm ngành nghề thất bại!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa ngành nghề này?')) return;
        try {
            await adminApi.deleteSkill(id);
            loadSkills();
        } catch (err) {
            alert('Xóa thất bại!');
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        if (!editingName.trim()) return;
        try {
            await adminApi.updateSkill(editingId, editingName, editingCategory || 'General');
            setEditingId(null);
            setEditingName('');
            setEditingCategory('');
            loadSkills();
        } catch (err) {
            alert('Cập nhật thất bại!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getIndustryIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('công nghệ') || lowerName.includes('it') || lowerName.includes('phần mềm')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                </div>
            );
        }
        if (lowerName.includes('tài chính') || lowerName.includes('ngân hàng') || lowerName.includes('kinh doanh')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"></path><path d="M3 10h18"></path><path d="M5 6l7-3 7 3"></path><path d="M4 10v11"></path><path d="M20 10v11"></path><path d="M8 14v3"></path><path d="M12 14v3"></path><path d="M16 14v3"></path></svg>
                </div>
            );
        }
        if (lowerName.includes('y tế') || lowerName.includes('dược') || lowerName.includes('bác sĩ')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
            );
        }
        if (lowerName.includes('thiết kế') || lowerName.includes('đồ họa') || lowerName.includes('art')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.5 1.5"></path><path d="M7 11l5-5"></path></svg>
                </div>
            );
        }
        return (
            <div className="industry-icon-wrapper" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
        );
    };

    const filteredSkills = skills.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="loading-spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Đang tải dữ liệu...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar" style={{ backgroundColor: '#fff', borderRight: '1px solid #f1f5f9' }}>
                <div className="sidebar-brand-new">
                    <div className="brand-icon-box">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                    </div>
                    <div>
                        <div className="brand-title-new">ScholarBridge</div>
                        <div className="brand-subtitle-new">BẢNG ĐIỀU KHIỂN QUẢN TRỊ</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin/dashboard" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Bảng điều khiển
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Quản lý người dùng
                    </Link>
                    <Link to="/admin/companies" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                        Xác minh công ty
                    </Link>
                    <Link to="/admin/jobs" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Kiểm duyệt việc làm
                    </Link>
                    <Link to="/admin/skills" className="nav-item active">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        Quản lý ngành nghề
                    </Link>
                    <Link to="/admin/reports" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        Báo cáo
                    </Link>
                </nav>

                <div className="sidebar-system-status">
                    <div className="status-indicator-dot"></div>
                    <div className="status-text">
                        Trạng thái hệ thống:<br />
                        <span style={{ fontWeight: 800 }}>Khỏe mạnh</span>
                    </div>
                </div>

                <div className="sidebar-bottom">
                    <div className="nav-item" style={{ marginTop: 'auto', color: '#64748b' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Trung tâm trợ giúp
                    </div>
                    <button onClick={handleLogout} className="nav-item danger" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#ef4444', fontWeight: 700 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-search" style={{ border: '1px solid #eef0f4', background: '#f8fafc' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm ngành nghề, mã ngành..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                                <span className="user-name">Admin SB</span>
                                <span className="user-role">Quản trị viên</span>
                            </div>
                            <img src={`https://ui-avatars.com/api/?name=Admin&background=0d5cda&color=fff`} alt="Avatar" className="user-avatar" />
                        </div>
                    </div>
                </header>

                <div className="admin-content" style={{ padding: '2.5rem', background: '#f8fafc' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>Quản lý Ngành nghề</h1>
                            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                                Hệ thống phân loại và cập nhật xu hướng nghề nghiệp ScholarBridge.
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            style={{ background: '#0d5cda', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 12px rgba(13, 92, 218, 0.25)' }}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Thêm ngành nghề mới
                        </button>
                    </div>

                    <div className="industry-stats-row">
                        <div className="industry-stat-card">
                            <div className="industry-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="11" y2="17"></line></svg>
                            </div>
                            <div className="industry-stat-info">
                                <div className="label">Tổng số ngành nghề</div>
                                <div className="value">{skills.length}</div>
                            </div>
                        </div>
                        <div className="industry-stat-card">
                            <div className="industry-stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><polyline points="17 6 23 6 23 12"></polyline></svg>
                            </div>
                            <div className="industry-stat-info">
                                <div className="label">Ngành hot nhất</div>
                                <div className="value">Công nghệ thông tin</div>
                            </div>
                        </div>
                        <div className="industry-stat-card">
                            <div className="industry-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div className="industry-stat-info">
                                <div className="label">Việc làm mới nhất</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span className="value">120</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>+12%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="industry-table-card">
                        <div className="industry-table-header">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Danh sách ngành nghề</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                    Bộ lọc
                                </button>
                                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Xuất báo cáo
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.8fr', padding: '1rem 2rem', background: '#fafbfc', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <div>Tên ngành nghề</div>
                            <div>Số lượng việc làm</div>
                            <div>Trạng thái</div>
                            <div>Ngày cập nhật</div>
                            <div style={{ textAlign: 'right' }}>Thao tác</div>
                        </div>

                        <div style={{ minHeight: '300px' }}>
                            {filteredSkills.length > 0 ? filteredSkills.map((skill) => (
                                <div key={skill.id} className="industry-row">
                                    <div className="industry-info-cell">
                                        {getIndustryIcon(skill.name)}
                                        <div>
                                            <div className="industry-name-text">{skill.name}</div>
                                            <div className="industry-code-text">Mã: {skill.category?.substring(0, 3).toUpperCase() || 'GEN'}-{String(skill.id).padStart(3, '0')}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>
                                        {Math.floor(Math.random() * 1000) + 100} tin
                                    </div>
                                    <div>
                                        <span className="badge-status badge-active">Đang hoạt động</span>
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        20/10/2023
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => { setEditingId(skill.id); setEditingName(skill.name); setEditingCategory(skill.category || ''); }}
                                            className="action-btn edit"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(skill.id)}
                                            className="action-btn delete"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                    <p>Không tìm thấy ngành nghề nào phù hợp.</p>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                Hiển thị 1-{filteredSkills.length} của {skills.length} ngành nghề
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>&lt;</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#0d5cda', color: '#fff', fontWeight: 700 }}>1</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>2</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#94a3b8' }}>...</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>5</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>&gt;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content-premium">
                        <h2 className="modal-title-premium">Thêm ngành nghề mới</h2>
                        <form onSubmit={handleAdd}>
                            <div className="form-group-premium">
                                <label className="form-label-premium">Tên ngành nghề</label>
                                <input 
                                    className="form-input-premium" 
                                    placeholder="Ví dụ: Công nghệ thông tin..."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group-premium">
                                <label className="form-label-premium">Lĩnh vực (Phân loại)</label>
                                <input 
                                    className="form-input-premium" 
                                    placeholder="Ví dụ: Kỹ thuật, Kinh doanh.."
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions-premium">
                                <button type="button" className="btn-premium-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
                                <button type="submit" className="btn-premium-submit">Thêm ngay</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingId && (
                <div className="modal-overlay">
                    <div className="modal-content-premium">
                        <h2 className="modal-title-premium">Chỉnh sửa ngành nghề</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group-premium">
                                <label className="form-label-premium">Tên ngành nghề</label>
                                <input 
                                    className="form-input-premium" 
                                    placeholder="Ví dụ: Công nghệ thông tin..."
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group-premium">
                                <label className="form-label-premium">Lĩnh vực (Phân loại)</label>
                                <input 
                                    className="form-input-premium" 
                                    placeholder="Ví dụ: Kỹ thuật, Kinh doanh.."
                                    value={editingCategory}
                                    onChange={(e) => setEditingCategory(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions-premium">
                                <button type="button" className="btn-premium-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                                <button type="submit" className="btn-premium-submit">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillManagement;