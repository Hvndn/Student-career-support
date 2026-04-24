import React from 'react';

const ElegantTemplate = ({ cvData, onSectionClick }) => {
    const cv = cvData || {};
    const {
        fullName = 'NGUYỄN VĂN A',
        major = 'Luxury Brand Manager',
        email = 'nguyenvana@gmail.com',
        phone = '0987 654 321',
        bio = 'Chuyên gia xây dựng thương hiệu cao cấp với gu thẩm mỹ tinh tế.',
        experiences = []
    } = cv;

    return (
        <div className="elegant-cv" style={{ width: '794px', minHeight: '1120px', background: '#fff', padding: '80px', fontFamily: '"Playfair Display", serif', color: '#1a1a1a' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '400', letterSpacing: '4px', margin: '0' }}>{fullName.toUpperCase()}</h1>
                <div style={{ width: '40px', height: '1px', background: '#c5a059', margin: '20px auto' }}></div>
                <p style={{ fontSize: '14px', letterSpacing: '3px', color: '#c5a059', textTransform: 'uppercase' }}>{major}</p>
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#999', letterSpacing: '1px' }}>
                    {email}  |  {phone}
                </div>
            </header>

            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', color: '#c5a059', textAlign: 'center', textTransform: 'uppercase', marginBottom: '20px' }}>Biography</h2>
                <p style={{ fontSize: '15px', lineHeight: '1.8', textAlign: 'center', fontStyle: 'italic', padding: '0 40px' }}>{bio}</p>
            </section>

            <section>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', color: '#c5a059', textAlign: 'center', textTransform: 'uppercase', marginBottom: '30px' }}>Career Path</h2>
                {experiences.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '30px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', marginBottom: '5px' }}>{exp.companyName}</div>
                        <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{exp.jobTitle}  •  {exp.startDate} - {exp.endDate}</div>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#444' }}>{exp.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ElegantTemplate;
