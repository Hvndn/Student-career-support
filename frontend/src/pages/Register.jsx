import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authApi.register(formData);
            if (res.data.status === 'success') {
                navigate('/login');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Đăng ký thất bại. Email có thể đã tồn tại.');
        }
    };

    return (
        <div className="fade-in" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '85vh',
            padding: '3rem 2rem'
        }}>
            <div className="card glass" style={{ 
                width: '100%', 
                maxWidth: '520px',
                padding: '3rem 2.5rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
            }}>
                <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        Tạo <span className="gradient-text">Tài khoản</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Bắt đầu sự nghiệp mơ ước của bạn ngay hôm nay.</p>
                </header>
                
                {error && (
                    <div className="fade-in" style={{ 
                        background: 'rgba(244, 63, 94, 0.1)', 
                        color: 'var(--error)', 
                        padding: '0.8rem', 
                        borderRadius: '10px',
                        marginBottom: '1.5rem', 
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(244, 63, 94, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Họ và tên</label>
                        <input 
                            type="text" 
                            className="glass" 
                            style={{ width: '100%', padding: '1rem', color: '#000', fontSize: '1rem', outline: 'none' }}
                            placeholder="Nguyễn Văn A"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Email đăng ký</label>
                        <input 
                            type="email" 
                            className="glass" 
                            style={{ width: '100%', padding: '1rem', color: '#000', fontSize: '1rem', outline: 'none' }}
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Mật khẩu bảo mật</label>
                        <input 
                            type="password" 
                            className="glass" 
                            style={{ width: '100%', padding: '1rem', color: '#000', fontSize: '1rem', outline: 'none' }}
                            placeholder="Mật khẩu tối thiểu 6 ký tự"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Bạn là ai?</label>
                        <select 
                            className="glass" 
                            style={{ width: '100%', padding: '1rem', color: '#000', background: 'var(--surface)', fontSize: '1rem', outline: 'none' }}
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="STUDENT">🎓 Sinh viên tìm việc</option>
                            <option value="COMPANY">🏢 Nhà tuyển dụng</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem' }}>
                        Tham gia ngay
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Đăng nhập tại đây</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};


export default Register;
