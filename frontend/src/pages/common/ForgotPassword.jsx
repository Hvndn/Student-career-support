import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/common/Auth.css';

const ForgotPassword = () => {
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
                
                {/* Crystal Form Side (LEFT) */}
                <div className="mr-auth-form-side">
                    <div className="mr-form-header">
                        <h2>{isSent ? "Kiểm tra Email" : "Quên mật khẩu?"}</h2>
                        <p>{isSent ? "Yêu cầu đã được gửi. Vui lòng kiểm tra hộp thư." : "Nhập email để nhận liên kết khôi phục mật khẩu."}</p>
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
                            Bảo mật <span style={{ color: '#818cf8' }}>Tối ưu</span> <br /> 
                            An tâm <span style={{ color: '#c084fc' }}>Sự nghiệp</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '2rem', maxWidth: '400px' }}>
                            Hệ thống bảo vệ tài khoản giúp bạn luôn làm chủ cơ hội của mình.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;
