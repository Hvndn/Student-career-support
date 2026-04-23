import React from 'react';

const CreativeTemplate = ({ cvData, onSectionClick, themeColor = '#ff6b35' }) => {
  const cv = cvData;
  if (!cv) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

  const {
    fullName = 'LÊ MINH CHÂN',
    major = 'GRAPHIC DESIGNER',
    email = 'chan.design@gmail.com',
    phone = '0888 777 666',
    address = 'Quận Thủ Đức, TP. HCM',
    bio = 'Designer đầy nhiệt huyết với gu thẩm mỹ hiện đại. Sử dụng thành thạo bộ công cụ Adobe (Ps, Ai, Id) và Figma. Từng tham gia thiết kế nhận diện thương hiệu cho hơn 20 startup.',
    skills = [],
    experiences = [],
    educations = []
  } = cv;

  return (
    <div className="creative-cv-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        .creative-cv-container {
            display: flex;
            background: #fff;
            min-height: 1000px;
            font-family: 'Montserrat', sans-serif;
        }
        .creative-sidebar {
            width: 35%;
            background: ${themeColor};
            color: white;
            padding: 40px 25px;
        }
        .creative-main {
            flex: 1;
            padding: 40px 35px;
            color: #2b2d42;
        }
        .creative-section-title {
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 20px;
            text-transform: uppercase;
            border-bottom: 4px solid ${themeColor};
            display: inline-block;
        }
        .sidebar-title {
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.3);
            padding-bottom: 5px;
            color: white !important;
        }
        .creative-item { margin-bottom: 25px; cursor: pointer; padding: 5px; border-radius: 8px; transition: 0.2s; }
        .creative-item:hover { background: #fdfdfd; }
        .item-year { color: ${themeColor}; font-weight: bold; font-size: 14px; }
        .item-title { font-size: 17px; font-weight: bold; margin: 3px 0; color: #1e293b; }
        .skill-bar-wrap { margin-bottom: 12px; }
        .skill-bar-bg { background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; }
        .skill-bar-fill { background: #fff; height: 100%; border-radius: 4px; }
        
        .creative-sidebar h1 { color: white !important; }
        .creative-sidebar p { color: rgba(255,255,255,0.95) !important; }
        .creative-sidebar .skill-name { color: white !important; font-size: 13px; margin-bottom: 4px; }
      `}</style>

      <div className="creative-sidebar">
        <div style={{ wordBreak: 'break-all' }}>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>{fullName}</h1>
            <p style={{ fontWeight: 600, opacity: 0.9 }}>{major}</p>
        </div>
        
        <div style={{ marginTop: '40px' }} onClick={() => onSectionClick && onSectionClick('contact')}>
            <div className="sidebar-title">Liên hệ</div>
            <div style={{ fontSize: '13px', lineHeight: 2 }}>
                <p>📞 {phone}</p>
                <p>📧 {email}</p>
                <p>📍 {address}</p>
            </div>
        </div>

        <div style={{ marginTop: '30px' }} onClick={() => onSectionClick && onSectionClick('skills')}>
            <div className="sidebar-title">Kỹ năng</div>
            {skills.map((s, i) => (
                <div key={i} className="skill-bar-wrap">
                    <div className="skill-name">{s.name}</div>
                    <div className="skill-bar-bg">
                        <div className="skill-bar-fill" style={{ width: `${s.level || 80}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="creative-main">
        <div className="creative-item" onClick={() => onSectionClick && onSectionClick('bio')}>
            <div className="creative-section-title">Giới thiệu</div>
            <p style={{ lineHeight: 1.6, fontSize: '14px', color: '#334155' }}>{bio}</p>
        </div>

        <div className="creative-item" onClick={() => onSectionClick && onSectionClick('experiences')}>
            <div className="creative-section-title">Kinh nghiệm</div>
            {experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                    <span className="item-year">{exp.startDate} - {exp.endDate}</span>
                    <div className="item-title">{exp.jobTitle}</div>
                    <div style={{ fontWeight: 600, color: '#475569' }}>{exp.companyName}</div>
                    <p style={{ fontSize: '14px', marginTop: '5px', color: '#334155', lineHeight: 1.5 }}>{exp.description}</p>
                </div>
            ))}
        </div>

        <div className="creative-item" onClick={() => onSectionClick && onSectionClick('educations')}>
            <div className="creative-section-title">Học vấn</div>
            {educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                    <span className="item-year">{edu.startDate} - {edu.endDate}</span>
                    <div className="item-title">{edu.major}</div>
                    <div style={{ fontWeight: 600, color: '#475569' }}>{edu.schoolName}</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
