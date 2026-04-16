import React from 'react';

const ModernTemplate = ({ cvData, onSectionClick }) => {
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
            background: #1a1a2e;
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
        }
        .modern-section:hover { background: #f9f9f9; }
        .modern-title {
            font-size: 20px;
            font-weight: 700;
            color: #0f3460;
            border-left: 5px solid #e94560;
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
            background: #e94560;
            border-radius: 50%;
        }
        .modern-item-title { font-weight: bold; font-size: 16px; margin-bottom: 4px; }
        .modern-item-sub { font-size: 14px; color: #666; margin-bottom: 6px; }
        .modern-skill-tag {
            display: inline-block;
            background: #edf2f4;
            padding: 5px 12px;
            border-radius: 20px;
            margin: 0 8px 8px 0;
            font-size: 13px;
            font-weight: 500;
        }
      `}</style>

      <div className="modern-top-bar" onClick={() => onSectionClick && onSectionClick('personal')}>
        <div>
            <h1 style={{ fontSize: '36px', margin: 0, letterSpacing: '2px' }}>{fullName}</h1>
            <p style={{ fontSize: '18px', color: '#e94560', fontWeight: 600 }}>{major}</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: 1.8 }}>
            <p>{phone}</p>
            <p>{email}</p>
            <p>{address}</p>
        </div>
      </div>

      <div className="modern-grid">
        <div className="modern-left">
            <div className="modern-section" onClick={() => onSectionClick && onSectionClick('bio')}>
                <div className="modern-title">Mục tiêu</div>
                <p style={{ lineHeight: 1.6 }}>{bio}</p>
            </div>

            <div className="modern-section" onClick={() => onSectionClick && onSectionClick('experiences')}>
                <div className="modern-title">Kinh nghiệm</div>
                {experiences.map((exp, i) => (
                    <div key={i} className="modern-item">
                        <div className="modern-item-title">{exp.jobTitle}</div>
                        <div className="modern-item-sub">{exp.companyName} | {exp.startDate} - {exp.endDate}</div>
                        <p style={{ fontSize: '14px' }}>{exp.description}</p>
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
                        <div style={{ fontSize: '12px' }}>{edu.startDate} - {edu.endDate}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
