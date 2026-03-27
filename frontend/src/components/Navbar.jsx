import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();



    const user = JSON.parse(localStorage.getItem('user'));
    const isHome = location.pathname === '/';
    
    const isStudentRoute = location.pathname.startsWith('/student/') || (isHome && user?.role === 'ROLE_STUDENT');
    const isJobRoute = location.pathname === '/jobs' || location.pathname.startsWith('/jobs/');

    if (location.pathname === '/employer' || 
        location.pathname === '/login' || 
        location.pathname.startsWith('/company/')) return null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    /* ── Light Navbar for Student Pages, Job Pages & Public Home ── */
    if (isHome || isStudentRoute || isJobRoute) {
        return (
            <nav style={{
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
                padding: '0 2rem',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                fontFamily: "'Inter', sans-serif",
            }}>
                <div style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '64px',
                }}>
                    <Link to="/" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', textDecoration: 'none' }}>
                        Nexus Talent
                    </Link>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <Link to="/" style={{ color: '#374151', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>Trang chủ</Link>
                        <Link to="/jobs" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>Việc làm</Link>
                        {user?.role === 'ROLE_STUDENT' ? (
                            <>
                                <Link to="/student/notifications" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>Thông báo</Link>
                                <Link to="/student/applications" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>Đơn tuyển</Link>
                                <Link to="/student/profile" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>Hồ sơ</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/employer" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>Doanh nghiệp</Link>
                                <a href="#" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>Blog</a>
                            </>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {user ? (
                            <>
                                <span style={{ fontWeight: '600', color: '#2563eb', fontSize: '0.9rem' }}>{user.fullName}</span>
                                <button 
                                    onClick={handleLogout} 
                                    style={{ 
                                        background: 'transparent', border: '1px solid #ef4444', color: '#ef4444',
                                        padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: 600,
                                        fontSize: '0.85rem', cursor: 'pointer'
                                    }}
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: '#374151', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>Đăng nhập</Link>
                                <Link to="/register" style={{
                                    background: '#2563eb', color: 'white',
                                    padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: 700,
                                    fontSize: '0.9rem', textDecoration: 'none'
                                }}>Đăng ký</Link>
                            </>
                        )}
                        {!user && (
                            <Link to="/employer" style={{
                                background: '#1e293b', color: 'white',
                                padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600,
                                fontSize: '0.85rem', textDecoration: 'none'
                            }}>🏢 Nhà tuyển dụng</Link>
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    /* ── Dark Glass Navbar for other pages ── */
    return (
        <nav className="glass fade-in" style={{
            position: 'sticky',
            top: '1.5rem',
            left: '1.5rem',
            right: '1.5rem',
            margin: '1.5rem auto',
            padding: '0.8rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            maxWidth: '1200px'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src="/logo.png"
                    alt="JobPortal Logo"
                    style={{ height: '62px', objectFit: 'contain' }}
                />
            </Link>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', fontWeight: '500' }}>
                <Link to="/" style={{ color: 'var(--text-muted)' }} className="nav-link">Trang chủ</Link>
                {user ? (
                    <>
                        {user.role === 'ROLE_STUDENT' && (
                            <>
                                <Link to="/student/notifications" style={{ color: 'var(--text-muted)' }}>Thông báo</Link>
                                <Link to="/student/applications" style={{ color: 'var(--text-muted)' }}>Đơn tuyển</Link>
                                <Link to="/student/profile" style={{ color: 'var(--text-muted)' }}>Hồ sơ</Link>
                            </>
                        )}
                        {user.role === 'ROLE_COMPANY' && (
                            <>
                                <Link to="/company/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
                                <Link to="/company/jobs/post" style={{ color: 'var(--text-muted)' }}>Đăng tin</Link>
                                <Link to="/company/candidates/search" style={{ color: 'var(--text-muted)' }}>Tìm ứng viên</Link>
                            </>
                        )}
                        {user.role === 'ROLE_ADMIN' && (
                            <>
                                <Link to="/admin/dashboard" style={{ color: 'var(--text-muted)' }}>Admin</Link>
                                <Link to="/admin/skills" style={{ color: 'var(--text-muted)' }}>Kỹ năng</Link>
                                <Link to="/admin/users" style={{ color: 'var(--text-muted)' }}>Thành viên</Link>
                            </>
                        )}
                        <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
                        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{user.fullName}</span>
                        <button onClick={handleLogout} className="btn glass" style={{ color: 'var(--error)', padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>Đăng xuất</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-muted)' }}>Đăng nhập</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}>Bắt đầu ngay</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
