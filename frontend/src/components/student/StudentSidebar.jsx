import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/student/StudentSidebar.css';

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', to: '/student/dashboard' },
  { icon: '💼', label: 'Việc làm', to: '/jobs' },
  { icon: '📋', label: 'Đơn ứng tuyển', to: '/student/applications' },
  { icon: '🔖', label: 'Đã lưu', to: '/student/saved' },
  { icon: '📅', label: 'Phỏng vấn', to: '/student/interviews' },
  { icon: '🔔', label: 'Thông báo', to: '/student/notifications' },
  { icon: '👤', label: 'Hồ sơ', to: '/student/profile' },
  { icon: '⚙️', label: 'Cài đặt', to: '#' },
];

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="student-sidebar">
      {/* Logo */}
      <div className="ss-header">
        <Link to="/" className="ss-brand">
          <span className="ss-brand-icon">🎯</span>
          <span className="ss-brand-name">Fivecore</span>
        </Link>
      </div>

      {/* Badge */}
      <div className="ss-badge-section">
        <span className="ss-badge-text">
          TÀI KHOẢN SINH VIÊN
        </span>
      </div>

      {/* Nav */}
      <nav className="ss-nav">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/student/dashboard' && item.to !== '#' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`ss-nav-item ${isActive ? 'active' : 'inactive'}`}
            >
              <span className="ss-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="ss-bottom">
        <a href="#" className="ss-bottom-link">
          <span>❓</span> Trung tâm hỗ trợ
        </a>
        <button onClick={handleLogout} className="ss-logout-btn">
          <span>🚪</span> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
