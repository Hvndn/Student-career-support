import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const isHome = location.pathname === '/';
    if (location.pathname === '/employer' || 
        isHome || 
        location.pathname === '/login' || 
        location.pathname.startsWith('/student/') || 
        location.pathname.startsWith('/company/') ||
        (isHome && user?.role === 'ROLE_STUDENT')) return null;

    return (
        <footer style={{
            background: '#050505',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '4rem 2rem 2.5rem',
            marginTop: 'auto'
        }}>
            <div className="container">
                {/* Top section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand */}
                    <div>
                        <img src="/logo.png" alt="JobPortal" style={{ height: '48px', marginBottom: '1.2rem', objectFit: 'contain' }} />
                        <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.8', maxWidth: '280px' }}>
                            Kết nối tài năng với cơ hội. Nền tảng tuyển dụng hiện đại dành cho thế hệ mới.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.8rem' }}>
                            {[
                                { icon: '𝕏', href: '#' },
                                { icon: 'in', href: '#' },
                                { icon: 'f', href: '#' },
                                { icon: '▶', href: '#' }
                            ].map((s, i) => (
                                <a key={i} href={s.href} style={{
                                    width: '38px', height: '38px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '10px',
                                    color: '#888',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    transition: 'all 0.2s ease'
                                }}
                                    onMouseOver={e => { e.currentTarget.style.background = '#585d47'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#585d47'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Ứng viên */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '1.5rem' }}>
                            Ứng viên
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            {[
                                { label: 'Tìm việc làm', to: '/jobs' },
                                { label: 'Hồ sơ của tôi', to: '/student/profile' },
                                { label: 'Đơn ứng tuyển', to: '/student/applications' },
                                { label: 'Việc đã lưu', to: '/student/saved' },
                            ].map((l, i) => (
                                <li key={i}>
                                    <Link to={l.to} style={{ color: '#666', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                        onMouseOver={e => e.target.style.color = '#fff'}
                                        onMouseOut={e => e.target.style.color = '#666'}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Doanh nghiệp */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '1.5rem' }}>
                            Doanh nghiệp
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            {[
                                { label: 'Dashboard', to: '/company/dashboard' },
                                { label: 'Đăng tin tuyển dụng', to: '/company/jobs/post' },
                                { label: 'Tìm ứng viên', to: '/company/candidates/search' },
                                { label: 'Hồ sơ công ty', to: '/company/profile' },
                            ].map((l, i) => (
                                <li key={i}>
                                    <Link to={l.to} style={{ color: '#666', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                        onMouseOver={e => e.target.style.color = '#fff'}
                                        onMouseOut={e => e.target.style.color = '#666'}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Công ty */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '1.5rem' }}>
                            Về chúng tôi
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            {[
                                { label: 'Giới thiệu', to: '#' },
                                { label: 'Blog', to: '#' },
                                { label: 'Tuyển dụng', to: '#' },
                                { label: 'Liên hệ', to: '#' },
                            ].map((l, i) => (
                                <li key={i}>
                                    <Link to={l.to} style={{ color: '#666', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                        onMouseOver={e => e.target.style.color = '#fff'}
                                        onMouseOut={e => e.target.style.color = '#666'}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '2rem' }} />

                {/* Bottom bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: '#444', fontSize: '0.85rem' }}>
                        © {year} JobPortal. Bảo lưu mọi quyền.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookies'].map((t, i) => (
                            <a key={i} href="#" style={{ color: '#444', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                onMouseOver={e => e.target.style.color = '#888'}
                                onMouseOut={e => e.target.style.color = '#444'}
                            >
                                {t}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
