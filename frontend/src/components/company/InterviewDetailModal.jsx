import React from 'react';
import '../../assets/css/company/PostJobModal.css'; // Reusing common modal styles

const InterviewDetailModal = ({ isOpen, onClose, interview, onEdit }) => {
    if (!isOpen || !interview) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled': return { text: 'Sắp diễn ra', class: 'status-scheduled' };
            case 'completed': return { text: 'Hoàn thành', class: 'status-completed' };
            case 'cancelled': return { text: 'Đã hủy', class: 'status-cancelled' };
            default: return { text: status, class: '' };
        }
    };

    const statusInfo = getStatusLabel(interview.status);

    return (
        <div className="pjm-overlay" onClick={onClose}>
            <div className="pjm-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="pjm-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>event_note</span> 
                        Chi tiết lịch phỏng vấn
                    </h2>
                    <button className="btn-close-modal" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="pjm-body">
                    {/* Section 1: Thông tin ứng viên */}
                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">person</span> Thông tin ứng viên
                        </div>
                        
                        <div className="pjm-field" style={{ marginBottom: '1.25rem' }}>
                            <label>Công việc tuyển dụng</label>
                            <div className="detail-value-box" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                                {interview.jobTitle}
                            </div>
                        </div>

                        <div className="pjm-field">
                            <label>Ứng viên phỏng vấn</label>
                            <div className="detail-value-box">{interview.studentName}</div>
                        </div>
                    </div>

                    {/* Section 2: Thời gian & Địa điểm */}
                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">schedule</span> Thời gian & Địa điểm
                        </div>
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Thời gian hẹn</label>
                                <div className="detail-value-box">{formatDate(interview.interviewDate)}</div>
                            </div>
                            <div className="pjm-field">
                                <label>Hình thức phỏng vấn</label>
                                <div className="detail-value-box">
                                    {interview.interviewFormat === 'Trực tuyến' ? '💻 Trực tuyến (Online)' : '📍 Trực tiếp (Offline)'}
                                </div>
                            </div>
                        </div>
                        <div className="pjm-field">
                            <label>{interview.interviewFormat === 'Trực tuyến' ? '🔗 Link họp' : '📍 Địa chỉ văn phòng'}</label>
                            <div className="detail-value-box highlighted">
                                {interview.location || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Người phỏng vấn</label>
                                <div className="detail-value-box">{interview.interviewerInfo || 'Chưa cập nhật'}</div>
                            </div>
                        </div>
                        <div className="pjm-field">
                            <label>Yêu cầu hồ sơ đính kèm</label>
                            <div className="detail-value-box">{interview.requiredDocuments || 'Không có yêu cầu'}</div>
                        </div>
                    </div>

                    {/* Section 3: Nội dung & Ghi chú */}
                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">assignment</span> Nội dung & Ghi chú
                        </div>
                        <div className="pjm-field" style={{ marginBottom: '1rem' }}>
                            <label>Nội dung buổi phỏng vấn</label>
                            <div className="detail-value-box multiline">
                                {interview.preliminaryContent || 'Chưa có nội dung sơ bộ'}
                            </div>
                        </div>
                        <div className="pjm-field">
                            <label>Ghi chú cho ứng viên</label>
                            <div className="detail-value-box multiline" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                                {interview.notes || 'Không có ghi chú nào'}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Trạng thái */}
                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">flag</span> Trạng thái buổi hẹn
                        </div>
                        <div className="pjm-field">
                            <span className={`status-pill ${statusInfo.class}`} style={{ 
                                display: 'inline-block',
                                padding: '6px 16px', 
                                borderRadius: '20px', 
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                backgroundColor: interview.status === 'scheduled' ? '#e0f2fe' : interview.status === 'completed' ? '#dcfce7' : '#fee2e2',
                                color: interview.status === 'scheduled' ? '#0369a1' : interview.status === 'completed' ? '#15803d' : '#b91c1c'
                            }}>
                                {statusInfo.text}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pjm-footer">
                    <button type="button" className="pjm-btn-cancel" onClick={onClose}>
                        Đóng
                    </button>
                    <button 
                        type="button" 
                        className="pjm-btn-submit" 
                        onClick={() => {
                            onClose();
                            onEdit(interview);
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '5px' }}>edit</span>
                        Chỉnh sửa lịch hẹn
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                .detail-value-box {
                    padding: 12px 16px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    color: #1e293b;
                    font-size: 0.95rem;
                }
                .detail-value-box.highlighted {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                    font-weight: 500;
                }
                .detail-value-box.multiline {
                    min-height: 80px;
                    white-space: pre-line;
                }
                .btn-edit-modal:hover {
                    background: #e2e8f0 !important;
                    color: var(--primary-color) !important;
                    transform: scale(1.1);
                }
                .pjm-section-title span {
                    font-size: 20px;
                }
            `}</style>
        </div>
    );
};

export default InterviewDetailModal;
