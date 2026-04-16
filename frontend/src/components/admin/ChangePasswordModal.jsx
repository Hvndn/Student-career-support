import React, { useState } from 'react';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/admin/ChangePasswordModal.css';

const ChangePasswordModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validate
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ các trường');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (response.data?.status === 'success') {
                toast.success('Đổi mật khẩu thành công!');
                onClose();
            } else if (response.data?.status === 'error') {
                toast.error(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Change password error:', error);
            if (!error.response) {
                toast.error('Không thể kết nối tới máy chủ');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cp-modal-overlay" onClick={onClose}>
            <div className="cp-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="cp-icon-container">
                    <span className="material-symbols-outlined cp-icon-shield">
                        shield_lock
                    </span>
                </div>
                
                <h2 className="cp-title">Đổi mật khẩu</h2>
                <p className="cp-subtitle">Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.</p>

                <form onSubmit={handleSubmit}>
                    <div className="cp-form-group">
                        <label className="cp-label">Mật khẩu hiện tại</label>
                        <div className="cp-input-wrapper">
                            <input 
                                type={showPasswords ? "text" : "password"} 
                                name="currentPassword"
                                className="cp-input" 
                                placeholder="••••••••"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                            <button 
                                type="button"
                                className="cp-toggle-btn"
                                onClick={() => setShowPasswords(!showPasswords)}
                            >
                                <span className="material-symbols-outlined">
                                    {showPasswords ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="cp-form-group">
                        <label className="cp-label">Mật khẩu mới</label>
                        <div className="cp-input-wrapper">
                            <input 
                                type={showPasswords ? "text" : "password"} 
                                name="newPassword"
                                className="cp-input" 
                                placeholder="Tối thiểu 6 ký tự"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="cp-form-group">
                        <label className="cp-label">Xác nhận mật khẩu mới</label>
                        <div className="cp-input-wrapper">
                            <input 
                                type={showPasswords ? "text" : "password"} 
                                name="confirmPassword"
                                className="cp-input" 
                                placeholder="Nhập lại mật khẩu mới"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="cp-modal-footer">
                        <button type="button" className="cp-btn cp-btn-cancel" onClick={onClose} disabled={loading}>
                            Hủy
                        </button>
                        <button type="submit" className="cp-btn cp-btn-confirm" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
