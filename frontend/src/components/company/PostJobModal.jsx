import React from 'react';
import JobForm from './JobForm';
import '../../assets/css/company/PostJobModal.css';

const PostJobModal = ({ isOpen, onClose, jobToEdit, onSuccess }) => {
    if (!isOpen) return null;

    return (
        // [FE Logic] Wrapper Modal cho component JobForm.jsx để tái sử dụng logic Đăng mới / Cập nhật tin tuyển dụng
        <div className="pjm-overlay">
            <div className="pjm-container">
                <div className="pjm-header">
                    <h2><i className="fa-solid fa-briefcase"></i> {jobToEdit ? 'Chỉnh sửa Tin Tuyển Dụng' : 'Đăng Tin Mới'}</h2>
                    <button className="btn-close-modal" onClick={onClose}><i className="fa-solid fa-times"></i></button>
                </div>

                <div className="pjm-body">
                    <JobForm 
                        jobData={jobToEdit} 
                        onSuccess={() => {
                            onSuccess();
                            onClose();
                        }} 
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostJobModal;
