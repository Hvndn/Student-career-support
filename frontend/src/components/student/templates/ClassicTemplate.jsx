import React from 'react';

const ClassicTemplate = ({ cvData, onSectionClick }) => {
  const cv = cvData;
  if (!cv) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  const {
    fullName = 'NGUYỄN VĂN A',
    major = 'HÀNH CHÍNH NHÂN SỰ',
    avatar, avatarUrl,
    email = 'nguyenvana@gmail.com',
    phone = '0987 654 321',
    address = 'Ba Đình, Hà Nội',
    dob = '01/01/1995',
    bio = 'Chuyên viên Hành chính Nhân sự với 5 năm kinh nghiệm quản lý hồ sơ nhân viên, BHXH và quy trình tuyển dụng. Có khả năng tổ chức công việc khoa học, tỉ mỉ và chịu được áp lực cao.',
    skills = [],
    educations = [],
    experiences = [],
    certifications = [],
    awards = [],
    interests = []
  } = cv;

  return (
    <div className="classic-cv-container">
      <style>{`
        .classic-cv-container {
            padding: 50px 60px;
            background: white;
            color: #333;
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.5;
            min-height: 1000px;
        }
        .classic-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .classic-name {
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .classic-contact {
            font-size: 14px;
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 5px;
        }
        .classic-section {
            margin-bottom: 25px;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
        }
        .classic-section:hover { background: #f9f9f9; }
        .classic-section-title {
            font-size: 18px;
            font-weight: bold;
            border-bottom: 1px solid #ccc;
            margin-bottom: 12px;
            padding-bottom: 3px;
            text-transform: uppercase;
        }
        .classic-item { margin-bottom: 15px; }
        .classic-item-header {
            display: flex; justify-content: space-between;
            font-weight: bold;
        }
        .classic-text { font-size: 14px; text-align: justify; white-space: pre-wrap; }
        .classic-bullet { list-style: disc; padding-left: 20px; margin-top: 5px; }
      `}</style>

      <div className="classic-header" onClick={() => onSectionClick && onSectionClick('personal')}>
        <div className="classic-name">{fullName}</div>
        <div style={{ fontWeight: 'bold' }}>{major}</div>
        <div className="classic-contact">
            <span>{phone}</span> | <span>{email}</span> | <span>{address}</span>
        </div>
      </div>

      <div className="classic-section" onClick={() => onSectionClick && onSectionClick('bio')}>
        <div className="classic-section-title">Mục tiêu nghề nghiệp</div>
        <div className="classic-text">{bio}</div>
      </div>

      <div className="classic-section" onClick={() => onSectionClick && onSectionClick('experiences')}>
        <div className="classic-section-title">Kinh nghiệm làm việc</div>
        {experiences.length > 0 ? experiences.map((exp, i) => (
            <div key={i} className="classic-item">
                <div className="classic-item-header">
                    <span>{exp.companyName}</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <i>{exp.jobTitle}</i>
                <div className="classic-text">{exp.description}</div>
            </div>
        )) : <div className="classic-text">Lưu trữ và quản lý hồ sơ nhân sự, thực hiện các thủ tục BHXH...</div>}
      </div>

      <div className="classic-section" onClick={() => onSectionClick && onSectionClick('educations')}>
        <div className="classic-section-title">Trình độ học vấn</div>
        {educations.map((edu, i) => (
            <div key={i} className="classic-item">
                <div className="classic-item-header">
                    <span>{edu.schoolName}</span>
                    <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <span>{edu.major}</span>
            </div>
        ))}
      </div>

      <div className="classic-section" onClick={() => onSectionClick && onSectionClick('skills')}>
        <div className="classic-section-title">Kỹ năng</div>
        <div className="classic-text">
            {skills.map(s => s.name).join(', ')}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
