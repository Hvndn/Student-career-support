import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api';

const AddAdminModal = ({ isOpen, onClose, onSuccess, account = null }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (account && isOpen) {
            setFormData({
                fullName: account.fullName || '',
                email: account.email || '',
                password: '',
                confirmPassword: ''
            });
        } else if (!account && isOpen) {
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [account, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);
        try {
            if (account) {
                await adminApi.updateAdmin(account.id, {
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                });
                toast.success('Cập nhật tài khoản quản trị thành công!');
            } else {
                await adminApi.createAdmin({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                });
                toast.success('Thêm tài khoản quản trị thành công!');
            }
            onSuccess();
            onClose();
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            console.error('Lỗi khi lưu admin:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: '#fff', width: '100%', maxWidth: '500px',
                borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden', position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
                
                {/* Header with gradient background */}
                <div style={{
                    padding: '2.5rem 2rem 2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#fff', position: 'relative'
                }}>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)',
                        border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                            background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '18px',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                                {account ? 'person_edit' : 'person_add'}
                            </span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
                                {account ? 'Hiệu chỉnh quản trị' : 'Tạo mới quản trị'}
                            </h2>
                            <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: '0.9rem' }}>
                                {account ? 'Cập nhật thông tin tài khoản truy cập hệ thống' : 'Thiết lập tài khoản quản trị mới cho hệ thống'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2.5rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div className="form-group-premium">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Họ và tên</label>
                            <div style={{ position: 'relative' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}>person</span>
                                <input 
                                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                    placeholder="VD: Nguyễn Văn A" required
                                    style={{
                                        width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', border: '2px solid #f1f5f9',
                                        fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none', background: '#f8fafc'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="form-group-premium">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Địa chỉ Email</label>
                            <div style={{ position: 'relative' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}>mail</span>
                                <input 
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder="admin@dau.edu.vn" required
                                    style={{
                                        width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', border: '2px solid #f1f5f9',
                                        fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none', background: '#f8fafc'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group-premium">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                    {account ? 'Mật khẩu mới' : 'Mật khẩu'}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}>lock</span>
                                    <input 
                                        type="password" name="password" value={formData.password} onChange={handleChange}
                                        placeholder="••••••••" required={!account}
                                        style={{
                                            width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', border: '2px solid #f1f5f9',
                                            fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none', background: '#f8fafc'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="form-group-premium">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Xác nhận</label>
                                <div style={{ position: 'relative' }}>
                                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}>verified_user</span>
                                    <input 
                                        type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                        placeholder="••••••••" required={!account || formData.password.length > 0}
                                        style={{
                                            width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', border: '2px solid #f1f5f9',
                                            fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none', background: '#f8fafc'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={onClose} style={{
                            flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #f1f5f9',
                            background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}>Hủy bỏ</button>
                        <button type="submit" disabled={loading} style={{
                            flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                            color: '#fff', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            {loading ? (
                                <>
                                    <div style={{ width: '18px', height: '18px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                        {account ? 'save' : 'add_circle'}
                                    </span>
                                    {account ? 'Lưu thay đổi' : 'Thêm tài khoản'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input:focus { border-color: #0f172a !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05); }
            `}</style>
        </div>
    );
};

export default AddAdminModal;
