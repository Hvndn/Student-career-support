import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Token không hợp lệ hoặc đã hết hạn!");
            navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            toast.error("Mật khẩu phải từ 6 ký tự trở lên");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword(token, password);
            setIsSuccess(true);
            toast.success("Mật khẩu đã được thay đổi!");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
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
                <div className="copyright">© 2024 Fivecore. All rights reserved.</div>
            </div>

            <div className="auth-right">
                <div className="auth-form-box">
                    <div className="form-header">
                        <h2>{isSuccess ? "Thành công!" : "Thiết lập mật khẩu"}</h2>
                        <p>
                            {isSuccess 
                                ? "Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng về trang đăng nhập trong giây lát." 
                                : "Nhập mật khẩu mới cho tài khoản của bạn."}
                        </p>
                    </div>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Xác nhận mật khẩu mới</label>
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
                                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                            </button>
                        </form>
                    ) : (
                        <Link to="/login" className="btn-submit">
                            Quay lại đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
