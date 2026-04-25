import React from 'react';

const ColoredTopTemplate = ({ cvData, onSectionClick }) => {
    const cv = cvData || {};
    const {
        fullName = 'NGUYỄN VĂN A',
        major = 'Marketing Specialist',
        email = 'nguyenvana@gmail.com',
        phone = '0987 654 321',
        bio = 'Chuyên gia marketing sáng tạo với khả năng thích nghi cao.',
        experiences = []
    } = cv;

    return (
        <div className="colored-top-cv" style={{ width: '794px', minHeight: '1120px', background: '#fff', fontFamily: 'sans-serif' }}>
            <header style={{ background: '#4f46e5', color: '#fff', padding: '60px 50px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                <h1 style={{ fontSize: '40px', fontWeight: '800', margin: '0' }}>{fullName}</h1>
                <p style={{ fontSize: '20px', opacity: '0.9', marginTop: '10px' }}>{major}</p>
                <div style={{ marginTop: '30px', display: 'flex', gap: '30px', fontSize: '14px', opacity: '0.8' }}>
                    <span>✉️ {email}</span>
                    <span>📞 {phone}</span>
                </div>
            </header>

            <div style={{ padding: '50px' }}>
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '18px', color: '#4f46e5', fontWeight: '700', borderBottom: '2px solid #e0e7ff', paddingBottom: '10px', marginBottom: '20px' }}>GIỚI THIỆU</h2>
                    <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7' }}>{bio}</p>
                </section>

                <section>
                    <h2 style={{ fontSize: '18px', color: '#4f46e5', fontWeight: '700', borderBottom: '2px solid #e0e7ff', paddingBottom: '10px', marginBottom: '20px' }}>KINH NGHIỆM</h2>
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: '#111827' }}>
                                <span>{exp.jobTitle}</span>
                                <span style={{ color: '#6b7280', fontSize: '13px' }}>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div style={{ color: '#4f46e5', fontSize: '14px', margin: '5px 0' }}>{exp.companyName}</div>
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{exp.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default ColoredTopTemplate;
