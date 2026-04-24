import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../Auth.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword({ token, newPassword: password });
            toast.success("Mật khẩu đã được thay đổi thành công!");
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="brand-title">Fivecore</div>
                <div className="brand-desc">
                    Thiết lập mật khẩu mới để tiếp tục hành trình sự nghiệp của bạn.
                </div>
                <div className="copyright">
                    &copy; 2025 Fivecore. Nền tảng kết nối tri thức và sự nghiệp.
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="form-header">
                        <h2>Đặt lại mật khẩu</h2>
                        <p>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>MẬT KHẨU MỚI</label>
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

                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label>XÁC NHẬN MẬT KHẨU</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                        </button>

                        <div className="auth-prompt">
                            Quay lại <Link to="/login" className="auth-link">Đăng nhập</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
