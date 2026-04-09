import React, { useState, useEffect } from 'react';
import { companyApi } from '../../api';
import toast from 'react-hot-toast';
import { tagService } from '../../utils/tagService';
import { recruitmentApi } from '../../api';
import '../../assets/css/company/CandidateDetailModal.css';

const CandidateDetailModal = ({ show, studentId, applicationId, initialStatus, onClose, onStatusUpdate }) => {
    const [candidate, setCandidate] = useState(null);
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [candidateTagIds, setCandidateTagIds] = useState([]);

    useEffect(() => {
        if (show && studentId) {
            fetchDetail();
            loadTags();
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
            console.error("Lỗi khi lấy chi tiết ứng viên:", error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const loadTags = () => {
        const tags = tagService.getTags();
        setAllTags(tags);
        const mappings = tagService.getAllMappings();
        setCandidateTagIds(mappings[studentId] || []);
    };

    const handleToggleTag = (tagId) => {
        tagService.toggleTag(studentId, tagId);
        // Cập nhật state local để UI phản hồi ngay lập tức
        setCandidateTagIds(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            } else {
                return [...prev, tagId];
            }
        });
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!applicationId || updatingStatus) return;
        setUpdatingStatus(true);
        try {
            const res = await recruitmentApi.updateStatus(applicationId, newStatus);
            if (res.data.status === 'success') {
                setStatus(newStatus);
                if (newStatus === 'suitable') {
                    toast.success("Đã duyệt ứng viên");
                } else if (newStatus === 'pending') {
                    toast.success("Đã hoàn tác trạng thái ứng viên");
                } else {
                    toast.success(`Đã chuyển ứng viên sang trạng thái ${getStatusLabel(newStatus)}`);
                }
                if (onStatusUpdate) onStatusUpdate(newStatus);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
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
        } catch (error) {
            console.error("Lỗi khi tải CV:", error);
            toast.error("Không thể tải CV. Vui lòng thử lại.");
        } finally {
            setDownloading(false);
        }
    };

    const getStatusLabel = (s) => {
        const labels = {
            'pending': 'Chờ đánh giá',
            'review': 'Đang xem xét',
            'suitable': 'Đã duyệt',
            'interview': 'Phỏng vấn',
            'accepted': 'Đã nhận',
            'rejected': 'Từ chối'
        };
        return labels[s?.toLowerCase()] || s;
    };

    if (!show) return null;

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            <div className="detail-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {loading ? (
                    <div className="detail-loading">
                        <div className="spinner"></div>
                        <p>Đang triệu hồi hồ sơ...</p>
                    </div>
                ) : candidate ? (
                    <div className="detail-content">
                        <div className="detail-header">
                            <div className="header-info">
                                <div className="detail-avatar-wrapper">
                                    <img src={candidate.avatarUrl || `https://ui-avatars.com/api/?name=${candidate.fullName}&background=random`} alt={candidate.fullName} className="detail-avatar" />
                                </div>
                                <div className="header-text">
                                    <p className="detail-major">{candidate.major}</p>
                                    <h2>{candidate.fullName}</h2>
                                    <div className="detail-meta">
                                        <span><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="12" r="3" /></svg> {candidate.location || 'Toàn quốc'}</span>
                                        <span><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg> {candidate.university}</span>
                                    </div>

                                    {/* Tag Selector Section */}
                                    <div className="candidate-tag-selector">
                                        <label>Phân loại ứng viên</label>
                                        <div className="tag-pills">
                                            {allTags.map(tag => {
                                                const isActive = candidateTagIds.includes(tag.id);
                                                return (
                                                    <div 
                                                        key={tag.id}
                                                        className={`tag-pill ${isActive ? 'active' : 'inactive'}`}
                                                        style={isActive ? { backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}40` } : {}}
                                                        onClick={() => handleToggleTag(tag.id)}
                                                    >
                                                        {isActive && (
                                                            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                        {tag.name}
                                                    </div>
                                                );
                                            })}
                                            {allTags.length === 0 && <span className="empty-text">Chưa có thẻ nào.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="header-right-actions">
                                {applicationId && (
                                    <div className="status-updater">
                                        <label>Trạng thái hồ sơ</label>
                                        <div className="status-options">
                                            {['pending', 'suitable', 'interview', 'accepted', 'rejected'].map(s => (
                                                <button 
                                                    key={s}
                                                    className={`status-opt ${status?.toLowerCase() === s ? 'active' : ''} ${s}`}
                                                    onClick={() => handleUpdateStatus(s)}
                                                    disabled={updatingStatus}
                                                >
                                                    {getStatusLabel(s)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button className="btn-download-cv" onClick={handleDownloadCV} disabled={downloading}>
                                    {downloading ? 'Đang chuẩn bị...' : (
                                        <>
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v4a2 2 0 012-2h14a2 2 0 012 2zM7 10l5 5 5-5M12 15V3" /></svg>
                                            Tải CV (PDF)
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="detail-body">
                            <section className="detail-section">
                                <h3>Giới thiệu</h3>
                                <p>{candidate.bio || 'Chưa có thông tin giới thiệu.'}</p>
                            </section>

                            <section className="detail-section">
                                <h3>Học vấn</h3>
                                {candidate.educations?.length > 0 ? (
                                    <div className="timeline">
                                        {candidate.educations.map((edu, idx) => (
                                            <div key={idx} className="timeline-item">
                                                <div className="timeline-point"></div>
                                                <div className="timeline-content">
                                                    <h4>{edu.schoolName}</h4>
                                                    <p className="timeline-sub">{edu.degree} - {edu.major}</p>
                                                    <p className="timeline-date">{edu.startDate} - {edu.endDate || 'Hiện tại'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="empty-text">Chưa cập nhật học vấn.</p>}
                            </section>

                            <section className="detail-section">
                                <h3>Kinh nghiệm</h3>
                                {candidate.experiences?.length > 0 ? (
                                    <div className="timeline">
                                        {candidate.experiences.map((exp, idx) => (
                                            <div key={idx} className="timeline-item">
                                                <div className="timeline-point"></div>
                                                <div className="timeline-content">
                                                    <h4>{exp.jobTitle}</h4>
                                                    <p className="timeline-sub">{exp.companyName}</p>
                                                    <p className="timeline-date">{exp.startDate} - {exp.endDate || 'Hiện tại'}</p>
                                                    <p className="timeline-desc">{exp.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="empty-text">Chưa cập nhật kinh nghiệm.</p>}
                            </section>

                            <section className="detail-section">
                                <h3>Kỹ năng</h3>
                                <div className="detail-tags">
                                    {candidate.skills?.map((skill, idx) => (
                                        <span key={idx} className="detail-tag">{skill.name} • {skill.level}</span>
                                    ))}
                                    {(!candidate.skills || candidate.skills.length === 0) && <p className="empty-text">Chưa cập nhật kỹ năng.</p>}
                                </div>
                            </section>

                            {candidate.projects?.length > 0 && (
                                <section className="detail-section">
                                    <h3>Dự án tiêu biểu</h3>
                                    <div className="project-grid-modal">
                                        {candidate.projects.map((pj, idx) => (
                                            <div key={idx} className="project-card-modal">
                                                <h4>{pj.name}</h4>
                                                <p>{pj.description}</p>
                                                <div className="project-links">
                                                    {pj.repositoryUrl && <a href={pj.repositoryUrl} target="_blank" rel="noreferrer">Repo</a>}
                                                    {pj.demoUrl && <a href={pj.demoUrl} target="_blank" rel="noreferrer">Demo</a>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CandidateDetailModal;
