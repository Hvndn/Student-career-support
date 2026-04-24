import React from 'react';

const Modern3Template = ({ cvData, onSectionClick, themeColor = '#1e293b' }) => {
    const cv = cvData || {};
    const {
        fullName = 'NGUYỄN VĂN A',
        major = 'Creative Director',
        avatar, avatarUrl,
        email = 'nguyenvana@gmail.com',
        phone = '0987 654 321',
        bio = 'Đam mê sáng tạo và đổi mới trong từng thiết kế.',
        skills = [],
        educations = [],
        experiences = []
    } = cv;

    const displayAvatar = avatar || avatarUrl || 'https://via.placeholder.com/150';

    return (
        <div className="modern3-cv" style={{ width: '794px', minHeight: '1120px', background: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
            <header style={{ background: '#1e293b', color: 'white', padding: '50px', display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ width: '150px', height: '150px', borderRadius: '12px', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.2)' }}>
                    <img src={displayAvatar} alt="ava" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0' }}>{fullName}</h1>
                    <p style={{ fontSize: '18px', color: '#94a3b8', marginTop: '10px' }}>{major}</p>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px', fontSize: '13px', color: '#cbd5e1' }}>
                        <span>📞 {phone}</span>
                        <span>✉️ {email}</span>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flex: '1' }}>
                <aside style={{ width: '30%', background: '#f8fafc', padding: '40px 30px', borderRight: '1px solid #e2e8f0' }}>
                    <section style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', borderBottom: '2px solid #1e293b', paddingBottom: '8px', marginBottom: '15px' }}>SKILLS</h3>
                        {skills.map((s, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '13px', marginBottom: '4px' }}>{s.name}</div>
                                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                                    <div style={{ width: '70%', height: '100%', background: '#1e293b', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        ))}
                    </section>
                </aside>

                <main style={{ width: '70%', padding: '40px' }}>
                    <section style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>PROFILE</h3>
                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>{bio}</p>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>EXPERIENCE</h3>
                        {experiences.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '25px' }}>
                                <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{exp.jobTitle}</div>
                                <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{exp.companyName} | {exp.startDate} - {exp.endDate}</div>
                                <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>{exp.description}</p>
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Modern3Template;
