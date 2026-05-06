import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { companyApi, recruitmentApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import { FiUsers, FiCalendar, FiBriefcase } from 'react-icons/fi';
import '../../assets/css/company/CompanyTopbar.css';

const CompanyTopbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawUser = localStorage.getItem('user');
  const user = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : {};
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  
  const [companyData, setCompanyData] = useState({
    name: user?.fullName || 'Doanh nghiệp',
    email: user?.email || ''
  });
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyApi.getProfile();
      if (response.data.status === 'success') {
        setCompanyData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotif(true);
    try {
      const response = await recruitmentApi.getNotifications();
      if (response.data.status === 'success' || response.data.success) {
        const data = response.data.data || [];
        
        // Transform system notifications into UI format
        const notifs = data.map(n => {
          const t = (n.title || '').toLowerCase();
          let type = 'system';
          let icon = 'purple';
          
          if (t.includes('ứng tuyển') || t.includes('hồ sơ')) {
            type = 'application';
            icon = 'blue';
          } else if (t.includes('xác nhận') || t.includes('phỏng vấn')) {
            type = 'interview';
            icon = 'green';
          }

          return {
            id: n.id,
            type: type,
            title: n.title,
            content: n.message,
            time: n.createdAt ? formatDate(n.createdAt) : 'Gần đây',
            unread: !n.isRead,
            icon: icon
          };
        });
        setNotifications(notifs);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotif(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  useEffect(() => {
    fetchCompanyProfile();
    fetchNotifications();
    
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    
    window.addEventListener('companyProfileUpdated', fetchCompanyProfile);
    return () => {
      window.removeEventListener('companyProfileUpdated', fetchCompanyProfile);
      clearInterval(interval);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => n.unread);
      await Promise.all(unreadNotifs.map(n => recruitmentApi.markNotificationAsRead(n.id)));
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await recruitmentApi.markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Breadcrumb mapping
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: 'Five Core', to: '/company/dashboard' }];
    
    if (path.includes('/dashboard')) crumbs.push({ label: 'Tổng quan' });
    else if (path.includes('/candidates/suggested')) crumbs.push({ label: 'Gợi ý ứng viên phù hợp' });
    else if (path.includes('/management/candidates')) crumbs.push({ label: 'Ứng viên đã ứng tuyển' });
    else if (path.includes('/management')) crumbs.push({ label: 'Tin tuyển dụng' });
    else if (path.includes('/profile')) crumbs.push({ label: 'Hồ sơ công ty' });
    else if (path.includes('/employer/pricing')) crumbs.push({ label: 'Dịch vụ' });
    
    return crumbs;
  };

  const crumbs = getBreadcrumbs();
  const companyName = companyData.name || 'Fivecore';

  return (
    <header className="cd-topbar revamped">
      <div className="cd-topbar-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-company-sidebar'))}
          aria-label="Toggle Sidebar"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <nav className="cd-breadcrumbs">
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="crumb-separator">/</span>}
              <span className={`crumb-item ${idx === crumbs.length - 1 ? 'active' : ''}`}>
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="cd-topbar-right">
        <button 
          className="tb-action-btn" 
          title="Trò chuyện"
          onClick={() => navigate('/company/chat')}
        >
          <span className="tb-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </span>
        </button>

        <div className={`notification-container ${isNotifOpen ? 'open' : ''}`} ref={notifRef}>
          <button 
            className="tb-action-btn" 
            title="Thông báo"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <span className="tb-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </span>
            {unreadCount > 0 && <span className="tb-badge">{unreadCount}</span>}
          </button>

          <div className="notif-dropdown">
            <div className="notif-header">
              <h4>Thông báo</h4>
              {unreadCount > 0 && <button className="mark-read-btn" onClick={markAllRead}>Đánh dấu đã đọc</button>}
            </div>
            <div className="notif-body">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`notif-item ${n.unread ? 'unread' : ''}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className={`notif-icon-box ${n.icon}`}>
                      {n.type === 'application' && <FiUsers size={20} />}
                      {n.type === 'interview' && <FiCalendar size={20} />}
                      {n.type === 'system' && <FiBriefcase size={20} />}
                    </div>
                    <div className="notif-content">
                      <div className="notif-item-title-row">
                        <span className="notif-item-title-text">{n.title}</span>
                      </div>
                      <div className="notif-text" dangerouslySetInnerHTML={{ __html: n.content }}></div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notif-empty">
                  <i className="fa-regular fa-bell-slash"></i>
                  <p>Bạn chưa có thông báo nào</p>
                </div>
              )}
            </div>
            <div className="notif-footer">
              <Link to="/company/management/candidates" className="view-all-btn" onClick={() => setIsNotifOpen(false)}>
                Xem tất cả thông báo
              </Link>
            </div>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div
          className={`cd-user-container ${isDropdownOpen ? 'dropdown-open' : ''}`}
          ref={dropdownRef}
        >
          <div
            className="cd-user-profile"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsDropdownOpen(prev => !prev)}
          >
            <div className="user-avatar-box">
              {companyData.logoUrl ? (
                <img src={getImageUrl(companyData.logoUrl)} alt="Logo" className="tb-avatar" />
              ) : (
                <div className="tb-avatar-placeholder">
                  {String(companyName || 'D').charAt(0)}
                </div>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{companyName}</span>
              <span className="user-role">Nhà tuyển dụng</span>
            </div>
            <span className={`cd-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </div>

          <div className="cd-profile-dropdown shadow-lg">
             <div className="cd-dropdown-header">
                <h4>{companyName}</h4>
                <p className="cd-dropdown-email">{companyData.email}</p>
             </div>
             
             <div className="cd-dropdown-divider"></div>
             
             <div className="cd-dropdown-menu">
                <Link to="/company/profile" className="cd-dropdown-item">
                  <span className="item-icon">🏢</span>
                  Hồ sơ công ty
                </Link>
                <Link to="/company/employer/pricing" className="cd-dropdown-item">
                  <span className="item-icon">💳</span>
                  Dịch vụ & Gói tin
                </Link>
                <div className="cd-dropdown-divider"></div>
                <button 
                  className="cd-dropdown-item logout" 
                  onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                  }}
                >
                  <span className="item-icon">🚪</span>
                  Đăng xuất
                </button>
              </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default CompanyTopbar;
