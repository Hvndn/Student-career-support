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
        if (newStatus === status) return;
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
            case 'pending': return { label: 'Chờ xử lý', className: 'status-applied' };
            case 'interview': return { label: 'Lên lịch phỏng vấn', className: 'status-interviewing' };
            case 'interviewing': return { label: 'Đang phỏng vấn', className: 'status-interviewing' };
            case 'passed': return { label: 'Vượt phỏng vấn', className: 'status-passed' };
            case 'hired': return { label: 'Đã tuyển', className: 'status-hired' };
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
            <div className="cdm-overlay">
                <div className="cdm-container">

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
                                    <span className="cdm-applied-date">
                                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>calendar_today</span>
                                        {formatDate(initialAppliedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="cdm-header-right">
                            <button
                                className="cdm-btn-view-profile"
                                onClick={() => setShowProfile(true)}
                                title="Xem hồ sơ ứng viên"
                            >
                                <span className="material-symbols-outlined">person_search</span>
                                Xem hồ sơ sinh viên
                            </button>
                        </div>
                    </div>

                    {/* ── BODY ── */}
                    {loading ? (
                        <div className="cdm-loading">
                            <div className="cdm-spinner" />
                            <p>Đang tải thông tin ứng viên...</p>
                        </div>
                    ) : candidate ? (
                        <div className="cdm-body">

                            {/* ── CỘT TRÁI (LEFT) ── */}
                            <div className="cdm-col-left">

                                {/* Thông tin sinh viên */}
                                <div className="cdm-section">
                                    <h3 className="cdm-section-title">
                                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>contact_page</span>
                                        Thông tin sinh viên
                                    </h3>
                                    <ul className="cdm-info-list">
                                        <li>
                                            <div className="cdm-info-icon"><span className="material-symbols-outlined">mail</span></div>
                                            <span style={{alignSelf: 'center'}}>{candidate.email || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <div className="cdm-info-icon"><span className="material-symbols-outlined">call</span></div>
                                            <span style={{alignSelf: 'center'}}>{candidate.phone || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <div className="cdm-info-icon"><span className="material-symbols-outlined">school</span></div>
                                            <span style={{alignSelf: 'center'}}>{candidate.major || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <div className="cdm-info-icon"><span className="material-symbols-outlined">badge</span></div>
                                            <span style={{alignSelf: 'center'}}>{candidate.studentIdStr || 'Chưa cập nhật'}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Tệp đính kèm */}
                                <div className="cdm-section">
                                    <h3 className="cdm-section-title">
                                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>attach_file</span>
                                        Tệp đính kèm
                                    </h3>
                                    <div className="cdm-attachment" onClick={handleDownloadCV}>
                                        <div className="cdm-attachment-left">
                                            <span className="material-symbols-outlined cdm-attachment-icon">picture_as_pdf</span>
                                            <div className="cdm-attachment-info">
                                                <span className="cdm-attachment-name">
                                                    {initialCvFileName || `CV_${candidate.fullName}.pdf`}
                                                </span>
                                                <span style={{fontSize: '0.75rem', color: '#94a3b8'}}>Tài liệu PDF</span>
                                            </div>
                                        </div>
                                        <div className="cdm-attachment-action" title="Tải xuống CV">
                                            {downloading ? (
                                                <span className="material-symbols-outlined" style={{fontSize: '16px', animation: 'cdm-spin 1s linear infinite'}}>sync</span>
                                            ) : (
                                                <span className="material-symbols-outlined" style={{fontSize: '18px'}}>download</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── CỘT PHẢI (RIGHT) ── */}
                            <div className="cdm-col-right">

                                {/* Thư giới thiệu */}
                                <div className="cdm-section">
                                    <h3 className="cdm-section-title">
                                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>chat</span>
                                        Thư giới thiệu
                                    </h3>
                                    <div className="cdm-cover-letter">
                                        {initialCoverLetter
                                            ? <p style={{margin: 0}}>{initialCoverLetter}</p>
                                            : <p className="cdm-placeholder">Ứng viên không để lại thư giới thiệu.</p>
                                        }
                                    </div>
                                </div>

                                {/* Vị trí ứng tuyển */}
                                <div className="cdm-section">
                                    <h3 className="cdm-section-title">
                                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>work</span>
                                        Vị trí ứng tuyển
                                    </h3>
                                    <p className="cdm-job-title">{initialJobTitle || 'Không xác định'}</p>
                                    <div className="cdm-job-tags">
                                        {initialJobType && <span className="cdm-job-tag">{initialJobType}</span>}
                                        {(initialJobLocation || candidate.location) && (
                                            <span className="cdm-job-tag">
                                                <span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'middle', marginRight: '4px'}}>location_on</span>
                                                {initialJobLocation || candidate.location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Cập nhật trạng thái */}
                                {applicationId && (
                                    <div className="cdm-section">
                                        <div className="cdm-status-update-header">
                                            <h3 className="cdm-section-title">
                                                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>update</span>
                                                Cập nhật trạng thái
                                            </h3>
                                            <span className={`cdm-current-badge ${currentStatusConfig.className}`}>
                                                ĐANG CHỌN: {currentStatusConfig.label}
                                            </span>
                                        </div>
                                        
                                        <div className="cdm-status-radios">
                                            {[
                                                { key: 'pending', label: 'Chờ xử lý' },
                                                { key: 'interview', label: 'Hẹn phỏng vấn' },
                                                { key: 'passed', label: 'Vượt phỏng vấn' },
                                                { key: 'hired', label: 'Đã tuyển (Hired)' },
                                                { key: 'rejected', label: 'Từ chối' },
                                                { key: 'review', label: 'Theo dõi thêm' },
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
