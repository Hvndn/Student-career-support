import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/company/CompanySidebar.css';

const NAV_ITEMS = [
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>, 
    label: 'Tổng quan', to: '/company/dashboard' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>, 
    label: 'Đặt lịch làm việc', to: '#' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>, 
    label: 'Đăng tin tuyển dụng', to: '/company/management' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, 
    label: 'Quản lý ứng viên', to: '/company/management/candidates' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, 
    label: 'Hồ sơ công ty', to: '/company/profile' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, 
    label: 'Thử thách dự án', to: '#' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>, 
    label: 'Trò chuyện', to: '/company/chat' 
  },
];

const CompanySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('');

  React.useEffect(() => {
    const currentItem = NAV_ITEMS.find(item => {
      if (location.pathname === item.to) return true;
      if (item.to !== '/company/dashboard' && item.to !== '#' && location.pathname.startsWith(item.to)) return true;
      return false;
    });
    
    setActiveCategory(currentItem?.label || '');
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="company-sidebar persistent">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="brand-name">DAU Connect</span>
      </div>

      <nav className="cs-nav">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = activeCategory === item.label;
          
          return (
            <div key={idx} className="cs-nav-group">
              <Link
                to={item.to}
                className={`cs-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="cs-icon">{item.icon}</span>
                <span className="cs-nav-label">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="cs-bottom">
        <button className="cs-logout-btn" onClick={handleLogout}>
          <span className="cs-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </span>
          <span className="cs-nav-label">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;
