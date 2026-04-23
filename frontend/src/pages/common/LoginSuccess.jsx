import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleLoginSuccess = async () => {
            try {
                // 1. Lấy token từ URL (do Backend bắn về sau khi OAuth2 thành công)
                const token = searchParams.get('token');
                
                if (token) {
                    // 2. Lưu token vào localStorage
                    localStorage.setItem('token', token);
                    
                    // 3. Gọi API lấy thông tin user hiện tại (Sẽ tự động đính kèm token nhờ Interceptor trong api.js)
                    const response = await authApi.getCurrentUser();

                    if (response.data.status === 'success') {
                        const userData = response.data.data;
                        localStorage.setItem('user', JSON.stringify(userData));

                        // 4. Chuyển hướng dựa trên vai trò
                        const userRole = userData.role ? userData.role.toUpperCase() : '';
                        const loginSuccessMsg = { state: { message: 'Đăng nhập Google thành công!' } };

                        if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
                            navigate('/admin/dashboard', loginSuccessMsg);
                        } else if (userRole === 'COMPANY' || userRole === 'ROLE_COMPANY') {
                            navigate('/company/dashboard', loginSuccessMsg);
                        } else {
                            navigate('/student/dashboard', loginSuccessMsg);
                        }
                    } else {
                        setError('Không thể lấy thông tin người dùng.');
                    }
                } else {
                    setError('Không tìm thấy mã xác thực (Token).');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (err) {
                console.error('Lỗi khi xử lý đăng nhập Google:', err);
                setError('Đã xảy ra lỗi khi xác thực tài khoản Google.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleLoginSuccess();
    }, [navigate, searchParams]);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontFamily: 'Inter, sans-serif',
            background: '#f7f9fa'
        }}>
            {!error ? (
                <>
                    <div className="spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #0652dd',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }}></div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                    <h2 style={{ color: '#1a1a1a', fontWeight: '600' }}>Đang xác thực tài khoản...</h2>
                    <p style={{ color: '#666' }}>Vui lòng đợi trong giây lát.</p>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <div style={{ color: '#dc2626', fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Lỗi đăng nhập</h2>
                    <p style={{ color: '#666' }}>{error}</p>
                    <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '1rem' }}>Đang quay lại trang đăng nhập...</p>
                </div>
            )}
        </div>
    );
};

export default LoginSuccess;
