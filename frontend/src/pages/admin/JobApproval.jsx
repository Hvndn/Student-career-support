import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import './AdminDashboard.css';

const JobApproval = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Mock data based on screenshot
    const mockJobs = [
        { id: 1, title: 'Senior UX/UI Designer', code: '#JOB-8821', company: 'TechFlow Solutions', date: '20/10/2023', salary: '25-40tr', status: 'Chờ duyệt', logo: 'TF' },
        { id: 2, title: 'Marketing Intern', code: '#JOB-8845', company: 'CreativePulse Agency', date: '21/10/2023', salary: 'Thỏa thuận', status: 'Chờ duyệt', logo: 'CP' },
        { id: 3, title: 'Backend Developer (Java)', code: '#JOB-8802', company: 'Fintech Pro', date: '19/10/2023', salary: '20-35tr', status: 'Chờ duyệt', logo: 'FP' }
    ];

    useEffect(() => {
        document.body.style.paddingTop = '0';
        setTimeout(() => {
            setJobs(mockJobs);
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
            <aside className="admin-sidebar" style={{ background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
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
                    <div className="nav-item active" style={{ background: '#eef2ff', color: '#0d5cda' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        Kiểm duyệt việc làm
                    </div>
                    <Link to="/admin/skills" className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        Quản lý ngành nghề
                    </Link>
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
                        <input type="text" placeholder="Tìm kiếm tin tuyển dụng..." style={{ fontSize: '0.9rem' }} />
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
                                <span className="user-name">Admin ScholarBridge</span>
                                <span className="user-role">Quản trị viên hệ thống</span>
                            </div>
                            <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" className="user-avatar" />
                        </div>
                    </div>
                </header>

                <div className="admin-content" style={{ padding: '2.5rem', background: '#f8f9fc', overflowY: 'auto' }}>

                    <div className="page-header" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>Kiểm duyệt việc làm</h1>
                        <p style={{ color: '#4b5563', fontSize: '1rem', margin: '0.5rem 0 0', maxWidth: '600px', lineHeight: 1.5 }}>
                            Xem xét và phê duyệt các tin đăng tuyển dụng mới từ doanh nghiệp để đảm bảo chất lượng nội dung.
                        </p>
                    </div>

                    {/* TOP CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {/* Card 1 */}
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', borderLeft: '6px solid #0d5cda' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#e0ebff', color: '#0d5cda', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><circle cx="12" cy="16" r="2"></circle></svg>
                                </div>
                                <span style={{ color: '#0d5cda', background: '#e0ebff', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cần xử lý</span>
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>Tổng tin chờ duyệt</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>45</div>
                        </div>

                        {/* Card 2 */}
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', borderLeft: '6px solid #10b981' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#d1fae5', color: '#10b981', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <span style={{ color: '#059669', background: '#d1fae5', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>T.công</span>
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>Đã duyệt hôm nay</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>120</div>
                        </div>

                        {/* Card 3 */}
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', borderLeft: '6px solid #dc2626' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#fee2e2', color: '#dc2626', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                                </div>
                                <span style={{ color: '#dc2626', background: '#fee2e2', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Từ chối</span>
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>Tin bị từ chối</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>8</div>
                        </div>
                    </div>

                    {/* MAIN TABLE CONTAINER */}
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '0.5rem 0' }}>
                        {/* Filters Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: 0 }}>Danh sách tin tuyển dụng mới</h3>
                            <div style={{ display: 'flex', gap: '1rem', color: '#6b7280' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" cursor="pointer"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" cursor="pointer"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '1.2rem 2rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Tên công việc</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Công ty</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Ngày đăng</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Mức lương</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Trạng thái</th>
                                        <th style={{ padding: '1.2rem 2rem', fontWeight: 600, borderBottom: '1px solid #eef0f4', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id} style={{ borderBottom: '1px solid #eef0f4', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f9fafb'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '1.5rem 2rem' }}>
                                                <div style={{ fontWeight: 700, color: '#111827', fontSize: '1rem', marginBottom: '0.2rem' }}>{job.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Mã số: {job.code}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <div style={{ width: '32px', height: '32px', background: '#eef2ff', borderRadius: '6px', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {job.logo}
                                                    </div>
                                                    <div style={{ color: '#374151', fontSize: '0.95rem', fontWeight: 500 }}>{job.company}</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>{job.date}</td>
                                            <td style={{ padding: '1.5rem 1.5rem', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>{job.salary}</td>
                                            <td style={{ padding: '1.5rem 1.5rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 1.2rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    background: '#ffedd5',
                                                    color: '#d97706',
                                                }}>
                                                    ● {job.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', color: '#9ca3af' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                    </div>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                    </div>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Area */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderTop: '1px solid #eef0f4' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                Hiển thị 1-3 trong số 45 kết quả
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#d1d5db' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d5cda', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>1</button>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: 600, fontSize: '0.85rem' }}>2</button>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: 600, fontSize: '0.85rem' }}>3</button>
                                <span style={{ color: '#9ca3af', margin: '0 0.2rem' }}>...</span>
                                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: 600, fontSize: '0.85rem' }}>15</button>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM INFO BANNER */}
                    <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '2rem', border: '1px solid #e0ebff' }}>
                        <div style={{ color: '#0d5cda', marginTop: '0.2rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.58 2 4 5.58 4 10c0 2.9 1.54 5.43 3.9 6.84V19c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2.16c2.36-1.41 3.9-3.94 3.9-6.84 0-4.42-3.58-8-8-8zm-1 19c0 .55.45 1 1 1h.5a1.5 1.5 0 0 1-1.5-1v-1h2v1A1.5 1.5 0 0 1 11 21zm4.5-4h-7v-1h7v1zm-.72-2.31l-.28.16v1.15h-5v-1.15l-.28-.16a6.002 6.002 0 0 1-3.22-5.32c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.21-1.2 4.19-3.22 5.32z" /></svg>
                        </div>
                        <div>
                            <h4 style={{ color: '#1e3a8a', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Mẹo kiểm duyệt nhanh</h4>
                            <p style={{ color: '#3b82f6', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
                                Admin có thể nhấn phím tắt <span style={{ background: '#fff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#60a5fa' }}>V</span> để xem chi tiết hoặc <span style={{ background: '#fff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '0.1rem 0.4rem', color: '#60a5fa' }}>A</span> để phê duyệt nhanh khi đang chọn một dòng trong danh sách.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default JobApproval;
