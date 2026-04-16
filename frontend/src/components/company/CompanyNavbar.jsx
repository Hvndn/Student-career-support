import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { companyApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/company/CompanyTopbar.css';

const CompanyTopbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawUser = localStorage.getItem('user');
  const user = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : {};
  
  const [companyData, setCompanyData] = useState({
    name: user?.fullName || 'Doanh nghiệp',
    email: user?.email || ''
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
    window.addEventListener('companyProfileUpdated', fetchCompanyProfile);
    return () => {
      window.removeEventListener('companyProfileUpdated', fetchCompanyProfile);
    };
  }, []);

  // Breadcrumb mapping
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: 'DAU Connect', to: '/company/dashboard' }];
    
    if (path.includes('/dashboard')) crumbs.push({ label: 'Tổng quan' });
    else if (path.includes('/management/candidates')) crumbs.push({ label: 'Quản lý ứng viên' });
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
          <button className="tb-action-btn" title="Thông báo">
            <span className="tb-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </span>
            <span className="tb-badge">2</span>
          </button>
        </div>

        <div className="divider"></div>
        
        <div className="cd-user-container">
          <div className="cd-user-profile">
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
            <span className="cd-dropdown-arrow">▼</span>
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
