import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
import '../../assets/css/Home.css';

const CATEGORIES = [
  { icon: '💻', label: 'IT & Software', count: '1.2k+' },
  { icon: '📢', label: 'Marketing', count: '408+' },
  { icon: '🎨', label: 'Graphic Design', count: '430+' },
  { icon: '💰', label: 'Finance', count: '417+' },
];

const HOW_IT_WORKS_CANDIDATE = [
  { step: 1, title: 'Tạo hồ sơ', desc: 'Tạo hồ sơ nổi bật chỉ với vài bước, để nhà tuyển dụng tìm thấy bạn.' },
  { step: 2, title: 'Ứng tuyển', desc: 'Nộp đơn dễ dàng và theo dõi trạng thái ứng tuyển mọi lúc mọi nơi.' },
  { step: 3, title: 'Nhận việc', desc: 'Nhận được công việc phù hợp nhất và bứt phá sự nghiệp của bạn.' },
];

const HOW_IT_WORKS_RECRUITER = [
  { step: 1, title: 'Đăng tin', desc: 'Đăng tin tuyển dụng nhanh chóng, tiếp cận hàng nghìn ứng viên tiềm năng.' },
  { step: 2, title: 'Lọc ứng viên', desc: 'Lọc và xem xét hồ sơ ứng viên phù hợp với công việc của bạn.' },
  { step: 3, title: 'Tuyển dụng', desc: 'Lựa chọn ứng viên hoàn hảo và xây dựng đội ngũ mơ ước.' },
];

const JOB_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

