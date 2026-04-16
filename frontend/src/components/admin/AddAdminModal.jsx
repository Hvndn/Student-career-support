import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api';

const AddAdminModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);
        try {
            await adminApi.createAdmin({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            toast.success('Đã thêm tài khoản quản trị thành công!');
            onSuccess();
            onClose();
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            console.error('Lỗi khi thêm admin:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Thêm tài khoản quản trị</h2>
                    <button className="btn-close" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Họ tên</label>
                            <input 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ tên đầy đủ"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@dau.edu.vn"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                required 
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Hủy bỏ</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Thêm tài khoản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdminModal;
