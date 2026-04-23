import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/common/Auth.css';

const ForgotPassword = () => {
    useEffect(() => {
        document.body.style.paddingTop = '0';
        return () => { document.body.style.paddingTop = ''; };
    }, []);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setIsSent(true);
            toast.success("Đã gửi email khôi phục!");
        } catch (error) {
            toast.error("Gửi yêu cầu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mr-auth-page">
            <div className="mr-auth-crystal-card">
                <div className="mr-auth-side-art">
                    <div className="mr-art-logo">Fivecore</div>
                    <div className="mr-art-content">
                        <h1>
                            Khôi phục <span>Truy cập</span> <br /> 
                            Bảo mật <span>Tối ưu</span>
                        </h1>
                        <p className="mr-art-desc">
                            Hệ thống bảo vệ tài khoản thông minh giúp bạn luôn làm chủ hành trình nghề nghiệp của mình.
                        </p>
                    </div>
                    <div className="mr-art-3d-visual" style={{ backgroundImage: `url('/premium_auth_3d_visual_1776959386504.png')` }}></div>
                </div>

                <div className="mr-auth-form-side">
                    <div className="mr-form-header">
                        <h2>{isSent ? "Kiểm tra Email" : "Quên mật khẩu?"}</h2>
                        <p>{isSent ? "Yêu cầu đã được gửi. Vui lòng kiểm tra hộp thư của bạn." : "Nhập email để nhận liên kết khôi phục mật khẩu."}</p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="mr-login-form">
                            <div className="mr-input-group">
                                <label>ĐỊA CHỈ EMAIL</label>
                                <div className="mr-input-wrapper">
                                    <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <button type="submit" className="mr-btn-submit" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Gửi yêu cầu ngay →"}
                            </button>
                        </form>
                    ) : (
                        <button className="mr-btn-submit" onClick={() => setIsSent(false)}>Gửi lại email</button>
                    )}

                    <p className="mr-auth-footer">
                        Quay lại trang <Link to="/login">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
