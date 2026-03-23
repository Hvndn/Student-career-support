import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyTopbar = ({ activeTab = 'Jobs' }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const companyName = user.fullName || 'Admin User';

  return (
    <header className="cd-topbar">
      <div className="cd-topbar-left">
        <span className={`cd-tab ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => navigate('/company/dashboard')}>Tổng quan</span>
        <span className={`cd-tab ${activeTab === 'Jobs' ? 'active' : ''}`} onClick={() => navigate('/company/jobs/post')}>Việc làm</span>
        <span className={`cd-tab ${activeTab === 'Talent Pool' ? 'active' : ''}`} onClick={() => navigate('/company/candidates/search')}>Nhóm ứng viên</span>
        <span className={`cd-tab ${activeTab === 'Reports' ? 'active' : ''}`}>Báo cáo</span>
      </div>
      <div className="cd-topbar-right">
        <div className="cd-search">
          <span>🔍</span>
          <input placeholder="Tìm kiếm nhanh..." />
        </div>
        <button className="cd-icon-btn">🔔</button>
        <button className="cd-icon-btn">💬</button>
        <div className="cd-user">
          <div className="cd-avatar">{companyName.charAt(0)}</div>
          <div>
            <p className="cd-uname">{companyName}</p>
            <p className="cd-urole">NEXUS AGENCY</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompanyTopbar;
