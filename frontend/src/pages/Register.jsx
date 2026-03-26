import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import './Register.css'; // New CSS file for specific styles

const Register = () => {
    useEffect(() => {
        document.body.style.paddingTop = '0';
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT'
    });
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) {
            setError('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu và Xác nhận mật khẩu không khớp.');
            return;
        }
        try {
            const { confirmPassword, ...registerData } = formData;
            const res = await authApi.register(registerData);
            if (res.data.status === 'success') {
                navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
            } else {
                setError(res.data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            const serverMessage = err.response?.data?.message;
            setError(serverMessage || 'Đăng ký thất bại. Email có thể đã tồn tại hoặc hệ thống gặp sự cố.');
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
                        <h2>Tạo tài khoản mới</h2>
                        <p>Chọn vai trò của bạn và bắt đầu hành trình ngay hôm nay.</p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Role Selector */}
                        <div className="role-selector">
                            <div 
                                className={`role-card ${formData.role === 'STUDENT' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, role: 'STUDENT'})}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                </svg>
                                <span>Tôi là Sinh viên</span>
                            </div>
                            <div 
                                className={`role-card ${formData.role === 'COMPANY' ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, role: 'COMPANY'})}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
                                </svg>
                                <span>Tôi là Doanh nghiệp</span>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="form-group">
                            <label>HỌ VÀ TÊN</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Nguyễn Văn A"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>EMAIL</label>
                            <input 
                                type="email" 
                                className="form-input" 
                                placeholder="example@scholarbridge.vn"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>MẬT KHẨU</label>
                                <input 
                                    type="password" 
                                    className="form-input" 
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>XÁC NHẬN MẬT KHẨU</label>
                                <input 
                                    type="password" 
                                    className="form-input" 
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Checkbox */}
                        <div className="terms-group">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                className="terms-checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <label htmlFor="terms" className="terms-text">
                                Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và <Link to="/privacy">Chính sách bảo mật</Link> của ScholarBridge.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn-submit">
                            Tạo tài khoản 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>

                        <div className="auth-prompt">
                            Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link>
                        </div>

                        <div className="divider">HOẶC ĐĂNG KÝ BẰNG</div>

                        <div className="social-login">
                            <button type="button" className="social-btn" aria-label="Đăng ký bằng Google">
                                <svg viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </button>
                            <button type="button" className="social-btn" aria-label="Đăng ký bằng Facebook">
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

export default Register;
