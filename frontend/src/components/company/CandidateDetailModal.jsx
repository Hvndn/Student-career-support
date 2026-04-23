import React, { useState, useEffect } from 'react';
import { companyApi, recruitmentApi } from '../../api';
import toast from 'react-hot-toast';
import { tagService } from '../../utils/tagService';
import StudentProfileModal from './StudentProfileModal';
import '../../assets/css/company/CandidateDetailModal.css';

const STATUS_CONFIG = {
    pending: { label: 'Chờ duyệt', className: 'status-pending' },
    review: { label: 'Đang xem xét', className: 'status-review' },
    suitable: { label: 'Đã duyệt', className: 'status-suitable' },
    interview: { label: 'Phỏng vấn', className: 'status-interview' },
    accepted: { label: 'Đã nhận', className: 'status-accepted' },
    rejected: { label: 'Từ chối', className: 'status-rejected' },
};

const CandidateDetailModal = ({
    show,
    studentId,
    applicationId,
    initialStatus,
    jobTitle,
    jobType,
    jobLocation,
    appliedAt,
    coverLetter,
    cvFileName,
    onClose,
    onStatusUpdate
}) => {
    const [candidate, setCandidate] = useState(null);
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [candidateTagIds, setCandidateTagIds] = useState([]);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        if (show && studentId) {
            fetchDetail();
            const tags = tagService.getTags();
            setAllTags(tags);
            const mappings = tagService.getAllMappings();
            setCandidateTagIds(mappings[studentId] || []);
            setStatus(initialStatus);
        } else {
            setCandidate(null);
        }
    }, [show, studentId, initialStatus]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const { data } = await companyApi.getCandidateDetail(studentId);
            setCandidate(data.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết ứng viên:', error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTag = (tagId) => {
        tagService.toggleTag(studentId, tagId);
        setCandidateTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!applicationId || updatingStatus || status === newStatus) return;
        setUpdatingStatus(true);
        try {
            const res = await recruitmentApi.updateStatus(applicationId, newStatus);
            if (res.data.status === 'success') {
                setStatus(newStatus);
                toast.success(`Đã cập nhật trạng thái: ${STATUS_CONFIG[newStatus]?.label}`);
                if (onStatusUpdate) onStatusUpdate(newStatus);
            }
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDownloadCV = async () => {
        setDownloading(true);
        try {
            const response = await companyApi.downloadCv(studentId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `CV_${candidate?.fullName || 'Candidate'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Tải CV thành công!');
        } catch (error) {
            toast.error('Không thể tải CV. Vui lòng thử lại.');
        } finally {
            setDownloading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Không rõ';
        try {
            const d = new Date(dateStr);
            return `Nộp lúc ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        } catch { return dateStr; }
    };

    const currentStatusConfig = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

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
                                    <img src={candidate.avatarUrl} alt={candidate?.fullName} className="cdm-avatar" />
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
                                    <span className="cdm-applied-date">{formatDate(appliedAt)}</span>
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
                                            <span className="cdm-info-icon cdm-icon-email">✉</span>
                                            <span>{candidate.email || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <span className="cdm-info-icon cdm-icon-phone">📞</span>
                                            <span>{candidate.phone || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <span className="cdm-info-icon cdm-icon-major">🎓</span>
                                            <span>{candidate.major || 'Chưa cập nhật'}</span>
                                        </li>
                                        <li>
                                            <span className="cdm-info-icon cdm-icon-id">🪪</span>
                                            <span>{candidate.studentCode || 'Chưa cập nhật'}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Phân loại ứng viên */}
                                {allTags.length > 0 && (
                                    <div className="cdm-section">
                                        <p className="cdm-section-title">Phân loại ứng viên</p>
                                        <div className="cdm-tag-pills">
                                            {allTags.map(tag => {
                                                const isActive = candidateTagIds.includes(tag.id);
                                                return (
                                                    <button
                                                        key={tag.id}
                                                        className={`cdm-tag-pill ${isActive ? 'active' : ''}`}
                                                        style={isActive ? { background: `${tag.color}18`, color: tag.color, borderColor: `${tag.color}50` } : {}}
                                                        onClick={() => handleToggleTag(tag.id)}
                                                    >
                                                        {tag.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Tệp đính kèm */}
                                <div className="cdm-section">
                                    <p className="cdm-section-title">Tệp đính kèm</p>
                                    <div className="cdm-attachment" onClick={handleDownloadCV}>
                                        <span className="cdm-attachment-icon">📄</span>
                                        <div className="cdm-attachment-info">
                                            <span className="cdm-attachment-name">
                                                {cvFileName || `CV_${candidate.fullName}.pdf`}
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
                                        {coverLetter
                                            ? <p>{coverLetter}</p>
                                            : <p className="cdm-placeholder">Ứng viên không để lại thư giới thiệu.</p>
                                        }
                                    </div>
                                </div>

                                {/* Vị trí ứng tuyển */}
                                <div className="cdm-section">
                                    <p className="cdm-section-title">Vị trí ứng tuyển</p>
                                    <p className="cdm-job-title">{jobTitle || 'Không xác định'}</p>
                                    <div className="cdm-job-tags">
                                        {jobType && <span className="cdm-job-tag">{jobType}</span>}
                                        {(jobLocation || candidate.location) && (
                                            <span className="cdm-job-tag">📍 {jobLocation || candidate.location}</span>
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
                                                { key: 'interview', label: 'Hẹn phỏng vấn' },
                                                { key: 'accepted', label: 'Chấp nhận' },
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
