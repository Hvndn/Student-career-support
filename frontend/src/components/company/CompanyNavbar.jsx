import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { companyApi } from '../../api';
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
      const response = await companyApi.getDashboard(7);
      if (response.data.status === 'success' || response.data.success) {
        const recent = response.data.data.recentCandidates || [];
        
        // Lấy danh sách ID đã đọc từ localStorage
        const readIds = JSON.parse(localStorage.getItem('company_read_notifs') || '[]');

        // Transform recent applications into notifications
        const notifs = recent.map(app => ({
          id: app.id,
          type: 'application',
          content: `Ứng viên <b>${app.studentName}</b> vừa ứng tuyển vào công việc <b>${app.jobTitle}</b>`,
          time: app.appliedAt ? formatDate(app.appliedAt) : 'Gần đây',
          unread: !readIds.includes(app.id), // Chỉ unread nếu chưa có trong list đã đọc
          icon: 'blue'
        }));
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
    window.addEventListener('companyProfileUpdated', fetchCompanyProfile);
    return () => {
      window.removeEventListener('companyProfileUpdated', fetchCompanyProfile);
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

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const readIds = JSON.parse(localStorage.getItem('company_read_notifs') || '[]');
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    localStorage.setItem('company_read_notifs', JSON.stringify(newReadIds));
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    const readIds = JSON.parse(localStorage.getItem('company_read_notifs') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('company_read_notifs', JSON.stringify(readIds));
    }
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
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
        <div className="topbar-actions">
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
              <span className="user-role">Quản trị viên</span>
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
