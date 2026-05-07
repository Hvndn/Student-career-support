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
            case 'no_show': return { text: 'No-show', class: 'status-no-show' };
            case 'confirmed': return { text: 'Đã xác nhận', class: 'status-confirmed' };
            default: return { text: status, class: '' };
        }
    };

    const getRecommendationBadge = (rec) => {
        switch (rec) {
            case 'PASS': return { text: 'Pass', color: '#065f46', bg: '#d1fae5' };
            case 'FAIL': return { text: 'Fail', color: '#991b1b', bg: '#fee2e2' };
            case 'CONSIDER': return { text: 'Consider', color: '#854d0e', bg: '#fef9c3' };
            default: return null;
        }
    };

    const statusInfo = getStatusLabel(interview.status);
    const recBadge = getRecommendationBadge(interview.recommendation);

    return (
        <div className="pjm-overlay" onClick={onClose}>
            <div className="pjm-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
                <div className="pjm-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>event_note</span> 
                        Chi tiết lịch phỏng vấn
                    </h2>
                    <button className="btn-close-modal" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="pjm-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">person</span> Thông tin ứng viên
                        </div>
                        
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Vị trí tuyển dụng</label>
                                <div className="detail-value-box" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                                    {interview.jobTitle}
                                </div>
                            </div>
                            <div className="pjm-field">
                                <label>Giai đoạn (Stage)</label>
                                <div className="detail-value-box" style={{ fontWeight: '500' }}>
                                    {interview.stageType || 'Chưa phân loại'}
                                </div>
                            </div>
                        </div>

                        <div className="pjm-field" style={{ marginTop: '1rem' }}>
                            <label>Họ tên ứng viên</label>
                            <div className="detail-value-box">{interview.studentName}</div>
                        </div>
                    </div>

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
                                <label>Hình thức</label>
                                <div className="detail-value-box">
                                    {interview.interviewFormat === 'Trực tuyến' ? '💻 Trực tuyến (Online)' : '📍 Trực tiếp (Offline)'}
                                </div>
                            </div>
                        </div>
                        <div className="pjm-field">
                            <label>{interview.interviewFormat === 'Trực tuyến' ? '🔗 Link họp' : '📍 Địa điểm'}</label>
                            <div className="detail-value-box highlighted">
                                {interview.location || 'Chưa cập nhật'}
                            </div>
                        </div>
                    </div>

                    {interview.overallScore > 0 && (
                        <div className="pjm-section ats-eval-section" style={{ border: '2px solid #3b82f6', borderRadius: '12px', padding: '15px', background: 'rgba(59, 130, 246, 0.02)' }}>
                            {/* [FE Logic] Hiển thị kết quả đánh giá chi tiết nếu buổi phỏng vấn đã được hoàn thành và chấm điểm */}
                            <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8' }}>
                                <span className="material-symbols-outlined">analytics</span> Kết quả đánh giá ATS
                            </div>
                            
                            <div className="pjm-row" style={{ marginBottom: '15px' }}>
                                <div className="score-item-box" style={{ background: '#eff6ff' }}>
                                    <span className="label" style={{ color: '#1e40af' }}>Điểm trung bình</span>
                                    <span className="val-score" style={{ color: '#1d4ed8' }}>{interview.overallScore}/10</span>
                                </div>
                                <div className="score-item-box" style={{ background: interview.result === 'PASS' ? '#f0fdf4' : interview.result === 'FAIL' ? '#fef2f2' : '#fef9c3' }}>
                                    <span className="label" style={{ color: '#666' }}>Kết quả</span>
                                    <span className={`val-result ${interview.result?.toLowerCase()}`} style={{ fontSize: '1.2rem' }}>
                                        {interview.result === 'PASS' ? '✅ PASS' : interview.result === 'FAIL' ? '❌ FAIL' : '🤔 CONSIDER'}
                                    </span>
                                </div>
                            </div>

                            <div className="scores-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                                <div className="small-score">
                                    <label>Technical (50%)</label>
                                    <div>{interview.technicalScore}/10</div>
                                </div>
                                <div className="small-score">
                                    <label>Comm. (20%)</label>
                                    <div>{interview.communicationScore}/10</div>
                                </div>
                                <div className="small-score">
                                    <label>Problem (30%)</label>
                                    <div>{interview.problemSolvingScore}/10</div>
                                </div>
                            </div>

                            <div className="pjm-field">
                                <label>Ghi chú đánh giá</label>
                                <div className="detail-value-box" style={{ fontStyle: 'italic', background: '#fff' }}>
                                    {interview.evaluationNotes || 'Không có ghi chú đánh giá.'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pjm-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`status-pill ${statusInfo.class}`} style={{ 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            backgroundColor: interview.status === 'scheduled' ? '#e0f2fe' : interview.status === 'completed' ? '#dcfce7' : '#fee2e2',
                            color: interview.status === 'scheduled' ? '#0369a1' : interview.status === 'completed' ? '#15803d' : '#b91c1c'
                        }}>
                            {statusInfo.text}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" className="pjm-btn-cancel" onClick={onClose}>
                            Đóng
                        </button>
                        {interview.status !== 'completed' && interview.status !== 'cancelled' && (
                            <button 
                                type="button" 
                                className="pjm-btn-submit" 
                                onClick={() => {
                                    onClose();
                                    onEdit(interview);
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '5px' }}>edit</span>
                                Sửa lịch
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .detail-value-box {
                    padding: 10px 14px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    color: #1e293b;
                    font-size: 0.9rem;
                }
                .detail-value-box.highlighted {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                    font-weight: 500;
                }
                .score-item-box {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px;
                    border-radius: 8px;
                }
                .score-item-box .label { font-size: 0.75rem; margin-bottom: 2px; }
                .score-item-box .val-score { font-size: 1.1rem; font-weight: bold; }
                .val-result.pass { color: #15803d; font-weight: bold; }
                .val-result.fail { color: #b91c1c; font-weight: bold; }
                .small-score {
                    text-align: center;
                    padding: 6px;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    font-size: 0.8rem;
                }
                .small-score label { color: #64748b; margin-bottom: 2px; display: block; font-size: 0.7rem; }
                .small-score div { font-weight: 600; }
            `}</style>
        </div>
    );
};

export default InterviewDetailModal;
