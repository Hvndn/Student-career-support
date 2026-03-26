import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import './Auth.css';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
    
    useEffect(() => {
        document.body.style.paddingTop = '0';
        
        // Clear message from location state after initial load
        if (location.state?.message) {
            window.history.replaceState({}, document.title);
        }

        return () => {
            document.body.style.paddingTop = '';
        };
    }, [location]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authApi.login({ email, password });
            if (res.data.status === 'success') {
                const userData = res.data.data;
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect based on role
                const userRole = userData.role ? userData.role.toUpperCase() : '';
                const loginSuccessMsg = { state: { message: 'Đăng nhập thành công! Chào mừng bạn quay trở lại.' } };

                if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
                    navigate('/admin/dashboard', loginSuccessMsg);
                } else if (userRole === 'COMPANY' || userRole === 'ROLE_COMPANY') {
                    navigate('/company/dashboard', loginSuccessMsg);
                } else if (userRole === 'STUDENT' || userRole === 'ROLE_STUDENT') {
                    navigate('/', loginSuccessMsg);
                } else {
                    navigate('/', loginSuccessMsg);
                }
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Sai email hoặc mật khẩu!');
        }
    };

    return (
        <div className="auth-container">
            {/* Left Panel */}
            <div className="auth-left">
                <h1 className="brand-title">Five core</h1>
                <p className="brand-desc">
                    Nơi tri thức gặp gỡ cơ hội. Khởi đầu hành trình nghề nghiệp của bạn cùng mạng lưới chuyên gia hàng đầu.
                </p>

                <div className="feature-list">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                        </div>
                        <div className="feature-text">
                            <h4>Dành cho Sinh viên</h4>
                            <p>Tiếp cận thực tập và việc làm từ các tập đoàn lớn.</p>
                        </div>
                    </div>
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                            </svg>
                        </div>
                        <div className="feature-text">
                            <h4>Dành cho Doanh nghiệp</h4>
                            <p>Tìm kiếm và nuôi dưỡng nhân tài ngay từ khi còn trên ghế nhà trường.</p>
                        </div>
                    </div>
                </div>

                <div className="copyright">
                    &copy; 2024 ScholarBridge. Nền tảng kết nối tri thức và sự nghiệp.
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="form-header">
                        <h2>Chào mừng Trở lại</h2>
                        <p>Đăng nhập để tiếp tục hành trình của bạn.</p>
                    </div>
                    
                    {successMessage && (
                        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>EMAIL CỦA BẠN</label>
                            <input 
                                type="email" 
                                className="form-input" 
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ marginBottom: 0 }}>MẬT KHẨU</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#0d5cda', fontWeight: '600' }}>Quên mật khẩu?</Link>
                            </div>
                            <input 
                                type="password" 
                                className="form-input" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit">
                            Đăng nhập ngay
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>

                        <div className="auth-prompt">
                            Chưa có tài khoản? <Link to="/register" className="auth-link">Đăng ký miễn phí</Link>
                        </div>

                        <div className="divider">HOẶC ĐĂNG NHẬP BẰNG</div>

                        <div className="social-login">
                            <button type="button" className="social-btn" aria-label="Đăng nhập bằng Google">
                                <svg viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </button>
                            <button type="button" className="social-btn" aria-label="Đăng nhập bằng Facebook">
                                <svg viewBox="0 0 24 24">
                                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
