import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CompanySidebar.css';

const NAV_ITEMS = [
  { icon: '⊞', label: 'Tổng quan', to: '/company/dashboard' },
  { icon: '💼', label: 'Việc làm', to: '/company/jobs/post' },
  { icon: '👥', label: 'Ứng viên', to: '/company/management/jobs/1/applicants' },
  { icon: '💬', label: 'Tin nhắn', to: '#' },
  { icon: '⚙️', label: 'Cài đặt', to: '/company/profile' },
];

const CompanySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="company-sidebar">
      {/* Logo */}
      <div className="cs-logo">
        <Link to="/company/dashboard">
          <span className="cs-logo-icon">🎯</span>
          <span className="cs-logo-text">Nexus Talent</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="cs-nav">
        {NAV_ITEMS.map(item => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/company/dashboard' && location.pathname.startsWith(item.to.split('?')[0]));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`cs-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="cs-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Post a Job CTA */}
      <div className="cs-post-cta">
        <Link to="/company/jobs/post" className="cs-post-btn">
          + Đăng tin mới
        </Link>
      </div>

      {/* Bottom */}
      <div className="cs-bottom">
        <a href="#" className="cs-bottom-link">
          <span>❓</span> Trung tâm hỗ trợ
        </a>
        <button className="cs-logout" onClick={handleLogout}>
          <span>🚪</span> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;
