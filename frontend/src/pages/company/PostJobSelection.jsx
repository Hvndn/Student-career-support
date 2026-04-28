import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import '../../assets/css/company/PostJobSelection.css';

const PostJobSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="pjs-layout">
      <CompanySidebar />

      <div className="pjs-main">
        <CompanyNavbar activeTab="Jobs" />

        <div className="pjs-content-wrapper">
          <div className="pjs-header">
            <h1 className="pjs-title">Tạo tin tuyển dụng</h1>
            <a href="#" className="pjs-guide-link">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Hướng dẫn tạo tin
            </a>
          </div>

          <div className="pjs-cards-container">
            {/* Card Main: Manual Post */}
            <div className="pjs-card pjs-card-main">
              <div className="pjs-card-icon-box manual-bg">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>
              </div>
              <div className="pjs-card-content">
                <h3 className="pjs-card-name">Tạo tin tuyển dụng mới</h3>
                <p className="pjs-card-desc">Cung cấp đầy đủ thông tin chi tiết về công việc để thu hút các ứng viên tiềm năng nhất.</p>
                <button className="pjs-btn pjs-btn-primary" onClick={() => navigate('/company/jobs/create')}>
                  Bắt đầu tạo tin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobSelection;
