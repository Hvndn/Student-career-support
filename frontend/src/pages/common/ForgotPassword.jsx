import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Vui lòng nhập email");
            return;
        }

        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setIsSent(true);
            toast.success("Link khôi phục mật khẩu đã được gửi!");
        } catch (error) {
            console.error(error);
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
                <div className="copyright">© 2024 Fivecore. All rights reserved.</div>
            </div>

            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="form-header">
                        <h2>{isSent ? "Kiểm tra Email" : "Quên mật khẩu?"}</h2>
                        <p>
                            {isSent 
                                ? `Chúng tôi đã gửi hướng dẫn lấy lại mật khẩu tới ${email}. Vui lòng kiểm tra hộp thư đến.` 
                                : "Nhập địa chỉ email đã đăng ký để nhận hướng dẫn khôi phục mật khẩu."}
                        </p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Địa chỉ Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="yourname@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? "Đang gửi..." : "Gửi yêu cầu khôi phục"}
                            </button>
                        </form>
                    ) : (
                        <div className="auth-prompt">
                            Không nhận được email? <span className="auth-link" onClick={() => setIsSent(false)} style={{cursor: 'pointer'}}>Thử lại</span>
                        </div>
                    )}

                    <div className="auth-prompt">
                        Quay lại trang <Link to="/login" className="auth-link">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
