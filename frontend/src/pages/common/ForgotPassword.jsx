import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            setError("Vui lòng nhập email");
            return;
        }

        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setMessage("Yêu cầu của bạn đã được gửi tới Quản trị viên. Vui lòng kiểm tra email sau khi yêu cầu được phê duyệt.");
            toast.success("Đã gửi yêu cầu thành công!");
        } catch (err) {
            setError(err.response?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
            toast.error("Gửi yêu cầu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="brand-title">Fivecore</div>
                <div className="brand-desc">
                    Hỗ trợ sinh viên kiến tạo sự nghiệp tương lai với công nghệ kết nối thông minh.
                </div>
                <div className="feature-list">
                    <div className="feature-item">
                        <div className="feature-icon">🔑</div>
                        <div className="feature-text">
                            <h4>Bảo mật hồ sơ</h4>
                            <p>Đảm bảo an toàn thông tin cá nhân và tài khoản của bạn.</p>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    &copy; 2025 Fivecore. Nền tảng kết nối tri thức và sự nghiệp.
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="form-header">
                        <h2>Quên mật khẩu?</h2>
                        <p>Nhập email của bạn để yêu cầu cấp lại mật khẩu từ quản trị viên.</p>
                    </div>

                    {message && (
                        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
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

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang gửi...' : 'Gửi yêu cầu cấp lại'}
                            {!loading && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            )}
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

export default ForgotPassword;
