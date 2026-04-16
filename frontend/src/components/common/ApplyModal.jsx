import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { studentApi } from '../../api';
import '../../assets/css/common/ApplyModal.css';

/**
 * Premium 'Apply Now' Modal for Job Portal
 * Features: Student info pre-fill, Drag & Drop CV upload, Cover Letter.
 */
const ApplyModal = ({ job, profile, onClose, onApplySuccess }) => {
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        coverLetter: ''
    });
    const [cvFile, setCvFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setCvFile(file);
        } else {
            toast.error("Vui lòng tải lên tệp PDF hoặc Word (doc/docx)");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setCvFile(file);
        } else {
            toast.error("Vui lòng tải lên tệp PDF hoặc Word (doc/docx)");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cvFile) {
            toast.error("Vui lòng đính kèm hồ sơ / CV");
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('coverLetter', formData.coverLetter);
            submitData.append('cvFile', cvFile);

            await studentApi.applyJobWithData(job.id, submitData);
            toast.success("Nộp hồ sơ thành công!");
            if (onApplySuccess) onApplySuccess();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra khi nộp hồ sơ");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-wrap">
                        <h2>Ứng tuyển công việc</h2>
                        <p className="modal-job-subtitle">
                            {job.title} - {job.companyName}
                        </p>
                    </div>
                    <button onClick={onClose} className="modal-close-btn">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Basic Info */}
                    <div className="form-group">
                        <label className="form-label">Họ và tên</label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Nhập họ và tên đầy đủ"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Số điện thoại</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="090XXXXXXX"
                                required
                            />
                        </div>
                    </div>

                    {/* CV Upload */}
                    <div className="form-group">
                        <label className="form-label">Hồ sơ / CV đính kèm <span>(PDF/DOC, tối đa 10MB/tệp)</span></label>
                        <div 
                            className={`upload-area ${isDragging ? 'dragging' : ''} ${cvFile ? 'has-file' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('cv-upload-input').click()}
                        >
                            <input 
                                id="cv-upload-input"
                                type="file" 
                                className="hidden" 
                                hidden
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                            />
                            {cvFile ? (
                                <div className="file-info">
                                    <div className="upload-icon-box">
                                        <span className="material-symbols-outlined">task</span>
                                    </div>
                                    <span className="file-name">{cvFile.name}</span>
                                    <span className="file-size">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                                        className="change-file-btn"
                                    >
                                        Thay đổi tệp
                                    </button>
                                </div>
                            ) : (
                                <div className="upload-prompt">
                                    <div className="upload-icon-box">
                                        <span className="material-symbols-outlined">upload_file</span>
                                    </div>
                                    <span className="upload-text-main">Nhấn để đính kèm tệp hồ sơ</span>
                                    <span className="upload-text-sub">Có thể chọn nhiều tệp — PDF, DOC, DOCX</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="form-group">
                        <label className="form-label">Thư giới thiệu (Cover Letter)</label>
                        <textarea 
                            name="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleInputChange}
                            rows="4"
                            className="form-textarea"
                            placeholder="Viết ngắn gọn về lý do bạn phù hợp với vị trí này..."
                        ></textarea>
                    </div>

                    {/* Actions */}
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-submit">
                            {isSubmitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Nộp hồ sơ'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;
