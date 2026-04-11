import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../../api';
import '../../assets/css/student/ChangePasswordModal.css';

const ChangePasswordModal = ({ show, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu mới không khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            await authApi.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            toast.success('Đổi mật khẩu thành công!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            onClose();
        } catch (error) {
            // Error handled by interceptor, but we stop loading
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cp-modal-overlay" onClick={onClose}>
            <div className="cp-modal-container" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="cp-modal-header">
                        <div className="cp-modal-icon">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                <polyline points="9 11 11 13 15 9"></polyline>
                            </svg>
                        </div>
                        <h2>Đổi mật khẩu</h2>
                        <p>Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.</p>
                    </div>

                    <div className="cp-modal-body">
                        <div className="cp-form-group">
                            <label>Mật khẩu hiện tại</label>
                            <input 
                                type="password" 
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu hiện tại"
                                disabled={loading}
                            />
                        </div>
                        <div className="cp-form-group">
                            <label>Mật khẩu mới</label>
                            <input 
                                type="password" 
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu mới"
                                disabled={loading}
                            />
                        </div>
                        <div className="cp-form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu mới"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="cp-modal-footer">
                        <button type="button" className="cp-btn-cancel" onClick={onClose} disabled={loading}>Hủy</button>
                        <button type="submit" className="cp-btn-confirm" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
