import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authApi.login({ email, password });

            if (res.data.status === 'success') {
                const user = res.data.data;
                localStorage.setItem('user', JSON.stringify(user));
                const role = user.role;
                if (role === 'ROLE_COMPANY') {
                    navigate('/company/dashboard');
                } else if (role === 'ROLE_STUDENT') {
                    navigate('/');
                } else if (role === 'ROLE_ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Sai email hoặc mật khẩu!');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafd',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Mini Navbar */}
            <nav style={{
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
                padding: '0 2rem',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Link to="/" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>
                    Nexus Talent
                </Link>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                    Chưa có tài khoản?{' '}
                    <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Đăng ký miễn phí</Link>
                </p>
            </nav>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem',
            }}>
                <div style={{
                    background: '#fff',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '20px',
                    padding: '3rem 2.5rem',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '52px', height: '52px',
                            background: '#eff6ff',
                            borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem',
                            margin: '0 auto 1rem',
                        }}>🔑</div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', margin: '0 0 0.4rem' }}>
                            Chào mừng trở lại
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>
                            Đăng nhập để tiếp tục hành trình của bạn.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{
                                display: 'block', marginBottom: '0.5rem',
                                color: '#374151', fontSize: '0.9rem', fontWeight: 600,
                            }}>Email của bạn</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    border: '1.5px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '0.95rem',
                                    color: '#111827',
                                    outline: 'none',
                                    background: '#fff',
                                    boxSizing: 'border-box',
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                        <div style={{ marginBottom: '1.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>Mật khẩu</label>
                                <a href="#" style={{ color: '#2563eb', fontSize: '0.85rem' }}>Quên mật khẩu?</a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    border: '1.5px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '0.95rem',
                                    color: '#111827',
                                    outline: 'none',
                                    background: '#fff',
                                    boxSizing: 'border-box',
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <button type="submit" style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'background 0.2s',
                        }}
                            onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                            onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
                        >
                            Đăng nhập
                        </button>

                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            margin: '1.5rem 0',
                        }}>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>hoặc</span>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                            Chưa có tài khoản?{' '}
                            <Link to="/register" style={{ color: '#2563eb', fontWeight: 700 }}>Đăng ký miễn phí</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
