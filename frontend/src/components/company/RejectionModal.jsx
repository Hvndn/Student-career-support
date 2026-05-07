import React, { useState } from 'react';
import '../../assets/css/company/RejectionModal.css';

/**
 * Premium Modal for entering rejection reason.
 */
const RejectionModal = ({ show, onClose, onConfirm, studentName }) => {
    const [reason, setReason] = useState('');

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // [FE Logic] Gửi lý do từ chối về component cha (CompanyCandidates.jsx hoặc CandidateDetailModal.jsx) 
        // Sau đó sẽ gọi API [BE] RecruitmentRestController.updateApplicationStatus()
        onConfirm(reason);
        setReason(''); // Reset
    };

    return (
        <div className="rm-overlay" onClick={onClose}>
            <div className="rm-container glass fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="rm-header">
                    <div className="rm-icon-box">
                        <span className="material-symbols-outlined">cancel</span>
                    </div>
                    <div className="rm-title-wrap">
                        <h3>Từ chối ứng viên</h3>
                        <p>Ứng viên: <strong>{studentName}</strong></p>
                    </div>
                    <button className="rm-close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="rm-body">
                    <div className="rm-input-group">
                        <label>Lý do từ chối hoặc lời nhắn (Tùy chọn)</label>
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do"
                            rows="5"
                            autoFocus
                        ></textarea>
                        <p className="rm-hint">Lời nhắn này sẽ được gửi trực tiếp đến ứng viên qua thông báo hệ thống.</p>
                    </div>

                    <div className="rm-footer">
                        <button type="button" className="btn-rm-cancel" onClick={onClose}>Hủy bỏ</button>
                        <button type="submit" className="btn-rm-confirm">Xác nhận từ chối</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RejectionModal;
