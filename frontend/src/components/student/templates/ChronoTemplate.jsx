import React from 'react';

const ChronoTemplate = ({ cvData, onSectionClick, themeColor = '#0f766e' }) => {
    const cv = cvData || {};
    const {
        fullName = 'NGUYỄN VĂN A',
        major = 'Senior Consultant',
        email = 'nguyenvana@gmail.com',
        phone = '0987 654 321',
        bio = 'Chuyên gia tư vấn chiến lược với bề dày thành tích.',
        experiences = [],
        educations = []
    } = cv;

    return (
        <div className="chrono-cv" style={{ width: '794px', minHeight: '1120px', background: '#fff', padding: '60px', fontFamily: 'Inter, sans-serif' }}>
            <header style={{ marginBottom: '50px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#0f766e', margin: '0' }}>{fullName}</h1>
                <div style={{ height: '4px', width: '80px', background: '#0f766e', margin: '15px 0' }}></div>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#475569' }}>{major}</p>
                <div style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
                    <span>{phone}</span> • <span>{email}</span>
                </div>
            </header>

            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94a3b8', marginBottom: '30px' }}>WORK TIMELINE</h2>
                <div style={{ position: 'relative', paddingLeft: '30px', borderLeft: '2px solid #e2e8f0' }}>
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '40px', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-36px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: '#0f766e', border: '3px solid white' }}></div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f766e', marginBottom: '5px' }}>{exp.startDate} - {exp.endDate}</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{exp.jobTitle}</div>
                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>{exp.companyName}</div>
                            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ fontSize: '14px', letterSpacing: '2px', color: '#94a3b8', marginBottom: '30px' }}>EDUCATION</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {educations.map((edu, i) => (
                        <div key={i}>
                            <div style={{ fontWeight: 'bold' }}>{edu.schoolName}</div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>{edu.major} • {edu.endDate}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ChronoTemplate;
