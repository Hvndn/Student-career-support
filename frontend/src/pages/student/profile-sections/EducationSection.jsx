import React from 'react';

const EducationSection = ({ educations, onAdd, onEdit, onDelete }) => {
    return (
        <section className="pf-card">
            <div className="pf-section-title">
                <h2>Quản lý học vấn</h2>
                <button className="pf-add-btn" onClick={onAdd}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span> Thêm mới
                </button>
            </div>
            <div className="pf-timeline">
                {educations?.map(edu => (
                    <div key={edu.id} className="pf-item" style={{ position: 'relative' }}>
                        <div className="pf-item-icon">
                            <span className="material-symbols-outlined">account_balance</span>
                        </div>
                        <div className="pf-item-content">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4>{edu.schoolName}</h4>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => onEdit(edu)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                    </button>
                                    <button onClick={() => onDelete(edu.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                    </button>
                                </div>
                            </div>
                            <p>{edu.major}</p>
                            <p className="pf-date">{edu.startDate} - {edu.endDate || 'Hiện tại'}</p>
                        </div>
                    </div>
                ))}
                {educations?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa có thông tin học vấn.</p>}
            </div>
        </section>
    );
};

export default EducationSection;
