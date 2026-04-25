import React from 'react';

const MinimalTemplate = ({ cvData, onSectionClick, themeColor = '#1e293b' }) => {
    const cv = cvData || {};
    const {
        fullName = 'NGUYỄN VĂN A',
        major = 'Project Manager',
        email = 'nguyenvana@gmail.com',
        phone = '0987 654 321',
        address = 'Hà Nội, Việt Nam',
        bio = 'Chuyên gia quản lý dự án với hơn 10 năm kinh nghiệm trong ngành xây dựng và công nghệ.',
        skills = [],
        educations = [],
        experiences = []
    } = cv;

    return (
        <div className="minimal-cv" style={{ padding: '60px', background: 'white', fontFamily: 'serif', color: '#1a1a1a', width: '794px', minHeight: '1120px' }}>
            <header style={{ borderBottom: '1px solid #000', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', margin: '0', letterSpacing: '2px' }}>{fullName.toUpperCase()}</h1>
                <p style={{ fontSize: '16px', color: '#666', margin: '10px 0' }}>{major}</p>
                <div style={{ fontSize: '13px', color: '#888' }}>{phone} • {email} • {address}</div>
            </header>

            <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>SUMMARY</h2>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{bio}</p>
            </section>

            <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>EXPERIENCE</h2>
                {experiences.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                            <span>{exp.companyName}</span>
                            <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <div style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '8px' }}>{exp.jobTitle}</div>
                        <p style={{ fontSize: '13px', margin: '0' }}>{exp.description}</p>
                    </div>
                ))}
            </section>

            <section>
                <h2 style={{ fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>EDUCATION</h2>
                {educations.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '10px', fontSize: '14px' }}>
                        <div style={{ fontWeight: 'bold' }}>{edu.schoolName}</div>
                        <div>{edu.major} • {edu.startDate} - {edu.endDate}</div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default MinimalTemplate;
