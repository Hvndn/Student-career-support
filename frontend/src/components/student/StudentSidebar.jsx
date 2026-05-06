import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMessaging } from '../../context/MessagingContext';
import '../../assets/css/student/StudentSidebar.css';

const NAV_ITEMS = [
  { icon: 'grid', label: 'Tổng quan', to: '/student/dashboard' },
  { 
    icon: 'briefcase', 
    label: 'Việc làm', 
    to: '/jobs',
    subItems: [
      { label: 'Tìm việc làm', to: '/jobs' },
      { label: 'Thực tập tốt nghiệp', to: '/student/internships' },
      { label: 'Việc làm đã ứng tuyển', to: '/student/applications' },
      { label: 'Việc làm yêu thích', to: '/student/saved' }
    ]
  },
  { icon: 'building', label: 'Danh sách công ty', to: '/companies' },
  { icon: 'calendar', label: 'Lịch phỏng vấn', to: '/student/interviews' },
  { icon: 'file-text', label: 'Quản lý CV', to: '/student/cv-management' },
  { icon: 'user', label: 'Hồ sơ & Portfolio', to: '/student/profile' },
];

const StudentSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsChatOpen, isChatOpen } = useMessaging();
  const [expandedItem, setExpandedItem] = useState('Việc làm');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    // Close sidebar on route change for mobile
    if (window.innerWidth <= 1024) {
      onClose();
    }
    // Automatically expand if a sub-item's path is active
    NAV_ITEMS.forEach(item => {
      if (item.subItems) {
        const isChildActive = item.subItems.some(sub => location.pathname === sub.to);
        if (isChildActive) setExpandedItem(item.label);
      }
    });
  }, [location.pathname]);

  const getIcon = (name) => {
    switch (name) {
      case 'grid': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
      );
      case 'briefcase': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
      );
      case 'award': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
      );
      case 'users': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
      );
      case 'building': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg>
      );
      case 'message-square': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      );
      case 'file-text': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14.5 2 14.5 7 20 7"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
      );
      case 'user': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      );
      case 'calendar': return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      );
      default: return null;
    }
  };

  const handleToggle = (label) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <aside className={`student-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="ss-header">
        <Link to="/" className="ss-brand">
          <div className="ss-logo-box">
             <img src="/favicon.svg" alt="DAU" className="ss-logo-img" />
          </div>
          <span className="ss-brand-name">Fivecore</span>
        </Link>
        <button className="ss-mobile-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="ss-nav">
        {NAV_ITEMS.map((item, index) => {
          const isExpanded = expandedItem === item.label;
          const isActive = location.pathname === item.to || (item.subItems && item.subItems.some(sub => location.pathname === sub.to));
          
          return (
            <div key={index} className={`ss-nav-section ${isExpanded ? 'is-expanded' : ''}`}>
              {item.subItems ? (
                <button 
                  className={`ss-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleToggle(item.label)}
                >
                  <span className="ss-nav-icon">{getIcon(item.icon)}</span>
                  <span className="ss-nav-label">{item.label}</span>
                  <span className={`ss-nav-arrow ${isExpanded ? 'rotated' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </button>
              ) : item.label === 'Trò chuyện' ? (
                <div
                  className={`ss-nav-item ${isActive || isChatOpen ? 'active' : ''}`}
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="ss-nav-icon">{getIcon(item.icon)}</span>
                  <span className="ss-nav-label">{item.label}</span>
                </div>
              ) : (
                <Link
                  to={item.to}
                  className={`ss-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="ss-nav-icon">{getIcon(item.icon)}</span>
                  <span className="ss-nav-label">{item.label}</span>
                </Link>
              )}

              {item.subItems && isExpanded && (
                <div className="ss-sub-menu">
                    {item.subItems.map((sub, sIdx) => {
                        const isSubActive = location.pathname === sub.to;
                        return (
                            <Link 
                                key={sIdx} 
                                to={sub.to} 
                                className={`ss-sub-item ${isSubActive ? 'active' : ''}`}
                            >
                                <span className="ss-sub-icon">
                                    <span className="material-symbols-outlined">{sub.label.includes('Tìm') ? 'search' : sub.label.includes('Thực tập') ? 'school' : sub.label.includes('ứng tuyển') ? 'description' : 'favorite'}</span>
                                </span>
                                <span className="ss-sub-label">{sub.label}</span>
                            </Link>
                        );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="ss-footer">
        <button className="ss-logout-btn" onClick={handleLogout}>
          <span className="ss-nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </span>
          <span className="ss-nav-label">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
