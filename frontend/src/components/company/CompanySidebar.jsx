import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/company/CompanySidebar.css';

const NAV_ITEMS = [
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>, 
    label: 'Bảng tin', to: '/company/dashboard' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>, 
    label: 'Tin đăng', to: '/company/management',
    subItems: [
      { 
        label: 'Quản lý tin đăng', to: '/company/management',
        icon: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      },
      { 
        label: 'Tạo tin tuyển dụng', to: '/company/jobs/post',
        icon: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
      }
    ]
  },
// ... (rest of NAV_ITEMS remains similar)
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, 
    label: 'Ứng viên', to: '/company/management/candidates',
    subItems: [
      { 
        label: 'Hồ sơ ứng tuyển', to: '/company/management/candidates',
        icon: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
      },
      { 
        label: 'Hồ sơ đã lưu', to: '/company/candidates/saved',
        icon: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      },
      { 
        label: 'Tìm ứng viên mới', to: '/company/candidates/search',
        icon: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><path d="M11 8v6"></path><path d="M8 11h6"></path></svg>
      },
      { 
        label: 'Quản lý thẻ', to: '/company/candidates/tags',
        icon: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
      },
      { 
        label: 'Thông báo hồ sơ phù hợp', to: '/company/candidates/notifications',
        icon: <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M12 2v2"></path></svg>
      }
    ]
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>, 
    label: 'Trò chuyện', to: '/company/chat' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>, 
    label: 'Dịch vụ', to: '/employer/pricing' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, 
    label: 'Tài khoản', to: '/company/profile' 
  },
  { 
    icon: <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>, 
    label: 'Hỗ trợ', to: '#' 
  },
];

const CompanySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  React.useEffect(() => {
    // Sort items by 'to' length descending to find the most specific match first
    const sortedItems = [...NAV_ITEMS].sort((a, b) => (b.to?.length || 0) - (a.to?.length || 0));

    const currentItem = sortedItems.find(item => {
      if (location.pathname === item.to) return true;
      if (item.to !== '/company/dashboard' && item.to !== '#' && location.pathname.startsWith(item.to)) return true;
      if (item.subItems?.some(sub => location.pathname.startsWith(sub.to))) return true;
      // Special case for jobs creation sub-paths
      if (location.pathname.startsWith('/company/jobs')) {
        return item.label === 'Tin đăng';
      }
      return false;
    });
    
    const categoryKey = currentItem?.label || '';
    setActiveCategory(categoryKey);

    // If the category has sub-items or we are on dashboard, ensure it's pinned
    if (currentItem?.subItems || location.pathname === '/company/dashboard') {
      setIsPinned(true);
    }
  }, [location.pathname]);

  const [blockHover, setBlockHover] = React.useState(false);

  const toggleSidebar = () => {
    if (isPinned) {
      // Locking hover briefly when closing to prevent ghosts
      setBlockHover(true);
      setTimeout(() => setBlockHover(false), 600);
    }
    setIsPinned(!isPinned);
  };

  React.useEffect(() => {
    if (isPinned) {
      document.body.classList.add('sidebar-pinned');
    } else {
      document.body.classList.remove('sidebar-pinned');
    }
    return () => document.body.classList.remove('sidebar-pinned');
  }, [isPinned]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={`company-sidebar ${isPinned ? 'pinned' : ''} ${blockHover ? 'block-hover' : ''}`}>
      {/* Nav */}
      <nav className="cs-nav">
        <button className="cs-toggle" onClick={toggleSidebar}>
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

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

              {item.subItems && (
                <div className="cs-sub-menu">
                  <div className="cs-sub-menu-inner">
                    <div className="cs-sub-header">{item.label}</div>
                    {item.subItems.map((sub, sIdx) => {
                      const isSubActive = location.pathname === sub.to || 
                        (sub.to === '/company/jobs/post' && location.pathname.startsWith('/company/jobs'));

                      return (
                        <NavLink 
                          key={sIdx} 
                          to={sub.to} 
                          className={`cs-sub-item ${isSubActive ? 'active' : ''}`}
                        >
                          <span className="cs-sub-icon">{sub.icon}</span> 
                          <span className="cs-sub-label">{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="cs-bottom">
        <a href="#" className="cs-bottom-link">
          <span className="cs-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </span> 
        </a>
        <button className="cs-logout" onClick={handleLogout}>
          <span className="cs-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </span> 
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;
