import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../api';
import './AdminDashboard.css';

const CompanyVerification = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Mock data based on the screenshot
    const mockCompanies = [
        { id: 1, name: 'FPT Software', location: 'Hà Nội, Việt Nam', industry: 'Công nghệ thông tin', taxId: '0102110996', date: '15/10/2023', status: 'Chờ phê duyệt', logo: 'FPT' },
        { id: 2, name: 'VinFast Trading', location: 'Hải Phòng, Việt Nam', industry: 'Sản xuất ô tô', taxId: '0108253130', date: '14/10/2023', status: 'Chờ phê duyệt', logo: 'V' },
        { id: 3, name: 'VNG Corporation', location: 'TP. Hồ Chí Minh', industry: 'Giải trí & Công nghệ', taxId: '0303491410', date: '12/10/2023', status: 'Chờ phê duyệt', logo: 'VNG' },
        { id: 4, name: 'Shopee Vietnam', location: 'TP. Hồ Chí Minh', industry: 'Thương mại điện tử', taxId: '0313865225', date: '11/10/2023', status: 'Chờ phê duyệt', logo: 'S' }
    ];

    useEffect(() => {
        document.body.style.paddingTop = '0';
        // Simulate API fetch delay
        setTimeout(() => {
            setCompanies(mockCompanies);
            setLoading(false);
        }, 500);

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
            <aside className="admin-sidebar" style={{ background: '#f8f9fa' }}>
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

                <nav className="sidebar-nav">
                    <Link to="/admin/dashboard" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Bảng điều khiển
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Quản lý người dùng
                    </Link>
                    <Link to="/admin/companies" className="nav-item active">
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
                    <Link to="/admin/reports" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        Báo cáo
                    </Link>
                </nav>

                <div className="sidebar-bottom">
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
                        <input type="text" placeholder="Tìm kiếm doanh nghiệp..." style={{ fontSize: '0.9rem' }}/>
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
                            <img src="https://i.pravatar.cc/100?img=9" alt="Avatar" className="user-avatar" />
                        </div>
                    </div>
                </header>

                <div className="admin-content" style={{ padding: '2rem', background: '#f8f9fc' }}>
                    
                    <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', margin: 0 }}>Xác minh doanh nghiệp</h1>
                        <p style={{ color: '#4b5563', fontSize: '1rem', margin: '0.3rem 0 0' }}>Phê duyệt hồ sơ pháp lý và thông tin doanh nghiệp mới</p>
                    </div>

                    {/* TOP CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                            <div style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Chờ phê duyệt</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#c2410c', lineHeight: 1, marginBottom: '1rem' }}>24</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px', gap: '0.3rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                12% hôm nay
                            </div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                            <div style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Đã xác minh (Tháng này)</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0d5cda', lineHeight: 1, marginBottom: '1rem' }}>156</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px', gap: '0.3rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"></path></svg>
                                42 mới
                            </div>
                        </div>
                    </div>

                    {/* MAIN TABLE CONTAINER */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                        {/* Filters Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                    Ngành nghề
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    Ngày đăng ký
                                </button>

                                <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <span style={{ color: '#0d5cda', background: '#e0ebff', padding: '0.3rem 0.8rem', borderRadius: '12px', cursor: 'pointer' }}>Tất cả</span>
                                    <span style={{ color: '#6b7280', cursor: 'pointer', padding: '0.3rem 0' }}>Chưa xem</span>
                                    <span style={{ color: '#6b7280', cursor: 'pointer', padding: '0.3rem 0' }}>Khẩn cấp</span>
                                </div>
                            </div>
                            
                            <div style={{ color: '#4b5563', fontSize: '0.85rem' }}>
                                Hiển thị <span style={{ fontWeight: 600, color: '#111827' }}>1-10</span> trong số <span style={{ fontWeight: 600, color: '#111827' }}>24</span> yêu cầu
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Doanh nghiệp</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Ngành nghề</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Mã số thuế</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Ngày đăng ký</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Trạng thái</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4', textAlign: 'right' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map(company => (
                                        <tr key={company.id} style={{ borderBottom: '1px solid #eef0f4', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f9fafb'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#374151', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                                                        {company.logo}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{company.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{company.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', color: '#4b5563', fontSize: '0.9rem', width: '15%' }}>{company.industry}</td>
                                            <td style={{ padding: '1.2rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{company.taxId}</td>
                                            <td style={{ padding: '1.2rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>{company.date}</td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <span style={{ 
                                                    padding: '0.4rem 1rem', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    background: '#ffedd5',
                                                    color: '#c2410c',
                                                    display: 'inline-block'
                                                }}>
                                                    ● {company.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <span style={{ color: '#0d5cda', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Xem chi tiết</span>
                                                    <button style={{ 
                                                        background: '#0d5cda', 
                                                        color: '#fff', 
                                                        border: 'none', 
                                                        padding: '0.5rem 1.2rem', 
                                                        borderRadius: '6px', 
                                                        fontWeight: 600, 
                                                        fontSize: '0.85rem', 
                                                        cursor: 'pointer' 
                                                    }}>Phê duyệt</button>
                                                    <span style={{ color: '#dc2626', cursor: 'pointer' }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Area inside Table container */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderTop: '1px solid #eef0f4' }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                Trước
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d5cda', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>1</button>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>2</button>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>3</button>
                                <span style={{ color: '#6b7280', margin: '0 0.2rem' }}>...</span>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>8</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#4b5563', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                Tiếp
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM INFO CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                        <div style={{ background: '#f0f5ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e0ebff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                <div style={{ background: '#0d5cda', width: '24px', height: '24px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>i</div>
                                <h4 style={{ color: '#0d5cda', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Quy trình xác minh</h4>
                            </div>
                            <p style={{ color: '#3b82f6', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                                Đảm bảo kiểm tra kỹ các tài liệu pháp lý như Giấy phép kinh doanh, MST và đại diện pháp luật trước khi phê duyệt. Thời gian xử lý tiêu chuẩn là 24-48 giờ.
                            </p>
                        </div>

                        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eef0f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ maxWidth: '65%' }}>
                                <h4 style={{ color: '#111827', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Cần hỗ trợ kỹ thuật?</h4>
                                <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                                    Gặp sự cố khi xem tài liệu hoặc dữ liệu doanh nghiệp không hiển thị đúng.
                                </p>
                            </div>
                            <button style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.8rem 1.2rem', color: '#111827', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                Liên hệ IT Support
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CompanyVerification;
