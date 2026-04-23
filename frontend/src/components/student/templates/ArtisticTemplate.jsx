import React from 'react';

const ArtisticTemplate = ({ cvData, onSectionClick, onUpdate, onAvatarClick, themeColor = '#2c73b3' }) => {
  const cv = cvData;
  if (!cv) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu CV...</div>;

  const {
    fullName = 'NGUYỄN VĂN A',
    major = 'Nhân viên kinh doanh',
    avatar,
    avatarUrl,
    email = 'nguyenvana@gmail.com',
    phone = '0987654321',
    address = 'Số 1 đường Cầu Giấy, Hà Nội',
    dob = '09/10/1992',
    gender = 'Nam',
    website = 'www.fb.com/nguyena',
    bio = 'Áp dụng những kinh nghiệm về kỹ năng bán hàng và sự hiểu biết về thị trường để trở thành một nhân viên bán hàng chuyên nghiệp, mang đến nhiều giá trị cho khách hàng. Từ đó giúp Công ty tăng số lượng khách hàng và mở rộng tập khách hàng.',
    skills = [],
    educations = [],
    experiences = [],
    certifications = [],
    awards = [],
    projects = [],
    activities = [],
    interests = []
  } = cv;

  // Icons Helper
  const IconCircle = ({ icon }) => (
    <div className="art-icon-circle">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  );

  return (
    <div className="artistic-cv-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .artistic-cv-container {
          display: flex;
          width: 210mm;
          min-height: 297mm;
          background: white;
          font-family: 'Inter', sans-serif;
          color: #334155;
          line-height: 1.4;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        /* Sidebar Style */
        .art-sidebar {
          width: 33%;
          background: ${themeColor};
          color: white;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .art-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .art-avatar-circle {
          width: 155px;
          height: 155px;
          border-radius: 50%;
          border: 4px solid white;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .art-avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .art-name {
          font-size: 1.55rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
          line-height: 1.2;
          color: white !important;
        }

        .art-major {
          font-size: 0.95rem;
          font-style: italic;
          opacity: 0.95;
          font-weight: 500;
          color: rgba(255,255,255,0.9) !important;
        }

        .art-sidebar-section {
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .art-sidebar-section:hover {
          background: rgba(255,255,255,0.08);
        }

        .art-section-title-light {
          font-size: 1.15rem;
          font-weight: 800;
          text-transform: uppercase;
          border-bottom: 2px solid rgba(255,255,255,0.4);
          padding-bottom: 6px;
          margin-bottom: 15px;
          letter-spacing: 0.5px;
          color: white !important;
        }

        .art-contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .art-contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(255,255,255,0.95) !important;
        }

        .art-contact-item span {
          font-size: 18px;
          opacity: 0.9;
          color: white !important;
        }

        .art-skill-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .art-skill-item {
          width: 100%;
        }

        .art-skill-name {
          font-size: 0.85rem;
          margin-bottom: 6px;
          display: block;
          font-weight: 500;
          color: white !important;
        }

        .art-skill-bar-bg {
          width: 100%;
          height: 9px;
          background: rgba(255,255,255,0.25);
          border-radius: 0px;
          overflow: hidden;
        }

        .art-skill-bar-fill {
          height: 100%;
          background: white;
        }

        .art-sidebar-text {
          font-size: 0.82rem;
          line-height: 1.5;
          text-align: justify;
          white-space: pre-wrap;
          color: rgba(255,255,255,0.95) !important;
        }

        .art-bullet-list {
          list-style: none;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .art-bullet-item {
          position: relative;
          padding-left: 18px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.95) !important;
        }

        .art-bullet-item::before {
          content: "•";
          position: absolute;
          left: 0;
          font-weight: bold;
          color: white !important;
        }

        /* Main Content Style */
        .art-main {
          flex: 1;
          padding: 30px 25px;
          background: white;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .art-main-section {
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .art-main-section:hover {
          background: #f8fafc;
        }

        .art-header-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          border-bottom: 2px solid ${themeColor};
          padding-bottom: 6px;
        }

        .art-icon-circle {
          width: 32px;
          height: 32px;
          background: ${themeColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .art-icon-circle span {
          font-size: 18px;
        }

        .art-main-title {
          font-size: 1.15rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #1e293b;
          letter-spacing: 0.5px;
        }

        .art-item-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .art-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .art-item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .art-item-org {
          font-size: 1rem;
          font-weight: 800;
          color: #1e293b;
          text-transform: uppercase;
        }

        .art-item-time {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
        }

        .art-item-sub {
          font-size: 0.9rem;
          color: #475569;
          font-style: italic;
          font-weight: 500;
        }

        .art-item-desc {
          font-size: 0.88rem;
          margin-top: 4px;
          white-space: pre-wrap;
          color: #334155;
          line-height: 1.5;
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="art-sidebar">
        {/* Avatar & Name */}
        <div className="art-avatar-section" onClick={() => onAvatarClick ? onAvatarClick() : onSectionClick('personal')}>
          <div className="art-avatar-circle">
            <img src={avatar || avatarUrl || 'https://via.placeholder.com/150'} alt="Avatar" />
          </div>
          <div className="art-name">{fullName}</div>
          <div className="art-major">{major}</div>
        </div>

        {/* Contact info (Icons match Image 2 order approximately) */}
        <div className="art-sidebar-section" onClick={() => onSectionClick('contact')}>
          <div className="art-contact-list">
            {dob && <div className="art-contact-item"><span className="material-symbols-outlined">calendar_month</span>{dob}</div>}
            {gender && <div className="art-contact-item"><span className="material-symbols-outlined">person</span>{gender}</div>}
            {phone && <div className="art-contact-item"><span className="material-symbols-outlined">call</span>{phone}</div>}
            {email && <div className="art-contact-item"><span className="material-symbols-outlined">mail</span>{email}</div>}
            {address && <div className="art-contact-item"><span className="material-symbols-outlined">location_on</span>{address}</div>}
            {website && <div className="art-contact-item"><span className="material-symbols-outlined">info</span>{website}</div>}
          </div>
        </div>

        {/* Skills */}
        <div className="art-sidebar-section" onClick={() => onSectionClick('skills')}>
          <h3 className="art-section-title-light">KỸ NĂNG</h3>
          <div className="art-skill-list">
            {(skills || []).length > 0 ? (
                (skills || []).map((s, idx) => (
                    <div key={idx} className="art-skill-item">
                        <span className="art-skill-name">{s.name}</span>
                        <div className="art-skill-bar-bg">
                            <div className="art-skill-bar-fill" style={{ width: `${s.level || 80}%` }}></div>
                        </div>
                    </div>
                ))
            ) : (
                ['Tin học văn phòng', 'Làm việc nhóm', 'Thuyết trình', 'Sale'].map((s, i) => (
                    <div key={i} className="art-skill-item">
                        <span className="art-skill-name">{s}</span>
                        <div className="art-skill-bar-bg">
                            <div className="art-skill-bar-fill" style={{ width: i === 0 ? '70%' : i === 1 ? '85%' : '60%' }}></div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Bio / Mục tiêu */}
        <div className="art-sidebar-section" onClick={() => onSectionClick('bio')}>
          <h3 className="art-section-title-light">MỤC TIÊU NGHỀ NGHIỆP</h3>
          <p className="art-sidebar-text">{bio}</p>
        </div>

        {/* Interests */}
        <div className="art-sidebar-section" onClick={() => onSectionClick('interests')}>
          <h3 className="art-section-title-light">SỞ THÍCH</h3>
          <ul className="art-bullet-list">
            {(interests || []).length > 0 ? (
                (interests || []).map((it, idx) => <li key={idx} className="art-bullet-item">{it}</li>)
            ) : (
                ['Đọc sách', 'Bơi lội', 'Piano'].map((it, idx) => <li key={idx} className="art-bullet-item">{it}</li>)
            )}
          </ul>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="art-main">
        {/* Education */}
        <div className="art-main-section" onClick={() => onSectionClick('educations')}>
          <div className="art-header-wrap">
            <IconCircle icon="school" />
            <h3 className="art-main-title">HỌC VẤN</h3>
          </div>
          <div className="art-item-list">
            {(educations || []).length > 0 ? (
              (educations || []).map((edu, idx) => (
                <div key={idx} className="art-item">
                  <div className="art-item-header">
                    <div className="art-item-org">{edu.schoolName}</div>
                    <div className="art-item-time">{edu.startDate} {edu.endDate ? ` - ${edu.endDate}` : ''}</div>
                  </div>
                  <div className="art-item-sub">Chuyên ngành: {edu.major}</div>
                  {edu.description && <div className="art-item-desc">{edu.description}</div>}
                </div>
              ))
            ) : (
              <div className="art-item">
                <div className="art-item-header">
                  <div className="art-item-org">ĐẠI HỌC TOPCV</div>
                  <div className="art-item-time">10/2010 - 05/2014</div>
                </div>
                <div className="art-item-sub">Chuyên ngành: Quản trị Doanh nghiệp</div>
                <div className="art-item-desc">Tốt nghiệp loại Giỏi, điểm trung bình 8.0</div>
              </div>
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div className="art-main-section" onClick={() => onSectionClick('experiences')}>
          <div className="art-header-wrap">
            <IconCircle icon="work" />
            <h3 className="art-main-title">KINH NGHIỆM LÀM VIỆC</h3>
          </div>
          <div className="art-item-list">
            {(experiences || []).length > 0 ? (
              (experiences || []).map((exp, idx) => (
                <div key={idx} className="art-item">
                  <div className="art-item-header">
                    <div className="art-item-org">{exp.companyName}</div>
                    <div className="art-item-time">{exp.startDate} {exp.endDate ? ` - ${exp.endDate}` : ''}</div>
                  </div>
                  <div className="art-item-sub">{exp.jobTitle}</div>
                  <div className="art-item-desc">{exp.description}</div>
                </div>
              ))
            ) : (
              <div className="art-item">
                <div className="art-item-header">
                  <div className="art-item-org">CÔNG TY TOPCV</div>
                  <div className="art-item-time">03/2015 - HIỆN TẠI</div>
                </div>
                <div className="art-item-sub">Nhân viên bán hàng</div>
                <div className="art-item-desc">
                  - Hỗ trợ viết bài quảng cáo sản phẩm qua kênh facebook, các forum...<br/>
                  - Giới thiệu, tư vấn sản phẩm, giải đáp các vấn đề thắc mắc của khách hàng...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activities */}
        {(activities || []).length > 0 && (
          <div className="art-main-section" onClick={() => onSectionClick('activities')}>
            <div className="art-header-wrap">
              <IconCircle icon="groups" />
              <h3 className="art-main-title">HOẠT ĐỘNG</h3>
            </div>
            <div className="art-item-list">
              {activities.map((act, idx) => (
                <div key={idx} className="art-item">
                  <div className="art-item-header">
                    <div className="art-item-org">{act.name}</div>
                    <div className="art-item-time">{act.startDate} {act.endDate ? ` - ${act.endDate}` : ''}</div>
                  </div>
                  <div className="art-item-sub">{act.organization} — {act.role}</div>
                  {act.description && <div className="art-item-desc">{act.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        <div className="art-main-section" onClick={() => onSectionClick('certifications')}>
          <div className="art-header-wrap">
            <IconCircle icon="description" />
            <h3 className="art-main-title">CHỨNG CHỈ</h3>
          </div>
          <div className="art-item-list">
            {(certifications || []).length > 0 ? (
              (certifications || []).map((cer, idx) => (
                <div key={idx} className="art-item">
                  <div className="art-item-header">
                    <div className="art-item-org">{cer.name}</div>
                    <div className="art-item-time">{cer.issueDate}</div>
                  </div>
                  <div className="art-item-sub">{cer.issuer}</div>
                </div>
              ))
            ) : (
              <div className="art-item">
                <div className="art-item-header">
                  <div className="art-item-org">TOEIC - 800</div>
                  <div className="art-item-time">2014</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Awards */}
        <div className="art-main-section" onClick={() => onSectionClick('awards')}>
          <div className="art-header-wrap">
            <IconCircle icon="workspace_premium" />
            <h3 className="art-main-title">GIẢI THƯỞNG</h3>
          </div>
          <div className="art-item-list">
            {(awards || []).length > 0 ? (
              (awards || []).map((a, idx) => (
                <div key={idx} className="art-item">
                  <div className="art-item-header">
                    <div className="art-item-org">{a.name}</div>
                    <div className="art-item-time">{a.time}</div>
                  </div>
                  {a.description && <div className="art-item-desc">{a.description}</div>}
                </div>
              ))
            ) : (
              <div className="art-item">
                <div className="art-item-header">
                  <div className="art-item-org">NHÂN VIÊN XUẤT SẮC NĂM CÔNG TY TOPCV</div>
                  <div className="art-item-time">2015</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        {(projects || []).length > 0 && (
          <div className="art-main-section" onClick={() => onSectionClick('projects')}>
            <div className="art-header-wrap">
              <IconCircle icon="account_tree" />
              <h3 className="art-main-title">DỰ ÁN</h3>
            </div>
            <div className="art-item-list">
              {projects.map((p, idx) => (
                <div key={idx} className="art-item">
                  <div className="art-item-header">
                    <div className="art-item-org">{p.name}</div>
                    <div className="art-item-time">{p.year}</div>
                  </div>
                  <div className="art-item-sub">{p.role} {p.techStack ? ` | ${p.techStack}` : ''}</div>
                  {p.description && <div className="art-item-desc">{p.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisticTemplate;
