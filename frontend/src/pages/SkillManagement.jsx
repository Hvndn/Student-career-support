import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import './AdminDashboard.css';

const SkillManagement = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
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
        if (!newSkill.trim()) return;
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

    const handleUpdate = async (id) => {
        if (!editingName.trim()) return;
        try {
            await adminApi.updateSkill(id, editingName);
            setEditingId(null);
            setEditingName('');
            loadSkills();
        } catch (err) {
            alert('Cập nhật thất bại!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải dữ liệu...</div>;

    return (
        <div className="admin-layout">
            {/* SIDEBAR GIỮ NGUYÊN */}
            <aside className="admin-sidebar" style={{ background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
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
                </nav>

                <div className="sidebar-bottom" style={{ padding: '0 1.5rem 1.5rem', marginTop: '1rem' }}>
                    <button onClick={handleLogout} className="nav-item danger" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit', color: '#dc2626' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main">
                {/* HEADER TRÊN CÙNG GIỮ NGUYÊN */}
                <header className="admin-header" style={{ background: '#fff', borderBottom: '1px solid #eef0f4' }}>
                    <div className="header-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Tìm kiếm ngành nghề..." style={{ fontSize: '0.9rem' }}/>
                    </div>
                    <div className="header-actions">
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
                    
                    {/* TIÊU ĐỀ TRANG */}
                    <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', margin: 0 }}>Quản lý ngành nghề</h1>
                            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0.5rem 0 0', maxWidth: '600px' }}>
                                Kiểm soát và quản trị danh sách ngành nghề toàn diện.
                            </p>
                        </div>
                    </div>

                    {/* FORM THÊM MỚI (Giữ nguyên logic của bạn nhưng gọn gàng hơn) */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '1.5rem', marginBottom: '2rem' }}>
                        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem' }}>
                            <input 
                                type="text" 
                                placeholder="Nhập tên ngành nghề mới (ví dụ: Công nghệ thông tin...)" 
                                style={{ flex: 1, padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                            />
                            <button type="submit" style={{ background: '#1d4ed8', color: '#fff', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                + Thêm mới
                            </button>
                        </form>
                    </div>

                    {/* DANH SÁCH NGÀNH NGHỀ - CLONE 100% STYLE TỪ ẢNH QUẢN LÝ NGƯỜI DÙNG */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden', marginBottom: '2rem' }}>
                        
                        {/* Tiêu đề bảng */}
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Danh sách ngành nghề</h3>
                        </div>

                        {/* Header của bảng */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '1rem 2rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <div>NGÀNH NGHỀ</div>
                            <div style={{ textAlign: 'center' }}>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {/* Nội dung bảng */}
                        <div>
                            {skills.map((skill, index) => (
                                <div key={skill.id} style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '2fr 1fr 1fr', 
                                    padding: '1.25rem 2rem', 
                                    borderBottom: index === skills.length - 1 ? 'none' : '1px solid #f1f5f9', 
                                    alignItems: 'center',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    
                                    {/* CỘT 1: Tên Ngành nghề & ID */}
                                    <div>
                                        {editingId === skill.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <input 
                                                    value={editingName} 
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    autoFocus
                                                    style={{ padding: '0.4rem 0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', width: '80%' }}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{skill.name}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.2rem' }}>ID: #{skill.id}</div>
                                            </>
                                        )}
                                    </div>

                                    {/* CỘT 2: Trạng thái (Badge giống hệt ảnh) */}
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '0.35rem', 
                                            background: '#dcfce7', 
                                            color: '#166534', 
                                            padding: '0.3rem 0.8rem', 
                                            borderRadius: '9999px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 700 
                                        }}>
                                            <span style={{ width: '6px', height: '6px', background: '#16a34a', borderRadius: '50%' }}></span>
                                            Hoạt động
                                        </span>
                                    </div>

                                    {/* CỘT 3: Thao tác (Nút viền giống ảnh) */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        {editingId === skill.id ? (
                                            <>
                                                <button onClick={() => handleUpdate(skill.id)} style={{ border: '1px solid #22c55e', color: '#16a34a', background: 'transparent', padding: '0.35rem 1rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Lưu</button>
                                                <button onClick={() => setEditingId(null)} style={{ border: '1px solid #94a3b8', color: '#64748b', background: 'transparent', padding: '0.35rem 1rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Hủy</button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => { setEditingId(skill.id); setEditingName(skill.name); }} 
                                                    style={{ border: '1px solid #cbd5e1', color: '#1d4ed8', background: 'transparent', padding: '0.35rem 1.2rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                                                >
                                                    Sửa
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(skill.id)} 
                                                    style={{ border: '1px solid #fca5a5', color: '#ef4444', background: 'transparent', padding: '0.35rem 1.2rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>

                        {skills.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                Chưa có ngành nghề nào trong hệ thống.
                            </div>
                        )}
                    </div>

                    {/* THỐNG KÊ PHÍA DƯỚI */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1d4ed8' }}>
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <div>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Tổng ngành nghề</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{skills.length}</div>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#16a34a' }}>
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Đang hoạt động</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{skills.length}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SkillManagement;