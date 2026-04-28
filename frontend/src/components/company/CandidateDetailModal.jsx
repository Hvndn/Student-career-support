import React, { useState, useEffect } from 'react';
import { recruitmentApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import StudentProfileModal from './StudentProfileModal';
import '../../assets/css/company/CandidateDetailModal.css';

const CandidateDetailModal = ({ 
    show, 
    applicationId, 
    onClose, 
    onStatusUpdate,
    // Các prop truyền từ list để hiển thị nhanh
    initialStatus,
    jobTitle: initialJobTitle,
    jobType: initialJobType,
    jobLocation: initialJobLocation,
    appliedAt: initialAppliedAt,
    coverLetter: initialCoverLetter,
    cvFileName: initialCvFileName,
    cvUrl: initialCvUrl
}) => {
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(initialStatus || '');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (show && applicationId) {
            fetchDetail();
        }
    }, [show, applicationId]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await recruitmentApi.getCandidateDetail(applicationId);
            if (res.data.status === 'success') {
                setCandidate(res.data.data);
                // Nếu API trả về status mới nhất thì cập nhật
                if (res.data.data.applicationStatus) {
                    setStatus(res.data.data.applicationStatus);
                }
            }
        } catch (error) {
            console.error("Error fetching candidate detail:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            const res = await recruitmentApi.updateStatus(applicationId, newStatus);
            if (res.data.status === 'success') {
                setStatus(newStatus);
                if (onStatusUpdate) onStatusUpdate(newStatus);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdatingStatus(false);
        }
    };


    const handleDownloadCV = async () => {
        const urlToDownload = initialCvUrl || candidate?.cvUrl;
        if (!urlToDownload) return;
        
        try {
            setDownloading(true);
            const response = await fetch(getImageUrl(urlToDownload));
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', initialCvFileName || `CV_${candidate?.fullName || 'Candidate'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading CV:", error);
        } finally {
            setDownloading(false);
        }
    };

    const getStatusConfig = (s) => {
        const lowerS = (s || '').toLowerCase();
        switch (lowerS) {
            case 'pending': return { label: 'Chờ duyệt', className: 'status-applied' };
            case 'interview': return { label: 'Phỏng vấn', className: 'status-interviewing' };
            case 'review': return { label: 'Theo dõi thêm', className: 'status-review' };
            case 'rejected': return { label: 'Từ chối', className: 'status-rejected' };
            default: return { label: 'Chờ xử lý', className: 'status-applied' };
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const currentStatusConfig = getStatusConfig(status);

    if (!show) return null;

    return (
        <>
            <div className="cdm-overlay" onClick={onClose}>
                <div className="cdm-container" onClick={e => e.stopPropagation()}>

                    {/* ── HEADER ── */}
                    <div className="cdm-header">
                        <div className="cdm-header-left">
                            <div className="cdm-avatar-wrap">
                                {loading ? (
                                    <div className="cdm-avatar-placeholder">...</div>
                                ) : candidate?.avatarUrl ? (
                                    <img src={getImageUrl(candidate.avatarUrl)} alt={candidate?.fullName} className="cdm-avatar" />
                                ) : (
                                    <div className="cdm-avatar-placeholder">
                                        {String(candidate?.fullName || '?').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="cdm-header-info">
                                <h2 className="cdm-name">{candidate?.fullName || '...'}</h2>
                                <div className="cdm-meta-row">
                                    <span className={`cdm-status-badge ${currentStatusConfig.className}`}>
                                        {currentStatusConfig.label}
                                    </span>
                                    <span className="cdm-applied-date">{formatDate(initialAppliedAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="cdm-header-right">
                            <button
                                className="cdm-btn-view-profile"
                                onClick={() => setShowProfile(true)}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Xem hồ sơ sinh viên
                            </button>
                        </div>
                    </div>

                    {/* ── BODY ── */}
                    {loading ? (
                        <div className="cdm-loading">
                            <div className="cdm-spinner" />
                            <p>Đang tải thông tin...</p>
                        </div>
                    ) : candidate ? (
                        <div className="cdm-body">

                            {/* ── CỘT TRÁI ── */}
                            <div className="cdm-col-left">

                                {/* Thông tin sinh viên */}
                                <div className="cdm-section">
                                    <p className="cdm-section-title">Thông tin sinh viên</p>
                                    <ul className="cdm-info-list">
                                        <li>
                                            <span className="cdm-info-icon">✉</span>
                                            <span>{candidate.email || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <span className="cdm-info-icon">📞</span>
                                            <span>{candidate.phone || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <span className="cdm-info-icon">🎓</span>
                                            <span>{candidate.major || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <span className="cdm-info-icon">🪪</span>
                                            <span>{candidate.studentIdStr || 'Chưa cập nhật'}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Tệp đính kèm */}
                                <div className="cdm-section">
                                    <p className="cdm-section-title">Tệp đính kèm</p>
                                    <div className="cdm-attachment" onClick={handleDownloadCV}>
                                        <span className="cdm-attachment-icon">📄</span>
                                        <div className="cdm-attachment-info">
                                            <span className="cdm-attachment-name">
                                                {initialCvFileName || `CV_${candidate.fullName}.pdf`}
                                            </span>
                                            <span className="cdm-attachment-action">
                                                {downloading ? 'Đang tải...' : '↓ Tải xuống'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── CỘT PHẢI ── */}
                            <div className="cdm-col-right">

                                {/* Thư giới thiệu */}
                                <div className="cdm-section">
                                    <p className="cdm-section-title">Thư giới thiệu</p>
                                    <div className="cdm-cover-letter">
                                        {initialCoverLetter
                                            ? <p>{initialCoverLetter}</p>
                                            : <p className="cdm-placeholder">Ứng viên không để lại thư giới thiệu.</p>
                                        }
                                    </div>
                                </div>

                                {/* Vị trí ứng tuyển */}
                                <div className="cdm-section">
                                    <p className="cdm-section-title">Vị trí ứng tuyển</p>
                                    <p className="cdm-job-title">{initialJobTitle || 'Không xác định'}</p>
                                    <div className="cdm-job-tags">
                                        {initialJobType && <span className="cdm-job-tag">{initialJobType}</span>}
                                        {(initialJobLocation || candidate.location) && (
                                            <span className="cdm-job-tag">📍 {initialJobLocation || candidate.location}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Cập nhật trạng thái */}
                                {applicationId && (
                                    <div className="cdm-section">
                                        <div className="cdm-status-update-header">
                                            <p className="cdm-section-title">Cập nhật trạng thái</p>
                                            <span className={`cdm-current-badge ${currentStatusConfig.className}`}>
                                                Hiện tại: {currentStatusConfig.label}
                                            </span>
                                        </div>
                                        <div className="cdm-status-radios">
                                            {[
                                                { key: 'review', label: 'Theo dõi thêm' },
                                                { key: 'interview', label: 'Hẹn phỏng vấn' },
                                                { key: 'rejected', label: 'Từ chối' },
                                            ].map(opt => (
                                                <label key={opt.key} className={`cdm-radio-label ${opt.key}`}>
                                                    <input
                                                        type="radio"
                                                        name="appStatus"
                                                        value={opt.key}
                                                        checked={status?.toLowerCase() === opt.key}
                                                        onChange={() => handleUpdateStatus(opt.key)}
                                                        disabled={updatingStatus}
                                                    />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* ── FOOTER ── */}
                    <div className="cdm-footer">
                        <button className="cdm-btn-close" onClick={onClose}>Đóng</button>
                    </div>
                </div>
            </div>

            {/* Student Full Profile Modal */}
            <StudentProfileModal
                show={showProfile}
                candidate={candidate}
                onClose={() => setShowProfile(false)}
            />
        </>
    );
};

export default CandidateDetailModal;
