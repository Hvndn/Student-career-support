import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/common/Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) { toast.error("Mật khẩu không khớp!"); return; }
        setLoading(true);
        try {
            await authApi.resetPassword(token, password);
            setIsSuccess(true);
            toast.success("Đổi mật khẩu thành công!");
            setTimeout(() => navigate('/login'), 2500);
        } catch (error) { toast.error("Lỗi xác thực!"); }
        finally { setLoading(false); }
    };

    return (
        <div className="mr-auth-page">
            <div className="mr-auth-crystal-card">
                <div className="mr-auth-side-art">
                    <div className="mr-art-logo">Fivecore</div>
                    <div className="mr-art-content">
                        <h1>Thiết lập <span>Mật khẩu</span> <br /> Sẵn sàng <span>Trở lại</span></h1>
                        <p className="mr-art-desc">Hoàn tất bước cuối cùng để quay lại với những cơ hội nghề nghiệp tuyệt vời nhất.</p>
                    </div>
                    <div className="mr-art-3d-visual" style={{ backgroundImage: `url('/premium_auth_3d_visual_1776959386504.png')` }}></div>
                </div>

                <div className="mr-auth-form-side">
                    <div className="mr-form-header">
                        <h2>{isSuccess ? "Thành công" : "Mật khẩu mới"}</h2>
                        <p>{isSuccess ? "Mật khẩu đã được cập nhật thành công." : "Nhập mật khẩu mới an toàn hơn cho tài khoản."}</p>
                    </div>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="mr-login-form">
                            <div className="mr-input-group">
                                <label>MẬT KHẨU MỚI</label>
                                <div className="mr-input-wrapper">
                                    <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                            </div>
                            <div className="mr-input-group">
                                <label>XÁC NHẬN MẬT KHẨU</label>
                                <div className="mr-input-wrapper">
                                    <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                            </div>
                            <button type="submit" className="mr-btn-submit" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Cập nhật mật khẩu →"}
                            </button>
                        </form>
                    ) : (
                        <Link to="/login" className="mr-btn-submit">Đăng nhập ngay</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
