import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from '../../api';
import '../Auth.css';

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
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('student'); // Default role is student

    const handleGoogleLogin = () => {
        // Gọi tới endpoint backend để bắt đầu OAuth2 flow với vai trò đã chọn
        window.location.href = `http://localhost:8080/api/auth/google/login?role=${role}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authApi.login({ email, password });
            if (res.data.status === 'success') {
                const userData = res.data.data;
                localStorage.setItem('token', userData.token); // Lưu JWT Token
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
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
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
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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

                    <div className="role-selection">
                        <button 
                            type="button" 
                            className={`role-tab ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            Tôi là Sinh viên
                        </button>
                        <button 
                            type="button" 
                            className={`role-tab ${role === 'company' ? 'active' : ''}`}
                            onClick={() => setRole('company')}
                        >
                            Tôi là Doanh nghiệp
                        </button>
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
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
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

                        <div className="google-login-row">
                            <button 
                                type="button" 
                                className="google-icon-btn" 
                                aria-label="Đăng nhập bằng Google"
                                onClick={handleGoogleLogin}
                            >
                                <svg viewBox="0 0 24 24" width="32" height="32">
                                    <path fill="#EA4335" d="M12 5.04c1.74 0 3.3.6 4.53 1.76l3.39-3.39C17.85 1.48 15.11 0 12 0 7.31 0 3.32 2.69 1.4 6.65L5.4 9.75c.94-2.73 3.5-4.71 6.6-4.71z" />
                                    <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.37H12v4.51h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.69-4.92 3.69-8.59z" />
                                    <path fill="#FBBC05" d="M5.4 14.25c-.24-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25L1.4 6.65C.51 8.26 0 10.07 0 12s.51 3.74 1.4 5.35l4-3.1z" />
                                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.23 1.1-3.1 0-5.66-2.11-6.6-4.96l-4 3.1C3.32 21.31 7.31 24 12 24z" />
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
