import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', to: '/student/dashboard' },
  { icon: '💼', label: 'Việc làm', to: '/jobs' },
  { icon: '📋', label: 'Đơn ứng tuyển', to: '/student/applications' },
  { icon: '🔖', label: 'Đã lưu', to: '/student/saved' },
  { icon: '🔔', label: 'Thông báo', to: '/student/notifications' },
  { icon: '👤', label: 'Hồ sơ', to: '/student/profile' },
  { icon: '⚙️', label: 'Cài đặt', to: '#' },
];

const sidebarStyle = {
  width: '250px',
  minHeight: '100vh',
  background: '#fff',
  borderRight: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0, left: 0,
  zIndex: 200,
  fontFamily: "'Inter', sans-serif",
};

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.3rem' }}>🎯</span>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>Nexus Talent</span>
        </Link>
      </div>

      {/* Badge */}
      <div style={{ padding: '0.6rem 1.5rem 0' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', color: '#9ca3af' }}>
          TÀI KHOẢN SINH VIÊN
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/student/dashboard' && item.to !== '#' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.85rem', borderRadius: '10px', textDecoration: 'none',
                color: isActive ? '#2563eb' : '#4b5563',
                background: isActive ? '#eff6ff' : 'transparent',
                fontWeight: isActive ? 700 : 500, fontSize: '0.9rem',
                transition: 'all 0.18s',
              }}
            >
              <span style={{ fontSize: '1.05rem', width: '22px', textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1rem 0.8rem 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: '10px', textDecoration: 'none', color: '#6b7280', fontSize: '0.88rem' }}>
          <span>❓</span> Trung tâm hỗ trợ
        </a>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.85rem', borderRadius: '10px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#ef4444', fontSize: '0.88rem',
            fontFamily: "'Inter', sans-serif", width: '100%', textAlign: 'left',
          }}
        >
          <span>🚪</span> Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
