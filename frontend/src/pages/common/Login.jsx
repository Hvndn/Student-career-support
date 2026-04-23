import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from '../../api';
import '../../assets/css/common/Auth.css';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
    const [currentImage, setCurrentImage] = useState(0);

    const images = [
        '/premium_auth_3d_visual_1776959386504.png',
        '/premium_auth_3d_visual_2_1776959540655.png'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        document.body.style.paddingTop = '0';
        return () => { document.body.style.paddingTop = ''; };
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('student');

    const handleGoogleLogin = () => {
        window.location.href = `http://localhost:8080/api/auth/google/login?role=${role}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authApi.login({ email, password });
            if (res.data.status === 'success') {
                const userData = res.data.data;
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData));
                const userRole = userData.role ? userData.role.toUpperCase() : '';
                const loginSuccessMsg = { state: { message: 'Chào mừng bạn quay trở lại!' } };
                if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') navigate('/admin/dashboard', loginSuccessMsg);
                else if (userRole === 'COMPANY' || userRole === 'ROLE_COMPANY') navigate('/company/dashboard', loginSuccessMsg);
                else navigate('/', loginSuccessMsg);
            } else { setError(res.data.message); }
        } catch (err) { setError('Email hoặc mật khẩu không chính xác!'); }
    };

    return (
        <div className="mr-auth-page">
            <div className="mr-auth-crystal-card">
                
                {/* Crystal Form Side (LEFT) */}
                <div className="mr-auth-form-side">
                    <div className="mr-form-header">
                        <h2>Đăng nhập</h2>
                        <p>Chào mừng bạn quay trở lại với Fivecore</p>
                    </div>

                    <div className="mr-role-switcher">
                        <button type="button" className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>Sinh viên</button>
                        <button type="button" className={role === 'company' ? 'active' : ''} onClick={() => setRole('company')}>Doanh nghiệp</button>
                    </div>

                    {successMessage && <div className="mr-alert mr-alert-success">{successMessage}</div>}
                    {error && <div className="mr-alert mr-alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="mr-login-form">
                        <div className="mr-input-group">
                            <label>ĐỊA CHỈ EMAIL</label>
                            <div className="mr-input-wrapper">
                                <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className="mr-input-group">
                            <div className="mr-label-row">
                                <label>MẬT KHẨU</label>
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                            </div>
                            <div className="mr-input-wrapper">
                                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <button type="button" className="mr-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? '👁️' : '🙈'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="mr-btn-submit">Bắt đầu ngay <span>→</span></button>

                        <div className="mr-auth-divider"><span>HOẶC TIẾP TỤC VỚI</span></div>

                        <button type="button" onClick={handleGoogleLogin} className="mr-btn-google">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google Account
                        </button>

                        <p className="mr-auth-footer">
                            Chưa có tài khoản? <Link to="/register">Đăng ký miễn phí</Link>
                        </p>
                    </form>
                </div>

                {/* Visual Experience Side (RIGHT) */}
                <div className="mr-auth-side-art">
                    <div className="mr-art-overlay"></div>
                    {images.map((img, idx) => (
                        <div 
                            key={idx}
                            className={`mr-art-3d-visual ${idx === currentImage ? 'active' : ''}`}
                            style={{ backgroundImage: `url('${img}')` }}
                        ></div>
                    ))}
                    
                    <div className="mr-art-logo">Fivecore</div>
                    <div className="mr-art-content" style={{ position: 'relative', zIndex: 10 }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                            Kiến tạo <span style={{ color: '#818cf8' }}>Di sản</span> <br /> 
                            Sự nghiệp <span style={{ color: '#c084fc' }}>Vươn tầm</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '2rem', maxWidth: '400px' }}>
                            Gia nhập cộng đồng tinh hoa để bứt phá giới hạn nghề nghiệp của bạn.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
