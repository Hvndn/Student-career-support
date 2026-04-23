import React from 'react';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/company/StudentProfileModal.css';

const StudentProfileModal = ({ show, candidate, onClose }) => {
    if (!show || !candidate) return null;

    const initials = (candidate.fullName || '?')
        .split(' ')
        .filter(w => w.length > 0)
        .map(w => w[0])
        .slice(-2)
        .join('')
        .toUpperCase() || '?';

    const gpa = candidate.gpa ? parseFloat(candidate.gpa).toFixed(2) : '0.00';

    return (
        <div className="spm-overlay" onClick={onClose}>
            <div className="spm-container" onClick={e => e.stopPropagation()}>
                
                {/* Close Button */}
                <button className="spm-close-btn" onClick={onClose}>✕</button>

                <div className="spm-scroll">
                    {/* ── PREMIUM BANNER ── */}
                    <div className="spm-premium-banner">
                        <div className="spm-banner-overlay"></div>
                        {candidate.coverImageUrl ? (
                            <img src={getImageUrl(candidate.coverImageUrl)} alt="Banner" className="spm-banner-img" />
                        ) : (
                            <div className="spm-banner-gradient" />
                        )}
                    </div>

                    {/* ── MODERN HEADER ── */}
                    <div className="spm-modern-header">
                        <div className="spm-header-left">
                            <div className="spm-avatar-box">
                                {candidate.avatarUrl ? (
                                    <img src={getImageUrl(candidate.avatarUrl)} alt={candidate.fullName} className="spm-avatar-img" />
                                ) : (
                                    <div className="spm-avatar-placeholder">{initials}</div>
                                )}
                            </div>
                            <div className="spm-user-info">
                                <span className="spm-major-tag">{candidate.major || 'Chưa cập nhật'}</span>
                                <h2>{candidate.fullName}</h2>
                                <div className="spm-sub-info">
                                    Lớp: {candidate.academicYear || 'n/a'} &nbsp; - &nbsp; MSSV: {candidate.studentIdStr || 'n/a'}
                                </div>
                            </div>
                        </div>

                        <div className="spm-header-center">
                            <h4>Thông tin liên hệ</h4>
                            <div className="spm-contact-grid">
                                <div className="spm-contact-item">
                                    <div className="spm-contact-icon"><span className="material-symbols-outlined">mail</span></div>
                                    <span>{candidate.email || 'n/a'}</span>
                                </div>
                                <div className="spm-contact-item">
                                    <div className="spm-contact-icon"><span className="material-symbols-outlined">call</span></div>
                                    <span>{candidate.phone || 'n/a'}</span>
                                </div>
                                <div className="spm-contact-item">
                                    <div className="spm-contact-icon"><span className="material-symbols-outlined">location_on</span></div>
                                    <span>{candidate.address || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="spm-header-right">
                            <div className="spm-stat-box">
                                <span className="spm-stat-val">{gpa}</span>
                                <span className="spm-stat-lbl">GPA</span>
                            </div>
                            <div className="spm-stat-box">
                                <span className="spm-stat-val">{candidate.projects?.length || 0}</span>
                                <span className="spm-stat-lbl">DỰ ÁN</span>
                            </div>
                            <div className="spm-stat-box">
                                <span className="spm-stat-val">{candidate.cvData ? 1 : 0}</span>
                                <span className="spm-stat-lbl">CVS</span>
                            </div>
                        </div>
                    </div>

                    {/* ── CONTENT GRID ── */}
                    <div className="spm-content-grid">
                        
                        {/* MAIN COLUMN (LEFT) */}
                        <div className="spm-main-col">
                            
                            {/* Bio */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">badge</span>
                                    Thông tin chung
                                </h3>
                                <div className="spm-bio-content">
                                    {candidate.bio ? (
                                        <div dangerouslySetInnerHTML={{ __html: candidate.bio }} />
                                    ) : (
                                        <p className="spm-text-muted">Sinh viên chưa cập nhật phần giới thiệu.</p>
                                    )}
                                </div>
                            </div>

                            {/* Educations */}
                            {candidate.educations?.length > 0 && (
                                <div className="spm-card">
                                    <h3 className="spm-card-title">
                                        <span className="material-symbols-outlined">school</span>
                                        Học vấn
                                    </h3>
                                    <div className="spm-timeline">
                                        {candidate.educations.map((edu, i) => (
                                            <div key={i} className="spm-timeline-item">
                                                <div className="spm-timeline-dot" />
                                                <p className="spm-tl-title">{edu.schoolName}</p>
                                                <p className="spm-tl-sub">{edu.degree} – {edu.major}</p>
                                                <p className="spm-tl-date">{edu.startDate} – {edu.endDate || 'Hiện tại'}</p>
                                                {edu.description && <div className="spm-tl-desc">{edu.description}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experiences */}
                            {candidate.experiences?.length > 0 && (
                                <div className="spm-card">
                                    <h3 className="spm-card-title">
                                        <span className="material-symbols-outlined">work</span>
                                        Kinh nghiệm làm việc
                                    </h3>
                                    <div className="spm-timeline">
                                        {candidate.experiences.map((exp, i) => (
                                            <div key={i} className="spm-timeline-item">
                                                <div className="spm-timeline-dot" />
                                                <p className="spm-tl-title">{exp.jobTitle}</p>
                                                <p className="spm-tl-sub">{exp.companyName}</p>
                                                <p className="spm-tl-date">{exp.startDate} – {exp.endDate || 'Hiện tại'}</p>
                                                {exp.description && (
                                                    <div className="spm-tl-desc" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SIDEBAR COLUMN (RIGHT) */}
                        <aside className="spm-sidebar-col">
                            
                            {/* Video Introduction */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">videocam</span>
                                    Video giới thiệu
                                </h3>
                                <div className="spm-video-container">
                                    {candidate.videoUrl ? (
                                        <video src={candidate.videoUrl} controls className="spm-video-obj" />
                                    ) : (
                                        <div className="spm-video-obj" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'#1e293b', color:'#64748b'}}>
                                            <span className="material-symbols-outlined" style={{fontSize:'48px'}}>play_circle</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            {candidate.skills?.length > 0 && (
                                <div className="spm-card">
                                    <h3 className="spm-card-title">
                                        <span className="material-symbols-outlined">psychology</span>
                                        Kỹ năng chuyên môn
                                    </h3>
                                    <div className="spm-skill-tags">
                                        {candidate.skills.map((s, i) => (
                                            <div key={i} className="spm-tag">
                                                {typeof s === 'string' ? s : s.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CV / Resume */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">description</span>
                                    Hồ sơ năng lực (CV)
                                </h3>
                                {candidate.cvData ? (
                                    <div className="spm-cv-box">
                                        <div className="spm-cv-info">
                                            <span className="material-symbols-outlined spm-cv-icon">picture_as_pdf</span>
                                            <span className="spm-cv-name">Hồ sơ đính kèm.pdf</span>
                                        </div>
                                        <a href={getImageUrl(candidate.cvData)} target="_blank" rel="noreferrer" className="spm-cv-link">
                                            <span className="material-symbols-outlined">download</span>
                                        </a>
                                    </div>
                                ) : (
                                    <p className="spm-text-muted" style={{fontSize:'0.8rem'}}>Chưa có file CV đính kèm.</p>
                                )}
                            </div>

                            {/* Projects */}
                            {candidate.projects?.length > 0 && (
                                <div className="spm-card">
                                    <h3 className="spm-card-title">
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                        Dự án nổi bật
                                    </h3>
                                    {candidate.projects.map((pj, i) => (
                                        <div key={i} className="spm-project-item">
                                            <p className="spm-pj-name">{pj.name}</p>
                                            <p className="spm-pj-desc">{pj.description}</p>
                                            <div className="spm-pj-links">
                                                {pj.repositoryUrl && <a href={pj.repositoryUrl} target="_blank" rel="noreferrer">Repo</a>}
                                                {pj.demoUrl && <a href={pj.demoUrl} target="_blank" rel="noreferrer">Demo</a>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileModal;
