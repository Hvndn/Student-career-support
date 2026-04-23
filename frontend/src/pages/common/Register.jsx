import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/common/Auth.css';

const Register = () => {
    useEffect(() => {
        document.body.style.paddingTop = '0';
        return () => { document.body.style.paddingTop = ''; };
    }, []);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!agreed) { toast.error('Vui lòng đồng ý với Điều khoản.'); return; }
        if (formData.password !== formData.confirmPassword) { setError('Mật khẩu không khớp.'); return; }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            const res = await authApi.register({ ...registerData, role: formData.role.toLowerCase() });
            if (res.data.status === 'success') {
                toast.success('Đăng ký thành công!');
                setTimeout(() => navigate('/login', { state: { message: 'Đăng ký thành công!' } }), 1500);
            } else { setError(res.data.message || 'Đăng ký thất bại.'); }
        } catch (err) { setError('Email đã tồn tại hoặc lỗi hệ thống.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="mr-auth-page">
            <div className="mr-auth-crystal-card">
                {/* Visual Experience Side */}
                <div className="mr-auth-side-art">
                    <div className="mr-art-logo">Fivecore</div>
                    <div className="mr-art-content">
                        <h1>
                            Khởi đầu <span>Vững chãi</span> <br /> 
                            Vươn tới <span>Tầm cao</span>
                        </h1>
                        <p className="mr-art-desc">
                            Gia nhập mạng lưới nhân tài số 1 để mở khóa những cơ hội nghề nghiệp độc quyền và bứt phá sự nghiệp.
                        </p>
                    </div>
                    <div className="mr-art-3d-visual" style={{ backgroundImage: `url('/premium_auth_3d_visual_1776959386504.png')` }}></div>
                </div>

                {/* Crystal Form Side */}
                <div className="mr-auth-form-side">
                    <div className="mr-form-header">
                        <h2>Tạo tài khoản</h2>
                        <p>Bắt đầu hành trình của bạn ngay hôm nay</p>
                    </div>

                    <div className="mr-role-switcher">
                        <button type="button" className={formData.role === 'student' ? 'active' : ''} onClick={() => setFormData({ ...formData, role: 'student' })}>Sinh viên</button>
                        <button type="button" className={formData.role === 'company' ? 'active' : ''} onClick={() => setFormData({ ...formData, role: 'company' })}>Doanh nghiệp</button>
                    </div>

                    {error && <div className="mr-alert mr-alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="mr-login-form">
                        <div className="mr-input-group">
                            <label>HỌ VÀ TÊN</label>
                            <div className="mr-input-wrapper">
                                <input type="text" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                            </div>
                        </div>

                        <div className="mr-input-group">
                            <label>ĐỊA CHỈ EMAIL</label>
                            <div className="mr-input-wrapper">
                                <input type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                        </div>

                        <div className="mr-input-grid">
                            <div className="mr-input-group">
                                <label>MẬT KHẨU</label>
                                <div className="mr-input-wrapper">
                                    <input type={showPassword ? "text" : "password"} placeholder="••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                    <button type="button" className="mr-password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '👁️' : '🙈'}</button>
                                </div>
                            </div>
                            <div className="mr-input-group">
                                <label>XÁC NHẬN</label>
                                <div className="mr-input-wrapper">
                                    <input type={showConfirmPassword ? "text" : "password"} placeholder="••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                                    <button type="button" className="mr-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? '👁️' : '🙈'}</button>
                                </div>
                            </div>
                        </div>

                        <div className="mr-checkbox-group">
                            <input type="checkbox" id="agreed" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                            <label htmlFor="agreed">Tôi đồng ý với các <span>Điều khoản & Chính sách</span></label>
                        </div>

                        <button type="submit" className="mr-btn-submit" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng ký ngay →'}
                        </button>

                        <p className="mr-auth-footer">
                            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
