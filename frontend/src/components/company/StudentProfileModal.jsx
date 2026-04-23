import React from 'react';
import '../../assets/css/company/StudentProfileModal.css';

const StudentProfileModal = ({ show, candidate, onClose }) => {
    if (!show || !candidate) return null;

    const initials = (candidate.fullName || '?')
        .split(' ')
        .map(w => w[0])
        .slice(-2)
        .join('')
        .toUpperCase();

    const gpa = candidate.gpa ? parseFloat(candidate.gpa).toFixed(2) : '—';

    return (
        <div className="spm-overlay" onClick={onClose}>
            <div className="spm-container" onClick={e => e.stopPropagation()}>

                {/* Title bar */}
                <div className="spm-titlebar">
                    <span>Chi tiết hồ sơ sinh viên</span>
                    <button className="spm-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="spm-scroll">
                    {/* ── BANNER + AVATAR ── */}
                    <div className="spm-banner-wrap">
                        {candidate.bannerUrl ? (
                            <img src={candidate.bannerUrl} alt="banner" className="spm-banner-img" />
                        ) : (
                            <div className="spm-banner-gradient" />
                        )}
                    </div>

                    <div className="spm-profile-header">
                        <div className="spm-avatar-area">
                            {candidate.avatarUrl ? (
                                <img src={candidate.avatarUrl} alt={candidate.fullName} className="spm-avatar" />
                            ) : (
                                <div className="spm-avatar-placeholder">{initials}</div>
                            )}
                        </div>

                        <div className="spm-header-info">
                            <div className="spm-name-row">
                                <h2 className="spm-name">{candidate.fullName}</h2>
                                {candidate.studentCode && (
                                    <span className="spm-student-code">MSSV: {candidate.studentCode}</span>
                                )}
                                {candidate.major && (
                                    <span className="spm-major-tag">{candidate.major}</span>
                                )}
                            </div>
                            <div className="spm-location-row">
                                {candidate.university && (
                                    <span className="spm-loc-tag">
                                        🏫 {candidate.university}
                                    </span>
                                )}
                                {candidate.location && (
                                    <span className="spm-loc-tag">
                                        📍 {candidate.location}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="spm-stats-row">
                            <div className="spm-stat-box">
                                <span className="spm-stat-value">{gpa}</span>
                                <span className="spm-stat-label">GPA</span>
                            </div>
                            <div className="spm-stat-box">
                                <span className="spm-stat-value">
                                    {candidate.educations?.length ?? candidate.certifications?.length ?? 0}
                                </span>
                                <span className="spm-stat-label">Bằng cấp</span>
                            </div>
                            <div className="spm-stat-box">
                                <span className="spm-stat-value">
                                    {candidate.projects?.length ?? 0}
                                </span>
                                <span className="spm-stat-label">Dự án</span>
                            </div>
                        </div>
                    </div>

                    {/* ── BODY: 2 columns ── */}
                    <div className="spm-body">

                        {/* CỘT TRÁI */}
                        <div className="spm-col-left">
                            <div className="spm-card">
                                <p className="spm-card-title">Thông tin chung</p>
                                <div className="spm-bio-box">
                                    {candidate.bio
                                        ? <div dangerouslySetInnerHTML={{ __html: candidate.bio }} />
                                        : <p className="spm-empty">Sinh viên chưa cập nhật thông tin chung.</p>
                                    }
                                </div>
                            </div>

                            {/* Học vấn */}
                            {candidate.educations?.length > 0 && (
                                <div className="spm-card">
                                    <p className="spm-card-title">Học vấn</p>
                                    <div className="spm-timeline">
                                        {candidate.educations.map((edu, i) => (
                                            <div key={i} className="spm-timeline-item">
                                                <div className="spm-timeline-dot" />
                                                <div className="spm-timeline-content">
                                                    <p className="spm-tl-school">{edu.schoolName}</p>
                                                    <p className="spm-tl-sub">{edu.degree} – {edu.major}</p>
                                                    <p className="spm-tl-date">
                                                        {edu.startDate} – {edu.endDate || 'Hiện tại'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Kinh nghiệm */}
                            {candidate.experiences?.length > 0 && (
                                <div className="spm-card">
                                    <p className="spm-card-title">Kinh nghiệm làm việc</p>
                                    <div className="spm-timeline">
                                        {candidate.experiences.map((exp, i) => (
                                            <div key={i} className="spm-timeline-item">
                                                <div className="spm-timeline-dot" />
                                                <div className="spm-timeline-content">
                                                    <p className="spm-tl-school">{exp.jobTitle}</p>
                                                    <p className="spm-tl-sub">{exp.companyName}</p>
                                                    <p className="spm-tl-date">
                                                        {exp.startDate} – {exp.endDate || 'Hiện tại'}
                                                    </p>
                                                    {exp.description && (
                                                        <div className="spm-tl-desc" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CỘT PHẢI */}
                        <div className="spm-col-right">

                            {/* Thông tin liên hệ */}
                            <div className="spm-card">
                                <p className="spm-card-title">Thông tin liên hệ</p>
                                <ul className="spm-contact-list">
                                    {candidate.email && (
                                        <li>
                                            <span className="spm-contact-icon">✉️</span>
                                            <span>{candidate.email}</span>
                                        </li>
                                    )}
                                    {candidate.phone && (
                                        <li>
                                            <span className="spm-contact-icon">📞</span>
                                            <span>{candidate.phone}</span>
                                        </li>
                                    )}
                                    {candidate.address && (
                                        <li>
                                            <span className="spm-contact-icon">📌</span>
                                            <span>{candidate.address}</span>
                                        </li>
                                    )}
                                    {candidate.website && (
                                        <li>
                                            <span className="spm-contact-icon">🔗</span>
                                            <a href={candidate.website} target="_blank" rel="noreferrer">
                                                {candidate.website}
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Kỹ năng */}
                            {candidate.skills?.length > 0 && (
                                <div className="spm-card">
                                    <p className="spm-card-title">Kỹ năng nổi bật</p>
                                    <div className="spm-skill-tags">
                                        {candidate.skills.map((s, i) => (
                                            <span key={i} className="spm-skill-tag">
                                                ✦ {typeof s === 'string' ? s : s.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chứng chỉ */}
                            {candidate.certifications?.length > 0 && (
                                <div className="spm-card">
                                    <p className="spm-card-title">Bộ sưu tập ảnh (PDF)</p>
                                    <div className="spm-cert-list">
                                        {candidate.certifications.map((cert, i) => (
                                            <div key={i} className="spm-cert-item">
                                                <span className="spm-cert-icon">📄</span>
                                                <div>
                                                    <p className="spm-cert-name">{cert.name}</p>
                                                    {cert.issuedBy && (
                                                        <p className="spm-cert-issuer">{cert.issuedBy}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dự án */}
                            {candidate.projects?.length > 0 && (
                                <div className="spm-card">
                                    <p className="spm-card-title">Dự án</p>
                                    <div className="spm-project-list">
                                        {candidate.projects.map((pj, i) => (
                                            <div key={i} className="spm-project-item">
                                                <div className="spm-project-header">
                                                    <p className="spm-project-name">{pj.name}</p>
                                                    <div className="spm-project-links">
                                                        {pj.repositoryUrl && (
                                                            <a href={pj.repositoryUrl} target="_blank" rel="noreferrer">Repo</a>
                                                        )}
                                                        {pj.demoUrl && (
                                                            <a href={pj.demoUrl} target="_blank" rel="noreferrer">Demo</a>
                                                        )}
                                                    </div>
                                                </div>
                                                {pj.description && (
                                                    <div className="spm-project-desc" dangerouslySetInnerHTML={{ __html: pj.description }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileModal;
