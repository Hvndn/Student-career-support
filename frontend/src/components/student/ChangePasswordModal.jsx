import React from 'react';
import '../../assets/css/student/ChangePasswordModal.css';

const ChangePasswordModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="cp-modal-overlay" onClick={onClose}>
            <div className="cp-modal-container" onClick={(e) => e.stopPropagation()}>
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
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </div>
                    <div className="cp-form-group">
                        <label>Mật khẩu mới</label>
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>
                    <div className="cp-form-group">
                        <label>Xác nhận mật khẩu mới</label>
                        <input 
                            type="password" 
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                </div>

                <div className="cp-modal-footer">
                    <button className="cp-btn-cancel" onClick={onClose}>Hủy</button>
                    <button className="cp-btn-confirm" onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
