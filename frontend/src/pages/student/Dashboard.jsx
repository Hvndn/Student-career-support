import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api';
import '../../assets/css/student/Dashboard.css';

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
    <svg viewBox={`0 0 ${size} ${size}`} className="sd-radar-svg">
      {gridLevels.map(level => {
        const levelPoints = skills.map((_, i) => {
          const r = level * radius;
          const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
          const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
          return `${x},${y}`;
        }).join(' ');
        return <polygon key={level} points={levelPoints} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />;
      })}
      {skills.map((_, i) => {
        const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
        return <line key={i} x1={centerX} y1={centerY} x2={x} y2={y} stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />;
      })}
      <polygon points={points} fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="3" />
      {skills.map((s, i) => {
        const r = radius + 30;
        const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="12" fill="#475569" fontWeight="700">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
};

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await studentApi.getProfile();
        setProfile(profileRes.data.data);
        
        const notifRes = await studentApi.getNotifications();
        setNotifications(notifRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const displayName = profile?.fullName || 'Người dùng';
  
  const skillsData = [
    { name: 'React', value: 85 },
    { name: 'Node.js', value: 70 },
    { name: 'Design', value: 90 },
    { name: 'SQL', value: 60 },
    { name: 'Git', value: 80 },
  ];

  const roadmapData = [
    { title: 'Thực tập sinh', status: 'completed', active: true },
    { title: 'Junior Dev', status: 'current', active: true },
    { title: 'Senior Dev', status: 'planned', active: false },
    { title: 'Tech Lead', status: 'target', active: false },
  ];

  if (loading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  return (
    <div className="student-dashboard-page">
      <div className="sd-container">
        <header className="sd-header">
          <div className="sd-welcome">
            <h1>Xin chào, {displayName.split(' ').pop()} ⚡️</h1>
            <p>Khám phá cơ hội và bứt phá sự nghiệp của bạn ngay hôm nay.</p>
          </div>
        </header>

        <div className="sd-bento-grid">
          {/* Profile Section */}
          <div className="sd-glass-card sd-area-profile">
            <div className="sd-profile-content">
              <div className="sd-avatar-orb">
                <svg className="sd-progress-circle">
                  <circle cx="80" cy="80" r="75" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                  <circle cx="80" cy="80" r="75" fill="none" stroke="#2563eb" strokeWidth="6" 
                    strokeDasharray="471" strokeDashoffset="117" strokeLinecap="round" />
                </svg>
                <img 
                  src={profile?.avatar || "https://ui-avatars.com/api/?name=" + displayName + "&background=2563eb&color=fff"} 
                  alt={displayName} 
                  className="sd-avatar-img" 
                />
              </div>
              <div className="sd-profile-info">
                <span className="sd-badge-premium">Expert Candidate</span>
                <h3>{displayName}</h3>
                <div 
                  className="sd-profile-bio"
                  dangerouslySetInnerHTML={{ 
                    __html: profile?.bio || 'Hồ sơ của bạn đã hoàn thành 75%. Hãy cập nhật thêm kỹ năng!' 
                  }} 
                />
              </div>
              <Link to="/student/profile" className="sd-btn-prime">
                <span className="sd-btn-icon">✨</span> Chỉnh sửa hồ sơ
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="sd-glass-card sd-area-stats-1">
            <div className="sd-stat-content">
              <div className="sd-stat-value">12</div>
              <div className="sd-stat-label">Kỹ năng xác thực</div>
              <div className="sd-stat-trend">↑ 2 mới tuần này</div>
            </div>
          </div>

          <div className="sd-glass-card sd-area-stats-2">
            <div className="sd-stat-content">
              <div className="sd-stat-value">05</div>
              <div className="sd-stat-label">Đang ứng tuyển</div>
              <div className="sd-stat-trend">2 đang được xem xét</div>
            </div>
          </div>

          {/* Skills Radar */}
          <div className="sd-glass-card sd-area-skills">
            <div className="sd-card-header">
              <h4 className="sd-card-title">Phân tích kỹ năng</h4>
            </div>
            <div className="sd-radar-wrapper">
              <SkillRadar skills={skillsData} />
            </div>
          </div>

          {/* Job Recommendations */}
          <div className="sd-glass-card sd-area-jobs">
            <div className="sd-card-header">
              <h4 className="sd-card-title">Gợi ý dành cho bạn</h4>
              <Link to="/jobs" className="sd-link-more">Xem tất cả →</Link>
            </div>
            <div className="sd-job-list">
              {[
                { title: 'Senior React Developer', co: 'TechFlow', match: 98 },
                { title: 'Product Designer', co: 'CreativeBox', match: 85 },
                { title: 'Frontend Intern', co: 'Startup Hub', match: 92 }
              ].map((job, i) => (
                <div key={i} className="sd-job-item">
                  <div className="sd-job-meta">
                    <h4>{job.title}</h4>
                    <span>{job.co}</span>
                  </div>
                  <div className="sd-match-pills">{job.match}% Match</div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div className="sd-glass-card sd-area-roadmap">
            <div className="sd-card-header">
              <h4 className="sd-card-title">Lộ trình sự nghiệp</h4>
            </div>
            <div className="sd-roadmap-track">
              {roadmapData.map((step, i) => (
                <div key={i} className={`sd-roadmap-node ${step.active ? 'active' : ''}`}>
                  <div className="sd-node-dot" />
                  <div className="sd-node-label">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
