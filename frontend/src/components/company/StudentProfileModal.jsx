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

    // [FE Logic] Hiển thị hồ sơ chi tiết của sinh viên bao gồm cả phân tích độ phù hợp (AI Match)
    return (
        <div className="spm-overlay">
            <div className="spm-container">
                
                {/* Close Button */}
                <button className="spm-close-btn" onClick={onClose} title="Đóng">✕</button>

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
                        <div className="spm-header-top">
                            <div className="spm-avatar-box">
                                {candidate.avatarUrl ? (
                                    <img src={getImageUrl(candidate.avatarUrl)} alt={candidate.fullName} className="spm-avatar-img" />
                                ) : (
                                    <div className="spm-avatar-placeholder">{initials}</div>
                                )}
                            </div>
                            <div className="spm-user-title">
                                <span className={`spm-status-tag ${candidate.major ? 'updated' : 'pending'}`}>
                                    {candidate.major ? candidate.major : 'CHƯA CẬP NHẬT'}
                                </span>
                                <h2>{candidate.fullName}</h2>
                            </div>
                        </div>

                        <div className="spm-header-cards">
                            {/* Contact Info Card */}
                            <div className="spm-info-card">
                                <div className="spm-contact-grid">
                                    <div className="spm-contact-item">
                                        <div className="spm-contact-icon"><span className="material-symbols-outlined">mail</span></div>
                                        <span>{candidate.email || 'n/a'}</span>
                                    </div>
                                    <div className="spm-contact-item">
                                        <div className="spm-contact-icon"><span className="material-symbols-outlined">call</span></div>
                                        <span>{candidate.phone || 'n/a'}</span>
                                    </div>
                                    <div className="spm-contact-item" style={{ gridColumn: '1 / -1' }}>
                                        <div className="spm-contact-icon"><span className="material-symbols-outlined">school</span></div>
                                        <span>Lớp: {candidate.academicYear || 'n/a'} • MSSV: {candidate.studentIdStr || 'n/a'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="spm-info-card">
                                <div className="spm-stats-container">
                                    <div className="spm-stat-box">
                                        <span className="spm-stat-val">{gpa}</span>
                                        <span className="spm-stat-lbl">GPA</span>
                                    </div>
                                    <div className="spm-stat-box">
                                        <span className="spm-stat-val">{candidate.projects?.length || 0}</span>
                                        <span className="spm-stat-lbl">Dự án</span>
                                    </div>
                                    <div className="spm-stat-box">
                                        <span className="spm-stat-val">{candidate.cvData ? 1 : 0}</span>
                                        <span className="spm-stat-lbl">Hồ sơ</span>
                                    </div>
                                </div>
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
                                        <p className="spm-text-muted">Sinh viên chưa cập nhật phần giới thiệu bản thân.</p>
                                    )}
                                </div>
                            </div>

                            {/* Educations */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">school</span>
                                    Học vấn
                                </h3>
                                {candidate.educations?.length > 0 ? (
                                    <div className="spm-timeline">
                                        {candidate.educations.map((edu, i) => (
                                            <div key={i} className="spm-timeline-item">
                                                <div className="spm-timeline-dot" />
                                                <p className="spm-tl-title">{edu.schoolName}</p>
                                                <p className="spm-tl-sub">{edu.degree} – {edu.major}</p>
                                                <p className="spm-tl-date">
                                                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_month</span>
                                                    {edu.startDate} – {edu.endDate || 'Hiện tại'}
                                                </p>
                                                {edu.description && <div className="spm-tl-desc">{edu.description}</div>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="spm-text-muted" style={{fontStyle:'italic', fontSize:'0.9rem'}}>Sinh viên chưa cập nhật thông tin học vấn.</p>
                                )}
                            </div>

                            {/* Experiences */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">work</span>
                                    Kinh nghiệm làm việc
                                </h3>
                                {candidate.experiences?.length > 0 ? (
                                    <div className="spm-timeline">
                                        {candidate.experiences.map((exp, i) => (
                                            <div key={i} className="spm-timeline-item">
                                                <div className="spm-timeline-dot" />
                                                <p className="spm-tl-title">{exp.jobTitle}</p>
                                                <p className="spm-tl-sub">{exp.companyName}</p>
                                                <p className="spm-tl-date">
                                                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>calendar_month</span>
                                                    {exp.startDate} – {exp.endDate || 'Hiện tại'}
                                                </p>
                                                {exp.description && (
                                                    <div className="spm-tl-desc" dangerouslySetInnerHTML={{ __html: exp.description }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="spm-text-muted" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Sinh viên chưa cập nhật kinh nghiệm làm việc.</p>
                                )}
                            </div>

                            {/* Projects - Detailed View */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">rocket_launch</span>
                                    Dự án tiêu biểu
                                </h3>
                                {candidate.projects?.length > 0 ? (
                                    <div className="spm-projects-list">
                                        {candidate.projects.map((pj, i) => (
                                            <div key={i} className="spm-project-item">
                                                <div className="spm-project-info">
                                                    <h4>{pj.name}</h4>
                                                    <div className="spm-pj-meta">
                                                        {pj.role && <span><strong>Vai trò:</strong> {pj.role}</span>}
                                                        {pj.duration && <span><strong>Thời gian:</strong> {pj.duration}</span>}
                                                    </div>
                                                    <p>{pj.description}</p>
                                                    
                                                    {pj.technologies && (
                                                        <div className="spm-pj-techs">
                                                            {pj.technologies.split(',').map((t, idx) => (
                                                                <span key={idx} className="spm-pj-tech-tag">{t.trim()}</span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {pj.responsibilities && (
                                                        <div className="spm-pj-resp">
                                                            <strong>Nhiệm vụ chính:</strong>
                                                            <ul>
                                                                {pj.responsibilities.split('\n').filter(r => r.trim()).map((r, idx) => (
                                                                    <li key={idx}>{r.replace(/^- /, '')}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <div className="spm-project-links">
                                                        {pj.repositoryUrl && (
                                                            <a href={pj.repositoryUrl} target="_blank" rel="noreferrer" className="spm-btn-outline">
                                                                <span className="material-symbols-outlined">code</span> Source Code
                                                            </a>
                                                        )}
                                                        {pj.demoUrl && (
                                                            <a href={pj.demoUrl} target="_blank" rel="noreferrer">
                                                                <span className="material-symbols-outlined">open_in_new</span> Live Demo
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="spm-text-muted" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Sinh viên chưa cập nhật dự án tiêu biểu.</p>
                                )}
                            </div>
                        </div>

                        {/* SIDEBAR COLUMN (RIGHT) */}
                        <aside className="spm-sidebar-col">
                            
                            {/* Video Introduction */}
                            <div className="spm-card spm-video-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">videocam</span>
                                    Video giới thiệu
                                </h3>
                                <div className="spm-video-container">
                                    {candidate.videoUrl ? (
                                        <video src={candidate.videoUrl} controls className="spm-video-obj" />
                                    ) : (
                                        <div className="spm-video-empty">
                                            <div className="spm-video-icon-wrapper">
                                                <span className="material-symbols-outlined">play_circle</span>
                                            </div>
                                            <span className="spm-video-empty-text">Sinh viên chưa cập nhật video</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CV / Resume */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">description</span>
                                    Hồ sơ năng lực (CV)
                                </h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* 1. CV Online (Snapshot) */}
                                    {candidate.cvData && (
                                        <div className="spm-cv-box" onClick={() => window.open(`/cv/view/${candidate.id}`, '_blank')}>
                                            <div className="spm-cv-info">
                                                <span className="material-symbols-outlined spm-cv-icon" style={{ color: '#2563eb' }}>auto_stories</span>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="spm-cv-name">CV Online (Hệ thống)</span>
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>Bản snapshot lúc ứng tuyển</span>
                                                </div>
                                            </div>
                                            <div className="spm-cv-link" title="Xem chi tiết">
                                                <span className="material-symbols-outlined" style={{fontSize: '18px'}}>visibility</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. File PDF đính kèm */}
                                    {candidate.cvUrl && (
                                        <div className="spm-cv-box" onClick={() => window.open(getImageUrl(candidate.cvUrl), '_blank')}>
                                            <div className="spm-cv-info">
                                                <span className="material-symbols-outlined spm-cv-icon" style={{ color: '#dc2626' }}>picture_as_pdf</span>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="spm-cv-name">Hồ sơ đính kèm (PDF)</span>
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>Tài liệu đính kèm bên ngoài</span>
                                                </div>
                                            </div>
                                            <div className="spm-cv-link" title="Tải xuống">
                                                <span className="material-symbols-outlined" style={{fontSize: '18px'}}>download</span>
                                            </div>
                                        </div>
                                    )}

                                    {!candidate.cvData && !candidate.cvUrl && (
                                        <p className="spm-text-muted" style={{fontSize:'0.85rem', fontStyle: 'italic'}}>Ứng viên chưa đính kèm CV.</p>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="spm-card">
                                <h3 className="spm-card-title">
                                    <span className="material-symbols-outlined">psychology</span>
                                    Kỹ năng chuyên môn
                                </h3>
                                {candidate.skills?.length > 0 ? (
                                    <div className="spm-skill-tags">
                                        {candidate.skills.map((s, i) => (
                                            <div key={i} className="spm-tag">
                                                {typeof s === 'string' ? s : s.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="spm-text-muted" style={{fontStyle:'italic', fontSize:'0.85rem'}}>Chưa cập nhật kỹ năng.</p>
                                )}
                            </div>

                            {/* [AI Match Analysis] Phân tích độ phù hợp dựa trên thuật toán so khớp giữa Job và Student Profile */}
                            {candidate.matchDetails?.breakdown && (
                                <div className="spm-card">
                                    <h3 className="spm-card-title">
                                        <span className="material-symbols-outlined">analytics</span>
                                        Phân tích độ phù hợp
                                    </h3>
                                    <div className="match-analysis" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                                        {Object.entries(candidate.matchDetails.breakdown).map(([key, factorData]) => (
                                            <div key={key} className="analysis-item" title={factorData.experience_reason || factorData.skills_reason || factorData.projects_reason || factorData.education_reason || factorData.location_reason}>
                                                <div className="analysis-label">
                                                    <span>{key === 'skills' ? 'Kỹ năng' : key === 'experience' ? 'Kinh nghiệm' : key === 'projects' ? 'Dự án' : key === 'education' ? 'Học vấn' : 'Địa điểm'}</span>
                                                    {factorData.is_missing_data ? (
                                                        <span className="score-val missing">Chưa cập nhật</span>
                                                    ) : (
                                                        <span className="score-val">{factorData.score}%</span>
                                                    )}
                                                </div>
                                                <div className="analysis-bar-bg">
                                                    <div 
                                                        className={`analysis-bar-fill ${factorData.is_missing_data ? 'missing' : ''}`} 
                                                        style={{ 
                                                            width: factorData.is_missing_data ? '100%' : `${factorData.score}%`,
                                                            backgroundColor: factorData.is_missing_data ? '#e2e8f0' : (factorData.score >= 80 ? '#10b981' : factorData.score >= 50 ? '#f59e0b' : '#ef4444')
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1rem', fontStyle: 'italic' }}>
                                        * Di chuột vào từng thanh để xem lý do chấm điểm
                                    </p>
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