const StudentDashboard = ({ user, handleLogout }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    studentApi.getProfile()
      .then(res => setProfile(res.data.data))
      .catch(console.error);
  }, []);

  const displayName = profile?.fullName || user?.fullName || 'Người dùng';
  const displayAvatar = profile?.avatarUrl || user?.avatar || "https://vectorified.com/images/default-avatar-icon-33.png";

  return (
    <div className="sd-main" style={{ background: '#f8fafd', minHeight: '100vh', padding: '2rem 3rem' }}>
      <div style={{ padding: '0 0 2rem 0' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
          Chào mừng trở lại, {displayName.split(' ').pop()} 👋
        </h1>
        <p style={{ color: '#64748b' }}>Hôm nay là một ngày tuyệt vời để phát triển sự nghiệp của bạn.</p>
      </div>
      <div className="sd-grid">
        {/* Left Column */}
        <div className="sd-content-left">
          {/* Profile Progress */}
          <div className="sd-card">
            <div className="sd-progress-header">
              <div className="sd-progress-title">
                <h3>Tiến độ hồ sơ chuyên nghiệp</h3>
                <p>Hồ sơ của bạn đạt mức: <span style={{ color: '#2563eb', fontWeight: 600 }}>Khá</span></p>
              </div>
              <span className="sd-progress-percent">75%</span>
            </div>
            <div className="sd-progress-bar-bg">
              <div className="sd-progress-bar-fill" style={{ width: '75%' }}></div>
            </div>
            <div className="sd-suggestion-box">
              <p className="sd-suggestion-title">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lightbulb</span>
                Gợi ý hoàn thiện
              </p>
              <div className="sd-suggestion-list">
                <div className="sd-suggestion-item">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#3b82f6' }}>add_circle</span>
                  Bổ sung chứng chỉ ngoại ngữ (IELTS/TOEIC)
                </div>
                <div className="sd-suggestion-item">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#3b82f6' }}>add_circle</span>
                  Thêm liên kết Portfolio hoặc GitHub
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="sd-stats-grid">
            <div className="sd-card sd-stat-card">
              <div className="sd-stat-icon emerald">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <p className="sd-stat-label">Kỹ năng</p>
              <p className="sd-stat-value">12</p>
              <p className="sd-stat-trend emerald">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> +2 tháng này
              </p>
            </div>
            <div className="sd-card sd-stat-card">
              <div className="sd-stat-icon blue">
                <span className="material-symbols-outlined">terminal</span>
              </div>
              <p className="sd-stat-label">Dự án</p>
              <p className="sd-stat-value">08</p>
              <p className="sd-stat-trend blue">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span> 3 đã hoàn thành
              </p>
            </div>
            <div className="sd-card sd-stat-card">
              <div className="sd-stat-icon purple">
                <span className="material-symbols-outlined">send</span>
              </div>
              <p className="sd-stat-label">Đơn ứng tuyển</p>
              <p className="sd-stat-value">05</p>
              <p className="sd-stat-trend purple">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span> 2 đang xem xét
              </p>
            </div>
          </div>

          {/* Recommended Jobs */}
          <section>
            <div className="sd-section-header">
              <h3>
                <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>auto_awesome</span>
                Việc làm gợi ý cho bạn
              </h3>
              <Link to="/jobs" className="sd-view-link">Xem tất cả</Link>
            </div>
            <div className="sd-job-list">
              <div className="sd-card sd-job-card">
                <div className="sd-job-content">
                  <div className="sd-company-logo">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" />
                  </div>
                  <div className="sd-job-info">
                    <div className="sd-job-title-row">
                      <div>
                        <p className="sd-job-title">UI/UX Designer Intern</p>
                        <p className="sd-job-company">Figma Vietnam • TP. Hồ Chí Minh</p>
                      </div>
                      <span className="sd-job-badge">Mới</span>
                    </div>
                    <div className="sd-job-tags">
                      <span className="sd-job-tag">Figma</span>
                      <span className="sd-job-tag">Design System</span>
                      <span className="sd-job-tag sd-job-match">Trùng khớp 95%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sd-card sd-job-card">
                <div className="sd-job-content">
                  <div className="sd-company-logo">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                  </div>
                  <div className="sd-job-info">
                    <div className="sd-job-title-row">
                      <div>
                        <p className="sd-job-title">Frontend Developer (React)</p>
                        <p className="sd-job-company">Google Operations • Từ xa</p>
                      </div>
                      <span className="sd-job-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>2 ngày trước</span>
                    </div>
                    <div className="sd-job-tags">
                      <span className="sd-job-tag">ReactJS</span>
                      <span className="sd-job-tag">TailwindCSS</span>
                      <span className="sd-job-tag sd-job-match">Trùng khớp 88%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="sd-content-right">
          {/* Notifications */}
          <div className="sd-card sd-notifications">
            <div className="sd-section-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem' }}>Thông báo</h3>
              <button className="sd-view-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Đánh dấu đã đọc</button>
            </div>
            <div className="sd-notif-list">
              <div className="sd-notif-item">
                <div className="sd-notif-line"></div>
                <div className="sd-notif-icon blue">
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>work</span>
                </div>
                <div className="sd-notif-text">
                  <p>Đơn ứng tuyển được xem xét</p>
                  <p>Figma Vietnam đã xem hồ sơ của bạn cho vị trí UI/UX Designer.</p>
                  <p className="sd-notif-time">10 phút trước</p>
                </div>
              </div>
              <div className="sd-notif-item">
                <div className="sd-notif-line"></div>
                <div className="sd-notif-icon emerald">
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
                </div>
                <div className="sd-notif-text">
                  <p>Kỹ năng mới được xác thực</p>
                  <p>Kỹ năng "ReactJS" của bạn đã được xác thực bởi cộng đồng.</p>
                  <p className="sd-notif-time">2 giờ trước</p>
                </div>
              </div>
              <div className="sd-notif-item">
                <div className="sd-notif-icon amber">
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>warning</span>
                </div>
                <div className="sd-notif-text">
                  <p>Nhắc nhở hoàn thiện hồ sơ</p>
                  <p>Hãy thêm chứng chỉ ngoại ngữ để tăng 25% cơ hội được mời phỏng vấn.</p>
                  <p className="sd-notif-time">Hôm qua</p>
                </div>
              </div>
            </div>
            <button className="sd-upgrade-btn" style={{ background: 'transparent', border: '1px solid #e2e8f0', color: '#475569', marginTop: '1.5rem' }}>
              Xem tất cả thông báo
            </button>
          </div>

          {/* Events */}
          <div className="sd-card sd-event-card">
            <div className="sd-event-title">Sự kiện sắp tới</div>
            <div className="sd-event-list">
              <div className="sd-event-item">
                <div className="sd-event-date">
                  <span>15</span>
                  <span>THG 10</span>
                </div>
                <div className="sd-event-info">
                  <p>Career Fair 2024</p>
                  <p>Đại học Bách Khoa</p>
                </div>
              </div>
              <div className="sd-event-item">
                <div className="sd-event-date">
                  <span>18</span>
                  <span>THG 10</span>
                </div>
                <div className="sd-event-info">
                  <p>Workshop: CV Writing</p>
                  <p>Online qua Zoom</p>
                </div>
              </div>
            </div>
            <div className="sd-event-deco"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);

    jobApi.getJobs()
      .then(res => {
        setJobs(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  if (user?.role === 'ROLE_STUDENT') {
    return <StudentDashboard user={user} handleLogout={handleLogout} />;
  }

  return (
    <div className="student-home">
      {/* ── HERO ── */}
      <section className="sh-hero">
        <div className="sh-hero-inner">
          <div className="sh-hero-text">
            <h1>
              Tìm kiếm việc làm <span className="sh-blue">mơ ước</span> với{' '}
              <span className="sh-blue">Nexus Talent</span>
            </h1>
            <p>
              Kết nối với hơn 500+ doanh nghiệp hàng đầu và hàng nghìn cơ hội tuyển dụng dành riêng cho bạn.
            </p>

            {/* Search bar */}
            <div className="sh-searchbar">
              <div className="sh-search-field">
                <span className="sh-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Chức danh, kỹ năng..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
              </div>
              <div className="sh-search-divider" />
              <div className="sh-search-field">
                <span className="sh-search-icon">📍</span>
                <input
                  type="text"
                  placeholder="Địa điểm"
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                />
              </div>
              <Link
                to={`/jobs?keyword=${searchKeyword}&location=${searchLocation}`}
                className="sh-search-btn"
              >
                Tìm kiếm
              </Link>
            </div>

            {/* Popular tags */}
            <div className="sh-popular">
              <span className="sh-popular-label">Phổ biến:</span>
              {['Designer', 'Developer', 'Marketing'].map(tag => (
                <Link key={tag} to={`/jobs?keyword=${tag}`} className="sh-tag">{tag}</Link>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="sh-hero-illus">
            <div className="sh-illus-card">
              <div className="sh-illus-figure">
                <div className="sh-person sh-person-1" />
                <div className="sh-person sh-person-2" />
                <div className="sh-illus-laptop">💼</div>
              </div>
              <div className="sh-illus-badge">
                <span>🎯</span> Nexus Talent — Dành cho bạn
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="sh-section">
        <div className="sh-container">
          <div className="sh-section-head">
            <div>
              <span className="sh-section-label">NEXUS TALENT&nbsp;&bull;&nbsp;DANH MỤC NGHỀ NGHIỆP</span>
              <h2 className="sh-section-title">Khám phá danh mục</h2>
            </div>
            <Link to="/jobs" className="sh-viewall">Xem tất cả →</Link>
          </div>
          <div className="sh-categories-grid">
            {CATEGORIES.map(cat => (
              <Link to={`/jobs?category=${cat.label}`} key={cat.label} className="sh-cat-card">
                <span className="sh-cat-icon">{cat.icon}</span>
                <p className="sh-cat-name">{cat.label}</p>
                <p className="sh-cat-count">{cat.count} open positions</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="sh-section sh-featured-bg">
        <div className="sh-container">
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 className="sh-section-title">Việc làm nổi bật</h2>
            <p className="sh-section-sub">Những cơ hội tốt nhất đang chờ đón bạn ngay hôm nay.</p>
          </div>

          {loading ? (
            <div className="sh-loading">Đang tải danh sách việc làm...</div>
          ) : (
            <>
              <div className="sh-jobs-grid">
                {jobs.slice(0, 6).map((job, idx) => (
                  <div key={job.id} className="sh-job-card">
                    <div className="sh-job-top">
                      <div
                        className="sh-company-logo"
                        style={{ background: JOB_COLORS[idx % JOB_COLORS.length] }}
                      >
                        {(job.companyName || 'C').charAt(0)}
                      </div>
                      <span className="sh-job-badge sh-badge-new">Mới</span>
                    </div>
                    <h3 className="sh-job-title">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className="sh-job-company">{job.companyName}</p>
                    <div className="sh-job-tags">
                      {job.employmentType && (
                        <span className="sh-job-tag sh-tag-blue">{job.employmentType}</span>
                      )}
                      {job.level && (
                        <span className="sh-job-tag sh-tag-green">{job.level}</span>
                      )}
                    </div>
                    <div className="sh-job-footer">
                      <div className="sh-job-meta">
                        {job.location && <span>📍 {job.location}</span>}
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>
                      <Link to={`/jobs/${job.id}`} className="sh-job-apply">Xem →</Link>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <Link to="/jobs" className="sh-load-more">Xem thêm việc làm</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="sh-section">
        <div className="sh-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="sh-section-title">Nexus Talent hoạt động như thế nào?</h2>
            <p className="sh-section-sub">Quy trình đơn giản giúp bạn nhanh chóng tìm được công việc phù hợp.</p>
          </div>
          <div className="sh-how-grid">
            {/* For Candidates */}
            <div className="sh-how-card">
              <div className="sh-how-header">
                <span className="sh-how-emoji">👤</span>
                <h3>Dành cho Sinh viên</h3>
                <p>Tìm công việc mơ ước và phát triển sự nghiệp của bạn.</p>
              </div>
              <div className="sh-how-steps">
                {HOW_IT_WORKS_CANDIDATE.map(item => (
                  <div key={item.step} className="sh-step">
                    <div className="sh-step-num">{item.step}</div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {user ? (
                <Link to="/jobs" className="sh-how-btn sh-how-btn-blue">
                  Tìm việc ngay
                </Link>
              ) : (
                <Link to="/register" className="sh-how-btn sh-how-btn-blue">
                  Bắt đầu ngay
                </Link>
              )}
            </div>

            {/* For Recruiters */}
            <div className="sh-how-card sh-how-card-green">
              <div className="sh-how-header">
                <span className="sh-how-emoji">🏢</span>
                <h3>Dành cho Nhà tuyển dụng</h3>
                <p>Tìm kiếm và kết nối với những ứng viên tài năng.</p>
              </div>
              <div className="sh-how-steps">
                {HOW_IT_WORKS_RECRUITER.map(item => (
                  <div key={item.step} className="sh-step">
                    <div className="sh-step-num sh-step-green">{item.step}</div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/employer" className="sh-how-btn sh-how-btn-green">
                Đăng tin tuyển dụng ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="sh-cta">
        <div className="sh-cta-inner">
          <h2>Sẵn sàng bứt phá sự nghiệp?</h2>
          <p>
            Tham gia cùng Nexus Talent ngày hôm nay để mở những cánh cửa tiềm năng dành riêng cho bạn trên thị trường.
          </p>
          <div className="sh-cta-btns">
            {!user && <Link to="/register" className="sh-cta-btn-white">Đăng ký ngay</Link>}
            <Link to="/jobs" className="sh-cta-btn-outline">Tìm kiếm việc làm</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="sh-footer">
        <div className="sh-container">
          <div className="sh-footer-grid">
            <div className="sh-footer-brand">
              <strong className="sh-footer-logo">Nexus Talent</strong>
              <p>Kết nối tài năng với cơ hội từ hàng trăm doanh nghiệp hàng đầu Việt Nam.</p>
              <div className="sh-socials">
                {['𝕏', 'in', 'f', '▶'].map((s, i) => (
                  <a key={i} href="#" className="sh-social-icon">{s}</a>
                ))}
              </div>
            </div>
            <div className="sh-footer-col">
              <h4>SINH VIÊN</h4>
              <ul>
                <li><Link to="/jobs">Tìm việc làm</Link></li>
                <li>{user ? <Link to="/student/profile">Hồ sơ cá nhân</Link> : <Link to="/register">Tạo hồ sơ</Link>}</li>
                {!user && (
                  <>
                    <li><Link to="/login">Đăng nhập</Link></li>
                    <li><Link to="/register">Đăng ký miễn phí</Link></li>
                  </>
                )}
                {user && <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#374151', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}>Đăng xuất</button></li>}
              </ul>
            </div>
            <div className="sh-footer-col">
              <h4>NHÀ TUYỂN DỤNG</h4>
              <ul>
                <li><Link to="/employer">Đăng tin tuyển dụng</Link></li>
                <li><Link to="/employer#pricing">Bảng giá dịch vụ</Link></li>
                <li><Link to="/employer">Tìm ứng viên</Link></li>
              </ul>
            </div>
            <div className="sd-footer-col">
              <h4>VỀ CHÚNG TÔI</h4>
              <ul>
                <li><a href="#">Trung tâm hỗ trợ</a></li>
                <li><a href="#">Liên hệ</a></li>
                <li><a href="#">Điều khoản sử dụng</a></li>
              </ul>
            </div>
          </div>
          <div className="sh-footer-bottom">
            <p>© 2024 Nexus Talent. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
