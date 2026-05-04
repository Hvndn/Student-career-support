import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/student/ApplicationDetailDrawer.css';

/**
 * Premium side drawer showing detailed application progress and submitted documents.
 */
const ApplicationDetailDrawer = ({ application, onClose, onRefresh }) => {
    const navigate = useNavigate();
    const [isCanceling, setIsCanceling] = useState(false);

    if (!application) return null;

    const formatDate = (dt) => {
        if (!dt) return 'N/A';
        return new Date(dt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Progress mapping: pending -> review -> interview -> result (accepted/rejected)
    const status = (application.status || '').toLowerCase();
    
    const steps = [
        { key: 'pending', label: 'Chờ duyệt', desc: 'Đã gửi hồ sơ', icon: 'send' },
        { key: 'review', label: 'Đã xem', desc: 'DN tiếp nhận', icon: 'visibility' },
        { key: 'interview', label: 'Phỏng vấn', desc: 'Sắp xếp lịch', icon: 'event' },
        { key: 'result', label: 'Kết quả', desc: 'Trúng tuyển', icon: 'stars' }
    ];

    const getStepState = (index) => {
        const currentStatus = status;
        
        // Define reachability
        let reachIndex = 0; // pending
        if (['review', 'suitable'].includes(currentStatus)) reachIndex = 1;
        if (currentStatus === 'interview') reachIndex = 2;
        if (['accepted', 'rejected'].includes(currentStatus)) reachIndex = 3;

        if (index < reachIndex) return 'completed';
        if (index === reachIndex) return 'active';
        return 'future';
    };

    const handleChat = () => {
        if (application.companyUserId) {
            navigate(`/student/chat?partnerId=${application.companyUserId}`);
        }
    };

    const handleViewJob = () => {
        navigate(`/jobs/${application.jobId}`);
    };

    const handleCancel = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy ứng tuyển công việc này không?")) return;
        setIsCanceling(true);
        try {
            await studentApi.cancelApplication(application.jobId);
            toast.success("Đã hủy ứng tuyển thành công!");
            if (onRefresh) onRefresh();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi hủy ứng tuyển");
        } finally {
            setIsCanceling(false);
        }
    };

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
                <header className="drawer-header">
                    <button className="drawer-close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="drawer-company-info">
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>corporate_fare</span>
                        {application.companyName}
                    </div>
                    <h2 className="drawer-job-title">{application.jobTitle}</h2>
                    <p className="drawer-applied-date">Đã nộp: {formatDate(application.appliedAt)}</p>

                    <div className="drawer-header-actions">
                        {status === 'pending' && (
                            <button className="btn-drawer-action btn-cancel" onClick={handleCancel} disabled={isCanceling} style={{ background: '#fef2f2', color: '#ef4444', borderColor: '#fca5a5' }}>
                                <span className="material-symbols-outlined">cancel</span>
                                {isCanceling ? 'Đang hủy...' : 'Hủy ứng tuyển'}
                            </button>
                        )}
                        <button className="btn-drawer-action btn-chat" onClick={handleChat}>
                            <span className="material-symbols-outlined">forum</span>
                            Nhắn tin
                        </button>
                        <button className="btn-drawer-action btn-view-job" onClick={handleViewJob}>
                            <span className="material-symbols-outlined">rocket_launch</span>
                            Xem tin tuyển dụng
                        </button>
                    </div>
                </header>

                <div className="drawer-body">
                    {/* Candidate Info Section */}
                    <div className="drawer-card">
                        <h3 className="drawer-section-title">
                            <span className="material-symbols-outlined" style={{ color: '#10b981' }}>contact_page</span>
                            Thông tin ứng tuyển
                        </h3>
                        <div className="candidate-info-grid">
                            <div className="info-item">
                                <label>HỌ VÀ TÊN</label>
                                <p>{application.fullName || 'Đang cập nhật'}</p>
                            </div>
                            <div className="info-item">
                                <label>EMAIL</label>
                                <p>{application.email || 'Đang cập nhật'}</p>
                            </div>
                            <div className="info-item">
                                <label>SỐ ĐIỆN THOẠI</label>
                                <p>{application.phone || 'Đang cập nhật'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cover Letter Section */}
                    {application.coverLetter && (
                        <div className="drawer-card">
                            <h3 className="drawer-section-title">
                                <span className="material-symbols-outlined" style={{ color: '#ec4899' }}>history_edu</span>
                                Thư giới thiệu đã gửi
                            </h3>
                            <div className="cover-letter-box">
                                {application.coverLetter}
                            </div>
                        </div>
                    )}

                    {/* Progress Section */}
                    <div className="drawer-card">
                        <h3 className="drawer-section-title">
                            <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>bolt</span>
                            Tiến trình ứng tuyển
                        </h3>
                        <div className="stepper-container">
                            {steps.map((step, idx) => {
                                const state = getStepState(idx);
                                const isFinal = idx === steps.length - 1;
                                let stepLabel = step.label;
                                let stepDesc = step.desc;

                                if (isFinal && status === 'rejected') {
                                    stepLabel = 'Từ chối';
                                    stepDesc = 'Hồ sơ chưa phù hợp';
                                }

                                return (
                                    <div key={step.key} className={`step-item ${state}`}>
                                        <div className="step-icon-box">
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                                                {state === 'completed' ? 'check' : step.icon}
                                            </span>
                                        </div>
                                        <div className="step-info">
                                            <h4>{stepLabel}</h4>
                                            <p>{stepDesc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="drawer-card">
                        <h3 className="drawer-section-title">
                            <span className="material-symbols-outlined" style={{ color: '#3b82f6' }}>description</span>
                            Hồ sơ bạn đã nộp
                        </h3>
                        <div style={{ paddingLeft: '8px' }}>
                            <label className="form-label">ĐÍNH KÈM</label>
                            <div 
                                className="drawer-cv-item" 
                                onClick={() => {
                                    if (application.cvUrl) {
                                        // Mở file từ server (Vite proxy handles /uploads)
                                        window.open(application.cvUrl, '_blank');
                                    } else {
                                        // Nếu là hồ sơ hệ thống, chuyển về trang quản lý CV
                                        navigate('/student/cv-template');
                                    }
                                }}
                                title={application.cvUrl ? 'Bấm để xem file đã nộp' : 'Bấm để quản lý hồ sơ hệ thống'}
                            >
                                <div className="cv-icon-wrap">
                                    <span className="material-symbols-outlined">
                                        {application.cvUrl ? 'picture_as_pdf' : 'account_circle'}
                                    </span>
                                </div>
                                <span className="cv-name">
                                    {application.cvUrl ? 'Xem CV/Hồ sơ đính kèm' : 'Hồ sơ hệ thống (Xem trong quản lý CV)'}
                                </span>
                                <span className="material-symbols-outlined cv-arrow">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailDrawer;
