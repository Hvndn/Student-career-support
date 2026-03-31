import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
import '../../assets/css/student/Home.css';

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

const SkillRadar = ({ skills }) => {
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 100;
  const angleStep = (Math.PI * 2) / skills.length;

  const points = skills.map((s, i) => {
    const r = (s.value / 100) * radius;
    const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="sbd-skill-radar-svg">
      {gridLevels.map(level => {
        const levelPoints = skills.map((_, i) => {
          const r = level * radius;
          const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
          const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
          return `${x},${y}`;
        }).join(' ');
        return <polygon key={level} points={levelPoints} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {skills.map((_, i) => {
        const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
        return <line key={i} x1={centerX} y1={centerY} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <polygon points={points} fill="rgba(37, 99, 235, 0.2)" stroke="#2563eb" strokeWidth="2" />
      {skills.map((s, i) => {
        const r = radius + 25;
        const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="600">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
};

const StudentDashboard = ({ user, handleLogout }) => {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    studentApi.getProfile()
      .then(res => setProfile(res.data.data))
      .catch(console.error);

    studentApi.getNotifications()
      .then(res => setNotifications(res.data.data || []))
      .catch(console.error);
  }, []);

  const displayName = profile?.fullName || user?.fullName || 'Người dùng';
  
  const skillsData = [
    { name: 'React', value: 85 },
    { name: 'Node.js', value: 70 },
    { name: 'Design', value: 90 },
    { name: 'SQL', value: 60 },
    { name: 'Git', value: 80 },
  ];

  const roadmapData = [
    { title: 'Thực tập sinh', time: 'Đã hoàn thành', active: true },
    { title: 'Junior Dev', time: 'Hiện tại', active: true },
    { title: 'Senior Dev', time: 'Dự kiến 2026', active: false },
    { title: 'Tech Lead', time: 'Mục tiêu xa', active: false },
  ];

  return (
    <div className="student-home" style={{ paddingBottom: '4rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="sbd-container">
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Xin chào, {displayName.split(' ').pop()} ✨
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '0.5rem 0 0' }}>Bảng điều khiển nghề nghiệp thông minh của bạn.</p>
          </div>
          <button onClick={handleLogout} style={{ 
            background: 'none', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', 
            borderRadius: '8px', color: '#64748b', fontSize: '0.9rem', cursor: 'pointer' 
          }}>
            Đăng xuất
          </button>
        </header>

        <div className="sbd-grid">
          <div className="sbd-card sbd-profile">
            <div className="sbd-profile-header">
              <div className="sbd-avatar-wrapper">
                <svg className="sbd-progress-ring">
                  <circle cx="68" cy="68" r="64" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle cx="68" cy="68" r="64" fill="none" stroke="#2563eb" strokeWidth="8" 
                    strokeDasharray="402" strokeDashoffset="100" strokeLinecap="round" />
                </svg>
                <img src={profile?.avatar || "https://ui-avatars.com/api/?name=" + displayName} alt={displayName} className="sbd-avatar-circle" />
              </div>
              <div className="sbd-profile-info">
                <span className="sbd-profile-tag">Professional Level</span>
                <h3>{displayName}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{profile?.bio || 'Hồ sơ của bạn đã hoàn thành 75%.'}</p>
              </div>
              <Link to="/student/profile" className="sh-how-btn sh-how-btn-blue" style={{ width: 'auto', padding: '0.6rem 2rem' }}>
                Chỉnh sửa hồ sơ
              </Link>
            </div>
          </div>

          <div className="sbd-card sbd-stats-1">
            <div className="sbd-stat-box">
              <span className="sbd-stat-value">12</span>
              <span className="sbd-stat-label">Kỹ năng xác thực</span>
              <div style={{ marginTop: '1rem', color: '#16a34a', fontSize: '0.8rem', fontWeight: 700 }}>
                ↑ 2 mới tuần này
              </div>
            </div>
          </div>

          <div className="sbd-card sbd-stats-2">
            <div className="sbd-stat-box">
              <span className="sbd-stat-value">05</span>
              <span className="sbd-stat-label">Đang ứng tuyển</span>
              <div style={{ marginTop: '1rem', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 700 }}>
                2 đang được xem xét
              </div>
            </div>
          </div>

          <div className="sbd-card sbd-skills">
            <div className="sbd-skills-visual">
              <h4 className="footer-section-title" style={{ color: '#1e293b', marginBottom: '1rem' }}>Phân tích kỹ năng</h4>
              <div className="sbd-radar-container">
                <SkillRadar skills={skillsData} />
              </div>
            </div>
          </div>

          <div className="sbd-card sbd-jobs">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 className="footer-section-title" style={{ color: '#1e293b', marginBottom: 0 }}>Gợi ý cho bạn</h4>
              <Link to="/jobs" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>Xem tất cả</Link>
            </div>
            <div className="sbd-job-list">
              {[
                { title: 'Senior React Developer', co: 'TechFlow', match: 98 },
                { title: 'Product Designer', co: 'CreativeBox', match: 85 },
                { title: 'Frontend Intern', co: 'Startup Hub', match: 92 }
              ].map((job, i) => (
                <div key={i} className="sbd-job-item">
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{job.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{job.co}</div>
                  </div>
                  <span className="sbd-job-match">{job.match}% Match</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sbd-card sbd-roadmap">
            <h4 className="footer-section-title" style={{ color: '#1e293b', marginBottom: '1rem' }}>Lộ trình sự nghiệp</h4>
            <div className="sbd-roadmap-track">
              {roadmapData.map((step, i) => (
                <div key={i} className={`sbd-roadmap-node ${step.active ? 'active' : ''}`}>
                  <div className="sbd-node-dot" />
                  <div className="sbd-node-title">{step.title}</div>
                  <div className="sbd-node-time">{step.time}</div>
                </div>
              ))}
            </div>
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
              <Link to="/login?role=company" className="sh-how-btn sh-how-btn-green">
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
    </div>
  );
};

export default Home;
