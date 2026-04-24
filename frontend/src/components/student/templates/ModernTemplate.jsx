import React from 'react';

const ModernTemplate = ({ cvData, onSectionClick, themeColor = '#1a1a2e' }) => {
  const cv = cvData;
  if (!cv) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

  const {
    fullName = 'NGUYỄN MINH KHÔI',
    major = 'FULLSTACK DEVELOPER',
    email = 'minhkhoi.dev@gmail.com',
    phone = '0909 112 233',
    address = 'Quận 7, Đà Nẵng',
    bio = 'Phát triển ứng dụng Web toàn diện với Node.js và React. Đam mê tối ưu hóa trải nghiệm người dùng và xây dựng các hệ thống backend ổn định.',
    skills = [],
    experiences = [],
    educations = []
  } = cv;

  return (
    <div className="modern-template-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .modern-template-container {
            background: #fdfdfd;
            min-height: 1000px;
            font-family: 'Poppins', sans-serif;
            color: #333;
        }
        .modern-top-bar {
            background: ${themeColor};
            color: white;
            padding: 50px 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modern-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
            padding: 40px 60px;
        }
        .modern-section {
            margin-bottom: 35px;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .modern-section:hover { background: #f9f9f9; }
        .modern-title {
            font-size: 20px;
            font-weight: 700;
            color: ${themeColor};
            border-left: 5px solid ${themeColor};
            padding-left: 15px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .modern-item { margin-bottom: 20px; position: relative; padding-left: 20px; }
        .modern-item::before {
            content: "";
            position: absolute;
            left: 0; top: 8px;
            width: 8px; height: 8px;
            background: ${themeColor};
            border-radius: 50%;
        }
        .modern-item-title { font-weight: bold; font-size: 16px; margin-bottom: 4px; color: #1e293b; }
        .modern-item-sub { font-size: 14px; color: #64748b; margin-bottom: 6px; font-weight: 500; }
        .modern-skill-tag {
            display: inline-block;
            background: rgba(15, 64, 159, 0.08);
            color: ${themeColor};
            padding: 5px 14px;
            border-radius: 20px;
            margin: 0 8px 8px 0;
            font-size: 13px;
            font-weight: 600;
        }
      `}</style>

      <div className="modern-top-bar" onClick={() => onSectionClick && onSectionClick('personal')}>
        <div>
            <h1 style={{ fontSize: '36px', margin: 0, letterSpacing: '2px', color: 'white' }}>{fullName}</h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{major}</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.95)' }}>
            <p>{phone}</p>
            <p>{email}</p>
            <p>{address}</p>
        </div>
      </div>

      <div className="modern-grid">
        <div className="modern-left">
            <div className="modern-section" onClick={() => onSectionClick && onSectionClick('bio')}>
                <div className="modern-title">Mục tiêu</div>
                <p style={{ lineHeight: 1.6, color: '#334155' }}>{bio}</p>
            </div>

            <div className="modern-section" onClick={() => onSectionClick && onSectionClick('experiences')}>
                <div className="modern-title">Kinh nghiệm</div>
                {experiences.map((exp, i) => (
                    <div key={i} className="modern-item">
                        <div className="modern-item-title">{exp.jobTitle}</div>
                        <div className="modern-item-sub">{exp.companyName} | {exp.startDate} - {exp.endDate}</div>
                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="modern-right">
            <div className="modern-section" onClick={() => onSectionClick && onSectionClick('skills')}>
                <div className="modern-title">Kỹ năng</div>
                <div style={{ marginTop: '10px' }}>
                    {skills.map((s, i) => (
                        <span key={i} className="modern-skill-tag">{s.name}</span>
                    ))}
                </div>
            </div>

            <div className="modern-section" onClick={() => onSectionClick && onSectionClick('educations')}>
                <div className="modern-title">Học vấn</div>
                {educations.map((edu, i) => (
                    <div key={i} className="modern-item">
                        <div className="modern-item-title">{edu.major}</div>
                        <div className="modern-item-sub">{edu.schoolName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{edu.startDate} - {edu.endDate}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
