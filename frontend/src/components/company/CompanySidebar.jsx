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
    label: 'Đặt lịch làm việc', to: '/company/booking' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>, 
    label: 'Đăng tin tuyển dụng', to: '/company/management' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, 
    label: 'Quản lý ứng viên',
    children: [
      { label: 'Ứng viên đã ứng tuyển', to: '/company/management/candidates' },
      { label: 'Ứng viên đã lưu', to: '/company/candidates/saved' },
      { label: 'Tìm ứng viên', to: '/company/candidates/search' },
    ]
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
  const [expandedMenus, setExpandedMenus] = useState(['Quản lý ứng viên']); // Mặc định mở menu ứng viên

  React.useEffect(() => {
    let currentItem = null;
    
    NAV_ITEMS.forEach(item => {
      if (item.to === location.pathname) currentItem = item;
      if (item.children) {
        const child = item.children.find(c => c.to === location.pathname);
        if (child) {
          currentItem = child;
          if (!expandedMenus.includes(item.label)) {
            setExpandedMenus(prev => [...prev, item.label]);
          }
        }
      }
    });
    
    if (!currentItem) {
      // Logic fallback cho route lồng nhau
      NAV_ITEMS.forEach(item => {
        if (item.to && item.to !== '/company/dashboard' && item.to !== '#' && location.pathname.startsWith(item.to)) {
          currentItem = item;
        }
        if (item.children) {
          item.children.forEach(child => {
            if (location.pathname.startsWith(child.to)) currentItem = child;
          });
        }
      });
    }
    
    setActiveCategory(currentItem?.label || '');
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

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
        <span className="brand-name">Five Core</span>
      </div>

      <div className="cs-nav">
        {NAV_ITEMS.map((item, idx) => {
          const isParentActive = item.children?.some(c => c.label === activeCategory);
          const isActive = activeCategory === item.label || isParentActive;
          const isExpanded = expandedMenus.includes(item.label);
          
          if (item.children) {
            return (
              <div key={idx} className={`cs-nav-group ${isExpanded ? 'expanded' : ''}`}>
                <div 
                  className={`cs-nav-item parent ${isActive ? 'active' : ''} intro-x`}
                  onClick={() => toggleMenu(item.label)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <span className="cs-icon">{item.icon}</span>
                  <span className="cs-nav-label">{item.label}</span>
                  <span className={`cs-arrow ${isExpanded ? 'open' : ''}`}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </div>
                
                {isExpanded && (
                  <div className="cs-sub-menu">
                    {item.children.map((child, cIdx) => (
                      <NavLink
                        key={cIdx}
                        to={child.to}
                        className={({ isActive }) => `cs-sub-item ${isActive ? 'active' : ''}`}
                      >
                        <span className="sub-dot"></span>
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={idx} className="cs-nav-group">
              <Link
                to={item.to}
                className={`cs-nav-item ${isActive ? 'active' : ''} intro-x`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="cs-icon">{item.icon}</span>
                <span className="cs-nav-label">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default CompanySidebar;
