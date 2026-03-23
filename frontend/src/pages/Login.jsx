import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';

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

            // lưu user
            localStorage.setItem('user', JSON.stringify(user));

            const role = user.role;

            // 🔥 redirect theo role
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
        <div className="fade-in" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '85vh',
            padding: '2rem'
        }}>
            <div className="card glass" style={{ 
                width: '100%', 
                maxWidth: '420px',
                padding: '3rem 2.5rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
            }}>
                <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        Chào mừng <span className="gradient-text">Trở lại</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Đăng nhập để tiếp tục hành trình của bạn.</p>
                </header>
                
                {error && (
                    <div className="fade-in" style={{ 
                        background: 'rgba(244, 63, 94, 0.1)', 
                        color: 'var(--error)', 
                        padding: '0.8rem', 
                        borderRadius: '10px',
                        marginBottom: '1.5rem', 
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(244, 63, 94, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Email của bạn</label>
                        <input 
                            type="email" 
                            className="glass" 
                            style={{ width: '100%', padding: '1rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Mật khẩu</label>
                        <input 
                            type="password" 
                            className="glass" 
                            style={{ width: '100%', padding: '1rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem' }}>
                        Đăng nhập ngay
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Đăng ký miễn phí</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};


export default Login;
