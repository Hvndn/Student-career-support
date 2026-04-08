import React from 'react';

const EducationSection = ({ educations, onAdd, onDelete }) => {
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
                            <h4>{edu.schoolName}</h4>
                            <p>{edu.major}</p>
                            <p className="pf-date">{edu.startDate} - {edu.endDate || 'Hiện tại'}</p>
                        </div>
                        <button onClick={() => onDelete(edu.id)} className="pf-delete-btn-abs">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                    </div>
                ))}
                {educations?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa có thông tin học vấn.</p>}
            </div>
        </section>
    );
};

export default EducationSection;
