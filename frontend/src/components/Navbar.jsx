import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // Giả định login đơn giản bằng localStorage cho demo nhanh
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

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
                <Link to="/" style={{ color: 'var(--text-muted)' }} className="nav-link">Việc làm</Link>
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
