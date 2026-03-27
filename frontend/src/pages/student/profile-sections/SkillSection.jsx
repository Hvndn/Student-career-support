import React from 'react';

const SkillSection = ({ skills, onAdd, onDelete }) => {
    return (
        <section className="pf-card">
            <div className="pf-section-title">
                <h2>Kỹ năng chuyên môn</h2>
                <button className="pf-add-btn" onClick={onAdd}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                </button>
            </div>
            <div className="pf-skills-list">
                {skills?.map(skill => (
                    <span
                        key={skill.id}
                        className="pf-skill-tag"
                        onClick={() => onDelete(skill.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        {skill.name} • {skill.level}
                    </span>
                ))}
                {skills?.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Chưa có kỹ năng.</p>}
            </div>
        </section>
    );
};

export default SkillSection;
