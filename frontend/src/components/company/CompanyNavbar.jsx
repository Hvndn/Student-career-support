import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { companyApi } from '../../api';
import '../../assets/css/company/CompanyTopbar.css'; // Will add nested css rules in CompanyDashboard.css

const CompanyTopbar = ({ activeTab = 'Jobs' }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [companyData, setCompanyData] = useState({
    name: user.fullName || 'Đang tải...',
    email: user.email || '...'
  });

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

  useEffect(() => {
    fetchCompanyProfile();

    // Listen for profile updates from other components
    window.addEventListener('companyProfileUpdated', fetchCompanyProfile);
    return () => {
      window.removeEventListener('companyProfileUpdated', fetchCompanyProfile);
    };
  }, []);

  const companyName = companyData.name || 'Nexus Talent';
  const userEmail = companyData.email || user.email || '...';

  return (
    <header className="cd-topbar">
      <div className="cd-topbar-left">
        <Link to="/company/dashboard" className="cd-logo">
          <span className="cd-logo-icon">🎯</span>
          <span className="cd-logo-text">Nexus Talent</span>
        </Link>
        <div className="cd-nav-divider"></div>
        <Link to="/employer/pricing" className="cd-tab">Bảng giá</Link>
        <a href="#" className="cd-tab"><span className="nav-icon">🎁</span> Khuyến mãi</a>
        <Link to="/company/candidates/search" className="cd-tab">Tìm ứng viên</Link>
        <a href="#" className="cd-tab">Trợ giúp</a>
      </div>
      <div className="cd-topbar-right">
        <button className="cd-icon-btn cart-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </button>
        <button className="cd-icon-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>
        <div className="cd-user-container">
          <div className="cd-user">
            <div className="cd-company-icon">
              {companyData.logoUrl ? (
                <img src={companyData.logoUrl} alt="Logo" className="cd-topbar-avatar" />
              ) : (
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="12"></line><line x1="15" y1="22" x2="15" y2="12"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>
              )}
            </div>
            <div className="cd-user-info">
              <p className="cd-uname" title={companyName}>
                {companyName.length > 20 ? companyName.substring(0, 20) + '...' : companyName}
              </p>
              <p className="cd-urole badge-member">Tài khoản Member</p>
            </div>
            <span className="cd-dropdown-arrow">▼</span>
          </div>

          {/* Hover Dropdown */}
          <div className="cd-profile-dropdown">
            <div className="cd-dropdown-header">
              <h4>{companyName}</h4>
              <p className="cd-dropdown-email">{userEmail}</p>
              <div className="cd-auth-badge">
                <span className="warning-icon">⚠️</span> Tài khoản xác thực cấp 1 <span className="help-icon">?</span>
              </div>
            </div>

            <div className="cd-dropdown-progress">
              <div className="cd-progress-head">
                <span>Hoàn thiện tài khoản với các bước</span>
                <span>1/2</span>
              </div>
              <div className="cd-progress-item completed">
                <span className="check-icon">✓</span> Xác thực email
              </div>
              <div className="cd-progress-item pending">
                <div className="pending-left">
                  <span className="circle-icon">○</span> Xác thực giấy Đăng ký kinh doanh
                </div>
                <button className="action-arrow">→</button>
              </div>
            </div>

            <div className="cd-dropdown-links">
              <a href="#" className="cd-dropdown-link" onClick={(e) => { e.preventDefault(); navigate('/company/dashboard'); }}>
                <span className="link-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </span> 
                Trang quản lý Nhà Tuyển Dụng
              </a>
              <a href="#" className="cd-dropdown-link" onClick={(e) => { e.preventDefault(); navigate('/company/profile'); }}>
                <span className="link-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 7h8"></path><path d="M8 12h8"></path></svg>
                </span> 
                Cập nhật thông tin công ty
              </a>
              <a href="#" className="cd-dropdown-link text-danger" onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                navigate('/login');
              }}>
                <span className="link-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </span> 
                Đăng xuất
              </a>
            </div>
          </div>
        </div>
        <div className="cd-lang-switch">
          🇺🇸 {/* Flag placeholder */}
        </div>
      </div>
    </header>
  );
};

export default CompanyTopbar;
