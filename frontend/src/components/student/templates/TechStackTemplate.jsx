import React from 'react';

const TechStackTemplate = ({ cvData, onSectionClick }) => {
    const cv = cvData || {};
    const {
        fullName = 'NGUYỄN VĂN A',
        major = 'Fullstack Developer',
        skills = [],
        experiences = []
    } = cv;

    return (
        <div className="tech-stack-cv" style={{ width: '794px', minHeight: '1120px', background: '#0f172a', color: '#f8fafc', padding: '50px', fontFamily: 'monospace' }}>
            <header style={{ borderBottom: '2px solid #38bdf8', paddingBottom: '20px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', color: '#38bdf8', margin: '0' }}>{fullName}</h1>
                <p style={{ fontSize: '18px', opacity: '0.8' }}>{`> ${major}`}</p>
            </header>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#38bdf8', fontSize: '16px', marginBottom: '20px' }}>[TECHNICAL_SKILLS]</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {skills.map((s, i) => (
                        <span key={i} style={{ padding: '5px 12px', border: '1px solid #38bdf8', borderRadius: '4px', fontSize: '13px' }}>
                            {s.name}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ color: '#38bdf8', fontSize: '16px', marginBottom: '20px' }}>[PROJECT_EXPERIENCE]</h2>
                {experiences.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '30px', borderLeft: '2px solid #1e293b', paddingLeft: '20px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>{exp.jobTitle} @ {exp.companyName}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', margin: '5px 0' }}>{exp.startDate} - {exp.endDate}</div>
                        <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>{exp.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default TechStackTemplate;
