import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../components/CompanySidebar';
import CompanyTopbar from '../components/CompanyTopbar';
import './PostJobSelection.css';

const PostJobSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="pjs-layout">
      <CompanySidebar />

      <div className="pjs-main">
        <CompanyTopbar activeTab="Jobs" />

        <div className="pjs-content-wrapper">
          <div className="pjs-header">
            <h1 className="pjs-title">Tạo tin tuyển dụng</h1>
            <a href="#" className="pjs-guide-link">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Hướng dẫn tạo tin
            </a>
          </div>

          <div className="pjs-cards-container">
            {/* Card 1: AI */}
            <div className="pjs-card pjs-card-ai">
              <div className="pjs-card-icon-box ai-bg">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M12 2L14.7 8.5L21.2 11.2L14.7 13.9L12 20.4L9.3 13.9L2.8 11.2L9.3 8.5L12 2Z"></path><path d="M19 15L20 17.5L22.5 18.5L20 19.5L19 22L18 19.5L15.5 18.5L18 17.5L19 15Z" opacity="0.5"></path></svg>
              </div>
              <div className="pjs-card-content">
                <div className="pjs-card-tag">BETA</div>
                <h3 className="pjs-card-name">Tạo nhanh với AI</h3>
                <p className="pjs-card-desc">Chỉ cần nhập mô tả ngắn gọn, AI của chúng tôi sẽ đề xuất tiêu đề, yêu cầu và kỹ năng phù hợp nhất.</p>
                <button className="pjs-btn pjs-btn-primary" onClick={() => navigate('/company/jobs/create-ai')}>
                  Bắt đầu với AI
                </button>
              </div>
            </div>

            {/* Card 2: JD */}
            <div className="pjs-card">
              <div className="pjs-card-icon-box jd-bg">
                <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <div className="pjs-card-content">
                <h3 className="pjs-card-name">Tạo bằng JD</h3>
                <p className="pjs-card-desc">Tải lên hoặc dán nội dung Job Description có sẵn, hệ thống sẽ tự động trích xuất thông tin cho bạn.</p>
                <button className="pjs-btn pjs-btn-secondary" onClick={() => navigate('/company/jobs/create-jd')}>
                  Tải lên JD
                </button>
              </div>
            </div>
          </div>

          <p className="pjs-manual-text">
            Bạn cũng có thể <Link to="/company/jobs/create">tạo tin thủ công</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostJobSelection;
