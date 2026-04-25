import React from 'react';

const PremiumITTemplate = ({ cvData, onSectionClick, themeColor = '#2c73b3' }) => {
    const cv = cvData || {};

    const {
        fullName = 'TRẦN VIỆT HUY',
        major = 'IT Developer',
        avatar,
        avatarUrl,
        email = 'huy_2251220239@dau.edu.vn',
        phone = '0856766210',
        address = 'Hải Châu, Đà Nẵng',
        bio = 'Tôi là một lập trình viên nhiệt huyết với đam mê tạo ra những trải nghiệm người dùng tuyệt vời. Mong muốn tìm kiếm cơ hội học hỏi và đóng góp cho các dự án sáng tạo.',
        skills = [
            { name: 'Tin học văn phòng', level: '80%' },
            { name: 'Làm việc nhóm', level: '90%' },
            { name: 'Thuyết trình', level: '70%' },
            { name: 'Sale', level: '60%' }
        ],
        educations = [
            { schoolName: 'ĐẠI HỌC TOPCV', major: 'Quản trị Doanh nghiệp', startDate: '10/2010', endDate: '05/2014', description: 'Tốt nghiệp loại Giỏi, điểm trung bình 8.0' }
        ],
        experiences = [
            { companyName: 'CÔNG TY TOPCV', jobTitle: 'Nhân viên bán hàng', startDate: '03/2015', endDate: 'Hiện tại', description: '- Hỗ trợ viết bài quảng cáo sản phẩm qua kênh facebook, các forum...\n- Giới thiệu, tư vấn sản phẩm, giải đáp các vấn đề thắc mắc của khách hàng...' }
        ],
        certifications = [
            { name: 'TOEIC - 800', issueDate: '2014' }
        ],
        awards = [
            { name: 'NHÂN VIÊN XUẤT SẮC NĂM CÔNG TY TOPCV', time: '2015' }
        ],
        interests = ['Đọc sách', 'Bơi lội', 'Piano']
    } = cv;

    const displayAvatar = avatar || avatarUrl || 'https://via.placeholder.com/150';

    return (
        <div className="premium-it-cv">
            <style>{`
                .premium-it-cv {
                    display: flex;
                    min-height: 1120px;
                    width: 794px;
                    background: white;
                    font-family: 'Inter', sans-serif;
                    color: #334155;
                }
                .cv-sidebar {
                    width: 35%;
                    background: ${themeColor};
                    color: white;
                    padding: 40px 25px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .cv-main {
                    width: 65%;
                    padding: 40px 35px;
                    background: white;
                }
                .cv-avatar-container {
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    border: 5px solid rgba(255,255,255,0.8);
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                .cv-avatar-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .cv-sidebar-name {
                    font-size: 24px;
                    font-weight: 900;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 5px;
                }
                .cv-sidebar-major {
                    font-size: 14px;
                    font-style: italic;
                    margin-bottom: 30px;
                    opacity: 0.9;
                }
                .cv-sidebar-info {
                    width: 100%;
                    font-size: 12px;
                    margin-bottom: 30px;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                }
                .sidebar-section {
                    width: 100%;
                    margin-bottom: 30px;
                }
                .sidebar-title {
                    font-size: 18px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-bottom: 2px solid rgba(255,255,255,0.3);
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                }
                .skill-bar-container {
                    margin-bottom: 15px;
                }
                .skill-name {
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                .skill-track {
                    height: 8px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .skill-progress {
                    height: 100%;
                    background: white;
                    border-radius: 4px;
                }
                .main-section {
                    margin-bottom: 35px;
                }
                .main-title-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                }
                .main-title-icon {
                    background: ${themeColor};
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .main-title-text {
                    font-size: 18px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #1e293b;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                }
                .item-name {
                    font-weight: 800;
                    font-size: 15px;
                    color: #1e293b;
                    text-transform: uppercase;
                }
                .item-date {
                    font-size: 12px;
                    font-weight: 700;
                    color: #64748b;
                }
                .item-sub {
                    font-style: italic;
                    font-size: 13px;
                    margin-bottom: 8px;
                    color: #475569;
                }
                .item-desc {
                    font-size: 13px;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }
                .interest-list {
                    list-style: none;
                    padding: 0;
                }
                .interest-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                    font-size: 13px;
                }
                .interest-dot {
                    width: 6px;
                    height: 6px;
                    background: white;
                    border-radius: 50%;
                }
            `}</style>

            <div className="cv-sidebar" onClick={() => onSectionClick?.('personal')}>
                <div className="cv-avatar-container">
                    <img src={displayAvatar} alt="Profile" />
                </div>
                <div className="cv-sidebar-name">{fullName}</div>
                <div className="cv-sidebar-major">{major}</div>

                <div className="cv-sidebar-info">
                    <div className="info-item">
                        <span>📞</span> {phone}
                    </div>
                    <div className="info-item">
                        <span>✉️</span> {email}
                    </div>
                    <div className="info-item">
                        <span>📍</span> {address}
                    </div>
                </div>

                <div className="sidebar-section" onClick={(e) => { e.stopPropagation(); onSectionClick?.('skills'); }}>
                    <div className="sidebar-title">Kỹ năng</div>
                    {skills.map((s, i) => (
                        <div key={i} className="skill-bar-container">
                            <div className="skill-name">{s.name}</div>
                            <div className="skill-track">
                                <div className="skill-progress" style={{ width: s.level.includes('%') ? s.level : '70%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sidebar-section" onClick={(e) => { e.stopPropagation(); onSectionClick?.('bio'); }}>
                    <div className="sidebar-title">Mục tiêu nghề nghiệp</div>
                    <div style={{ fontSize: '13px', lineHeight: '1.6', textAlign: 'justify' }}>{bio}</div>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-title">Sở thích</div>
                    <ul className="interest-list">
                        {interests.map((it, i) => (
                            <li key={i} className="interest-item">
                                <span className="interest-dot"></span> {it}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="cv-main">
                <div className="main-section" onClick={() => onSectionClick?.('educations')}>
                    <div className="main-title-container">
                        <div className="main-title-icon">🎓</div>
                        <div className="main-title-text">Học vấn</div>
                    </div>
                    {educations.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div className="item-header">
                                <div className="item-name">{edu.schoolName}</div>
                                <div className="item-date">{edu.startDate} - {edu.endDate}</div>
                            </div>
                            <div className="item-sub">Chuyên ngành: {edu.major}</div>
                            <div className="item-desc">{edu.description}</div>
                        </div>
                    ))}
                </div>

                <div className="main-section" onClick={() => onSectionClick?.('experiences')}>
                    <div className="main-title-container">
                        <div className="main-title-icon">💼</div>
                        <div className="main-title-text">Kinh nghiệm làm việc</div>
                    </div>
                    {experiences.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div className="item-header">
                                <div className="item-name">{exp.companyName}</div>
                                <div className="item-date">{exp.startDate} - {exp.endDate}</div>
                            </div>
                            <div className="item-sub">{exp.jobTitle}</div>
                            <div className="item-desc">{exp.description}</div>
                        </div>
                    ))}
                </div>

                <div className="main-section" onClick={() => onSectionClick?.('certifications')}>
                    <div className="main-title-container">
                        <div className="main-title-icon">📄</div>
                        <div className="main-title-text">Chứng chỉ</div>
                    </div>
                    {certifications.map((cert, i) => (
                        <div key={i} className="item-header">
                            <div className="item-name">{cert.name}</div>
                            <div className="item-date">{cert.issueDate}</div>
                        </div>
                    ))}
                </div>

                <div className="main-section" onClick={() => onSectionClick?.('awards')}>
                    <div className="main-title-container">
                        <div className="main-title-icon">🏆</div>
                        <div className="main-title-text">Giải thưởng</div>
                    </div>
                    {awards.map((aw, i) => (
                        <div key={i} className="item-header">
                            <div className="item-name">{aw.name}</div>
                            <div className="item-date">{aw.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PremiumITTemplate;
