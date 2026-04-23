import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api';
import '../../assets/css/common/Auth.css';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleLoginSuccess = async () => {
            try {
                const token = searchParams.get('token');
                if (token) {
                    localStorage.setItem('token', token);
                    const response = await authApi.getCurrentUser();
                    if (response.data.status === 'success') {
                        const userData = response.data.data;
                        localStorage.setItem('user', JSON.stringify(userData));
                        const userRole = userData.role ? userData.role.toUpperCase() : '';
                        const loginSuccessMsg = { state: { message: 'Đăng nhập thành công!' } };

                        if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
                            navigate('/admin/dashboard', loginSuccessMsg);
                        } else if (userRole === 'COMPANY' || userRole === 'ROLE_COMPANY') {
                            navigate('/company/dashboard', loginSuccessMsg);
                        } else {
                            navigate('/', loginSuccessMsg);
                        }
                    } else {
                        setError('Không thể lấy thông tin người dùng.');
                    }
                } else {
                    setError('Không tìm thấy mã xác thực.');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (err) {
                setError('Lỗi xác thực tài khoản Google.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };
        handleLoginSuccess();
    }, [navigate, searchParams]);

    return (
        <div className="mr-auth-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="mr-visual-shapes">
                <div className="mr-shape-1"></div>
                <div className="mr-shape-2"></div>
            </div>
            
            <div className="mr-auth-card" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                {!error ? (
                    <>
                        <div className="mr-loading-spinner" style={{
                            width: '60px', height: '60px', border: '6px solid #f1f5f9',
                            borderTop: '6px solid #4338ca', borderRadius: '50%',
                            animation: 'mr-spin 1s linear infinite', margin: '0 auto 2rem'
                        }}></div>
                        <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#1e1b4b' }}>Đang xác thực...</h2>
                        <p style={{ color: '#64748b' }}>Vui lòng đợi trong giây lát khi chúng tôi thiết lập tài khoản của bạn.</p>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>❌</div>
                        <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#dc2626' }}>Lỗi đăng nhập</h2>
                        <p style={{ color: '#64748b' }}>{error}</p>
                    </>
                )}
            </div>
            <style>{`
                @keyframes mr-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default LoginSuccess;
