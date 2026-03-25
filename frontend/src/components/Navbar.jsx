import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Giả định login đơn giản bằng localStorage cho demo nhanh
    const user = JSON.parse(localStorage.getItem('user'));

    if (location.pathname === '/register' || location.pathname.startsWith('/admin')) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const linkStyle = { color: 'rgba(255, 255, 255, 0.9)' };

    return (
        <nav className="glass fade-in navbar-fixed" style={{
            padding: '1rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.75)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: 'none',
            borderRadius: 0
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src="/logo.png"
                    alt="JobPortal Logo"
                    style={{ height: '62px', objectFit: 'contain' }}
                />
            </Link>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', fontWeight: '500' }}>
                <Link to="/" style={linkStyle} className="nav-link navbar-link">Việc làm</Link>
                {user ? (
                    <>
                        {user.role === 'ROLE_STUDENT' && (
                            <>
                                <Link to="/student/notifications" style={linkStyle} className="nav-link navbar-link">Thông báo</Link>
                                <Link to="/student/applications" style={linkStyle} className="nav-link navbar-link">Đơn tuyển</Link>
                                <Link to="/student/profile" style={linkStyle} className="nav-link navbar-link">Hồ sơ</Link>
                            </>
                        )}
                        {user.role === 'ROLE_COMPANY' && (
                            <>
                                <Link to="/company/dashboard" style={linkStyle} className="nav-link navbar-link">Trang chủ</Link>
                                <Link to="/company/jobs/post" style={linkStyle} className="nav-link navbar-link">Đăng tin</Link>
                                <Link to="/company/candidates/search" style={linkStyle} className="nav-link navbar-link">Tìm ứng viên</Link>
                            </>
                        )}
                        {user.role === 'ROLE_ADMIN' && (
                            <>
                                <Link to="/admin/dashboard" style={linkStyle} className="nav-link navbar-link">Admin</Link>
                                <Link to="/admin/skills" style={linkStyle} className="nav-link navbar-link">Kỹ năng</Link>
                                <Link to="/admin/users" style={linkStyle} className="nav-link navbar-link">Thành viên</Link>
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
