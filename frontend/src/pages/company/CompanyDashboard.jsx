import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';
import CompanyTopbar from '../../components/CompanyTopbar';
import { companyApi } from '../../api';
import '../../assets/css/CompanyDashboard.css';


const CompanyDashboard = () => {
  return (
    <div className="cd-layout">
      <CompanySidebar />
      <CompanyTopbar activeTab="Dashboard" />

      <div className="cd-main">
        <div className="cd-content new-dashboard-layout">
          
          {/* Top Banners */}
          <div className="db-banners-row">
            <div className="db-banner banner-left">
              <div className="banner-text">Ưu đãi</div>
              <h3>MỞ RỘNG<br/>TUYỂN DỤNG<br/>TIẾP SỨC ĐĂNG TIN</h3>
              <p>Nhận MIỄN PHÍ 20 Tin tiêu chuẩn</p>
            </div>
            <div className="db-banner banner-right">
              <div className="banner-logo">Curator Recruit</div>
              <h3>Chương trình Khách hàng thân thiết 2026</h3>
            </div>
          </div>

          <h2 className="db-greeting">Chào bạn! Hãy cùng khám phá thông tin tuyển dụng mới nhất tại đây nhé</h2>

          <div className="db-main-grid">
            
            {/* Left Column: Progress */}
            <div className="db-progress-section">
              <div className="db-progress-header">
                <h3>Còn 3 bước để nhận quà tặng</h3>
                <div className="db-progress-bar-container">
                  <span className="progress-text">Tiến trình hoàn thành của bạn</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{width: '50%'}}></div>
                  </div>
                  <span className="progress-percent">🎁 50%</span>
                </div>
              </div>
              
              <p className="db-progress-sub">Hoàn thiện hồ sơ ngay để nổi bật giữa hàng triệu nhà tuyển dụng!</p>
              
              <div className="db-steps-grid">
                
                <div className="db-step-card active">
                  <div className="step-icon">📄</div>
                  <div className="step-content">
                    <h4>Xác thực hồ sơ pháp lý</h4>
                    <p>80% ứng viên ưu tiên doanh nghiệp đã xác thực pháp lý</p>
                  </div>
                  <div className="step-count">0/1</div>
                </div>

                <div className="db-step-card">
                  <div className="step-icon">🏢</div>
                  <div className="step-content">
                    <h4>Thông tin cơ bản</h4>
                    <p>Hồ sơ đầy đủ giúp gia tăng độ tin cậy từ phía ứng viên</p>
                  </div>
                  <div className="step-count">2/5</div>
                </div>

                <div className="db-step-card">
                  <div className="step-icon">📢</div>
                  <div className="step-content">
                    <h4>Quảng bá thương hiệu</h4>
                    <p>Thương hiệu rõ ràng thu hút gấp 3 lần lượt ứng tuyển</p>
                  </div>
                  <div className="step-count">0/3</div>
                </div>

              </div>

              <div className="db-completed-steps">
                <span>Đã hoàn tất:</span>
                <span className="completed-badge">✓ Thông tin liên lạc</span>
                <span className="completed-badge">✓ Xác thực email</span>
              </div>
            </div>

            {/* Right Column: Quick Actions */}
            <div className="db-actions-section">
              <h3>Bắt đầu tuyển dụng</h3>
              
              <div className="db-action-card">
                <Link to="/company/jobs/post" className="db-btn-primary full-width">
                  <span className="btn-icon">✍️</span> Soạn tin tuyển dụng
                </Link>
                <p className="action-hint">Đăng tin tuyển dụng của bạn trên Curator Recruit để người tìm việc ứng tuyển.</p>
              </div>

              <div className="db-action-card">
                <Link to="/company/candidates/search" className="db-btn-secondary full-width">
                  <span className="btn-icon">🔍</span> Tìm ứng viên
                </Link>
                <p className="action-hint">Tìm ứng viên phù hợp với nhu cầu của bạn từ kho ứng viên đang tìm việc của hệ thống mà chưa cần đăng tin.</p>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
