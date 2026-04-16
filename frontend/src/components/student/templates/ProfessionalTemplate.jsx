import React from 'react';

const ProfessionalTemplate = ({ cvData, onSectionClick, onUpdate, onAvatarClick }) => {
  const cv = cvData;
  if (!cv) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu CV...</div>;

  const {
    fullName = 'Trần Mạnh Dũng',
    major = 'Content Leader',
    avatar,
    avatarUrl,
    email = 'tech.growth@topcv.vn',
    phone = '0123 456 789',
    address = 'Thanh Xuân, Hà Nội',
    dob = '18/12/1997',
    gender = 'Nam',
    website = 'facebook.com/TopCV.vn',
    bio = 'Content Leader với 6 năm kinh nghiệm xây dựng và triển khai chiến lược nội dung đa nền tảng cho các thương hiệu trong lĩnh vực FMCG, công nghệ, giáo dục và bán lẻ. Tôi có thế mạnh quản lý đội ngũ Content từ 5-10 người, từng góp phần tăng 40% Organic Traffic và nâng tỷ lệ chuyển đổi từ nội dung gấp 2-3 lần. Từ nền tảng Content vững chắc, tôi hướng đến vai trò Marketing Leader trong 1-2 năm tới, xây dựng chiến lược Marketing toàn diện, góp phần tăng trưởng độ nhận diện thương hiệu và hiệu quả kinh doanh trong dài hạn.',
    skills = [],
    educations = [],
    experiences = [],
    certifications = [],
    awards = [],
    projects = [],
    activities = [],
    interests = []
  } = cv;

  // Header Helper: Pill-shaped title with a horizontal line
  const PillHeader = ({ title, light = false }) => (
    <div className={`pro-pill-header ${light ? 'light' : ''}`}>
      <div className="pro-pill-box">{title}</div>
      <div className="pro-pill-line"></div>
    </div>
  );

  return (
    <div className="professional-cv-container">
      <style>{`
        .professional-cv-container {
          display: flex;
          min-height: 1000px;
          background: white;
          font-family: 'Inter', 'Roboto', sans-serif;
          color: #2c3e50;
          line-height: 1.6;
        }

        /* Sidebar Styling */
        .pro-sidebar {
          width: 30%;
          background: #334e5a;
          color: white;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          gap: 35px;
        }

        .pro-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          gap: 20px;
        }

        .pro-avatar-circle {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          border: 12px solid #5b8591;
          overflow: hidden;
          background: #e2e8f0;
        }

        .pro-avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pro-name {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }

        .pro-major {
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .pro-sidebar-section {
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .pro-sidebar-section:hover {
          background: rgba(255,255,255,0.05);
        }

        .pro-contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.85rem;
        }

        .pro-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pro-contact-item span {
          font-size: 20px;
          color: #9ab4bb;
        }

        .pro-skill-list, .pro-interest-list, .pro-sidebar-edu-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.9rem;
          padding-left: 5px;
        }

        /* Pill Header Styling */
        .pro-pill-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .pro-pill-box {
          background: #5b8591;
          color: white;
          padding: 6px 20px;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
          font-weight: 700;
          font-size: 1.05rem;
          white-space: nowrap;
        }

        .pro-pill-line {
          flex: 1;
          height: 1px;
          background: #5b8591;
          opacity: 0.5;
        }

        .pro-sidebar .pro-pill-box {
          background: #5b8591;
          font-size: 0.95rem;
        }

        .pro-sidebar .pro-pill-line {
          background: rgba(255,255,255,0.3);
        }

        /* Main Content Styling */
        .pro-main {
          flex: 1;
          background: white;
          padding: 40px 35px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .pro-main-section {
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .pro-main-section:hover {
          background: #fcfcfc;
        }

        .pro-bio-text {
          font-size: 1rem;
          text-align: justify;
          color: #34495e;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .pro-item-list {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .pro-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pro-item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .pro-item-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .pro-item-time {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .pro-item-org {
          font-size: 1rem;
          color: #34495e;
          font-weight: 600;
        }

        .pro-item-desc {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          white-space: pre-wrap;
        }

        .pro-bullet-item {
          position: relative;
          padding-left: 20px;
          font-size: 0.95rem;
          color: #2c3e50;
        }

        .pro-bullet-item::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #5b8591;
          font-weight: bold;
        }

        .pro-award-item {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
        }

        .pro-award-year {
          font-weight: 700;
          width: 80px;
        }

        .pro-award-name {
          flex: 1;
          color: #34495e;
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="pro-sidebar">
        <div className="pro-avatar-section" onClick={() => onAvatarClick ? onAvatarClick() : onSectionClick('personal')}>
          <div className="pro-avatar-circle">
            <img src={avatar || avatarUrl || 'https://via.placeholder.com/200'} alt="Avatar" />
          </div>
          <div>
            <div className="pro-name">{fullName}</div>
            <div className="pro-major">{major}</div>
          </div>
        </div>

        {/* Contact */}
        <div className="pro-sidebar-section" onClick={() => onSectionClick('contact')}>
          <div className="pro-contact-list">
            <div className="pro-contact-item">
              <span className="material-symbols-outlined">call</span>
              {phone}
            </div>
            <div className="pro-contact-item">
              <span className="material-symbols-outlined">calendar_month</span>
              {dob}
            </div>
            <div className="pro-contact-item">
              <span className="material-symbols-outlined">mail</span>
              {email}
            </div>
            <div className="pro-contact-item">
              <span className="material-symbols-outlined">language</span>
              {website}
            </div>
            <div className="pro-contact-item">
              <span className="material-symbols-outlined">location_on</span>
              {address}
            </div>
          </div>
        </div>

        {/* Education in Sidebar as requested in screenshot */}
        <div className="pro-sidebar-section" onClick={() => onSectionClick('educations')}>
          <PillHeader title="Học vấn" light />
          <div className="pro-sidebar-edu-list">
            {(educations || []).length > 0 ? (educations || []).map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: '700' }}>{edu.major}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                </div>
                <div style={{ fontWeight: '600' }}>{edu.schoolName}</div>
                {edu.description && <div style={{ fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'pre-wrap' }}>{edu.description}</div>}
              </div>
            )) : (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: '700' }}>Cử nhân Public Relation & Advertising</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>2015 - 2019</div>
                <div style={{ fontWeight: '600' }}>Đại học Kinh tế TOPCV</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Đạt giải Nhì cuộc thi "Chiến lược truyền thông sáng tạo" do khoa PR tổ chức</div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="pro-sidebar-section" onClick={() => onSectionClick('skills')}>
          <PillHeader title="Kỹ năng" light />
          <div className="pro-skill-list">
            {(skills || []).length > 0 ? (skills || []).map((s, idx) => (
              <div key={idx} className="pro-bullet-item">{s.name}</div>
            )) : (
              ['Kỹ năng giao tiếp', 'Kỹ năng làm việc nhóm', 'Kỹ năng giải quyết vấn đề', 'Kỹ năng Quản lý thời gian', 'Kỹ năng tin học', 'Kỹ năng ngoại ngữ'].map((s, idx) => (
                <div key={idx} className="pro-bullet-item">{s}</div>
              ))
            )}
          </div>
        </div>

        {/* Interests */}
        <div className="pro-sidebar-section" onClick={() => onSectionClick('interests')}>
          <PillHeader title="Sở thích" light />
          <div className="pro-interest-list">
            {(interests || []).length > 0 ? (interests || []).map((it, idx) => (
              <div key={idx} className="pro-bullet-item">{it}</div>
            )) : (
              <div className="pro-bullet-item">Đọc sách về Phát triển bản thân</div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pro-main">
        {/* Bio */}
        <div className="pro-main-section" onClick={() => onSectionClick('bio')}>
          <PillHeader title="Mục tiêu nghề nghiệp" />
          <p className="pro-bio-text">{bio}</p>
        </div>

        {/* Work Experience */}
        <div className="pro-main-section" onClick={() => onSectionClick('experiences')}>
          <PillHeader title="Kinh nghiệm làm việc" />
          <div className="pro-item-list">
            {(experiences || []).length > 0 ? (experiences || []).map((exp, idx) => (
              <div key={idx} className="pro-item">
                <div className="pro-item-header">
                  <div className="pro-item-title">{exp.jobTitle}</div>
                  <div className="pro-item-time">
                    {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}
                  </div>
                </div>
                <div className="pro-item-org">{exp.companyName}</div>
                {exp.description && (
                  <ul className="pro-item-desc">
                    {(exp.description || '').split('\n').map((line, lidx) => (
                      <li key={lidx} className="pro-bullet-item">{line.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            )) : (
              <>
                <div className="pro-item">
                  <div className="pro-item-header">
                    <div className="pro-item-title">Content Leader</div>
                    <div className="pro-item-time">2023 - Nay</div>
                  </div>
                  <div className="pro-item-org">Công ty Công nghệ NTD Tech</div>
                  <ul className="pro-item-desc">
                    <li className="pro-bullet-item">Xây dựng chiến lược nội dung cho website, social media và các kênh digital...</li>
                    <li className="pro-bullet-item">Quản lý đội ngũ nhóm 10 thành viên, phối hợp chặt chẽ với team Media...</li>
                    <li className="pro-bullet-item">Dẫn dắt các dự án nội dung trọng điểm như: Ra mắt sản phẩm mới...</li>
                    <li className="pro-bullet-item">Phân tích dữ liệu từ GA4, Meta Insights và Looker Studio...</li>
                  </ul>
                </div>
                <div className="pro-item">
                  <div className="pro-item-header">
                    <div className="pro-item-title">Content Executive → Content Team Lead</div>
                    <div className="pro-item-time">2019 - 2023</div>
                  </div>
                  <div className="pro-item-org">Agency NDS – Marketing & Advertising</div>
                  <ul className="pro-item-desc">
                    <li className="pro-bullet-item">Triển khai và quản lý hơn 100 chiến dịch nội dung cho các thương hiệu FMCG...</li>
                    <li className="pro-bullet-item">Làm việc trực tiếp với khách hàng để đề xuất chiến lược nội dung...</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Awards */}
        <div className="pro-main-section" onClick={() => onSectionClick('awards')}>
          <PillHeader title="Danh hiệu và giải thưởng" />
          <div className="pro-item-list">
            {(awards || []).length > 0 ? (awards || []).map((a, idx) => (
              <div key={idx} className="pro-award-item">
                <span className="pro-award-year">{a.time}</span>
                <span className="pro-award-name">
                  <div style={{ fontWeight: '700' }}>{a.name}</div>
                  {a.description && <div style={{ fontSize: '0.85rem', color: '#5b8591', whiteSpace: 'pre-wrap' }}>{a.description}</div>}
                </span>
              </div>
            )) : (
              <div className="pro-award-item">
                <span className="pro-award-year">2022</span>
                <span className="pro-award-name">Top 5 Chiến dịch Content hiệu quả nhất năm</span>
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="pro-main-section" onClick={() => onSectionClick('certifications')}>
          <PillHeader title="Chứng chỉ" />
          <div className="pro-item-list">
            {(certifications || []).length > 0 ? (certifications || []).map((c, idx) => (
              <div key={idx} className="pro-award-item">
                <span className="pro-award-year">{c.issueDate}</span>
                <span className="pro-award-name">
                  <div style={{ fontWeight: '700' }}>{c.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#5b8591' }}>{c.issuer} {c.expirationDate ? ` (Hết hạn: ${c.expirationDate})` : ''}</div>
                </span>
              </div>
            )) : (
              <div className="pro-award-item">
                <span className="pro-award-year">2022</span>
                <span className="pro-award-name">Google Digital Garage: Fundamentals of Digital Marketing</span>
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        {(projects || []).length > 0 && (
          <div className="pro-main-section" onClick={() => onSectionClick('projects')}>
            <PillHeader title="Dự án đã tham gia" />
            <div className="pro-item-list">
              {projects.map((p, idx) => (
                <div key={idx} className="pro-item">
                  <div className="pro-item-header">
                    <div className="pro-item-title">{p.name}</div>
                    <div className="pro-item-time">{p.year}</div>
                  </div>
                  <div className="pro-item-org">{p.role} {p.techStack ? ` | ${p.techStack}` : ''}</div>
                  {p.description && <div className="pro-bio-text" style={{ fontSize: '0.9rem', marginTop: '5px' }}>{p.description}</div>}
                  {p.demoUrl && <div style={{ fontSize: '0.85rem', color: '#5b8591' }}>Link: {p.demoUrl}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        {(activities || []).length > 0 && (
          <div className="pro-main-section" onClick={() => onSectionClick('activities')}>
            <PillHeader title="Hoạt động" />
            <div className="pro-item-list">
              {activities.map((act, idx) => (
                <div key={idx} className="pro-item">
                  <div className="pro-item-header">
                    <div className="pro-item-title">{act.name}</div>
                    <div className="pro-item-time">{act.startDate} - {act.endDate || 'Hiện tại'}</div>
                  </div>
                  <div className="pro-item-org">{act.organization} — {act.role}</div>
                  {act.description && <div className="pro-bio-text" style={{ fontSize: '0.9rem', marginTop: '5px' }}>{act.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
