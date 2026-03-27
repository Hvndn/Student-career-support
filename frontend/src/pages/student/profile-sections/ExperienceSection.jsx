import React from 'react';

const ExperienceSection = ({ experiences, onAdd, onDelete }) => {
    return (
        <section className="pf-card">
            <div className="pf-section-title">
                <h2>Kinh nghiệm làm việc</h2>
                <button className="pf-add-btn" onClick={onAdd}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span> Thêm mới
                </button>
            </div>
            <div className="pf-timeline">
                {experiences?.map((exp, idx) => (
                    <div key={exp.id} className="pf-timeline-item">
                        <div className={`pf-timeline-dot ${idx === 0 ? '' : 'pf-timeline-dot-gray'}`}></div>
                        <div className="pf-exp-header">
                            <div>
                                <h4>{exp.jobTitle}</h4>
                                <p style={{ fontWeight: 500, fontSize: '14px' }}>{exp.companyName}</p>
                            </div>
                            <span className="pf-exp-type">Full-time</span>
                        </div>
                        <p className="pf-date">{exp.startDate} - {exp.endDate || 'Hiện tại'}</p>
                        <p style={{ fontSize: '14px', color: '#475569', marginTop: '0.5rem' }}>{exp.description}</p>
                        <button onClick={() => onDelete(exp.id)} className="pf-delete-btn-abs">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                    </div>
                ))}
                {experiences?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa có kinh nghiệm làm việc.</p>}
            </div>
        </section>
    );
};

export default ExperienceSection;
