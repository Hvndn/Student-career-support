import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';
import '../../assets/css/student/Dashboard.css';

const DonutChart = ({ value, total }) => {
  const radius = 70;
  const stroke = 25;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / Math.max(total, 1)) * circumference;

  return (
    <div className="dau-donut-wrapper">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#d1d5db"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="dau-donut-progress"
        />
      </svg>
      <div className="dau-donut-text">
        <span className="dau-donut-number">{value}</span>
        <span className="dau-donut-label">Đã gửi</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, recRes] = await Promise.all([
          studentApi.getProfile(),
          studentApi.getRecommendations()
        ]);
        setProfile(profileRes.data.data);
        setRecommendations(recRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="dau-loading">Đang tải...</div>;

  const displayName = profile?.fullName || 'Sinh viên';

  return (
    <div className="dau-dashboard-wrapper">
        <div className="dau-dashboard-body">
          {/* Greeting & Refresh */}
          <div className="dau-welcome-row">
            <div className="dau-welcome-text">
              <div className="dau-tag">STUDENT DASHBOARD</div>
              <h1>Chào buổi sáng, <span className="dau-highlight">{displayName}</span> 🚀</h1>
              <p>Hôm nay có <span className="dau-count">{recommendations.length} việc làm</span> và <span className="dau-count">3 doanh nghiệp</span> đang chờ bạn</p>
            </div>
            <button className="dau-refresh-btn" onClick={() => window.location.reload()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              Làm mới
            </button>
          </div>

          {/* Stats Row */}
          <div className="dau-stats-grid">
            <div className="dau-stat-card">
              <div className="dau-stat-icon dau-icon-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <div className="dau-stat-info">
                <h3>{recommendations.length}</h3>
                <p>Việc làm mới</p>
              </div>
            </div>
            <div className="dau-stat-card">
              <div className="dau-stat-icon dau-icon-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg>
              </div>
              <div className="dau-stat-info">
                <h3>3</h3>
                <p>Doanh nghiệp</p>
              </div>
            </div>
            <div className="dau-stat-card">
              <div className="dau-stat-icon dau-icon-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              </div>
              <div className="dau-stat-info">
                <h3>1</h3>
                <p>Thử thách dự án</p>
              </div>
            </div>
            <div className="dau-stat-card">
              <div className="dau-stat-icon dau-icon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="dau-stat-info">
                <h3>2</h3>
                <p>Trò chuyện</p>
              </div>
            </div>
          </div>

          <div className="dau-main-grid">
            {/* Application Status Column */}
            <div className="dau-grid-col-2">
              <div className="dau-white-card">
                <div className="dau-card-header">
                   <h4>Trạng thái ứng tuyển</h4>
                   <p>Phân bổ hồ sơ đã gửi</p>
                </div>
                <div className="dau-donut-container">
                  <DonutChart value={0} total={10} />
                  <p className="dau-empty-text">Chưa có dữ liệu ứng tuyển</p>
                </div>
              </div>
            </div>

            {/* Profile Completion Column */}
            <div className="dau-grid-col-2">
              <div className="dau-white-card">
                <div className="dau-card-header-between">
                   <div className="dau-header-left">
                     <h4>Hoàn thiện hồ sơ</h4>
                     <p>Hồ sơ đầy đủ giúp tăng cơ hội được tuyển</p>
                   </div>
                   <span className="dau-percentage">100%</span>
                </div>
                
                <div className="dau-progress-lane">
                  <div className="dau-progress-bar" style={{width: '100%'}}></div>
                </div>

                <ul className="dau-checklist">
                  <li className="dau-checked">
                    <span className="dau-check-icon">✓</span> Ảnh đại diện
                  </li>
                  <li className="dau-checked">
                    <span className="dau-check-icon">✓</span> Giới thiệu bản thân
                  </li>
                  <li className="dau-checked">
                    <span className="dau-check-icon">✓</span> Số điện thoại
                  </li>
                  <li className="dau-checked">
                    <span className="dau-check-icon">✓</span> Video giới thiệu
                  </li>
                  <li className="dau-checked">
                    <span className="dau-check-icon">✓</span> CV đã tạo
                  </li>
                </ul>
              </div>
            </div>

            {/* Features Row */}
            <div className="dau-grid-col-1">
              <div className="dau-features-side">
                <p className="dau-side-label">Các tính năng dành cho bạn</p>
                <Link to="/jobs" className="dau-feature-box">
                  <div className="dau-f-icon-box blue"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                  <div className="dau-f-text">
                    <h5>Tìm việc làm</h5>
                    <p>Khám phá cơ hội mới</p>
                  </div>
                </Link>
                <Link to="/student/cv-template" className="dau-feature-box">
                  <div className="dau-f-icon-box red"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg></div>
                  <div className="dau-f-text">
                    <h5>CV của tôi</h5>
                    <p>Tạo & quản lý CV</p>
                  </div>
                </Link>
                <Link to="/student/profile" className="dau-feature-box">
                  <div className="dau-f-icon-box green"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
                  <div className="dau-f-text">
                    <h5>Hồ sơ cá nhân</h5>
                    <p>Cập nhật thông tin</p>
                  </div>
                </Link>
                <Link to="/companies" className="dau-feature-box">
                  <div className="dau-f-icon-box purple"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg></div>
                  <div className="dau-f-text">
                    <h5>Doanh nghiệp</h5>
                    <p>Xem danh sách DN</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Jobs List Row */}
            <div className="dau-grid-col-3">
              <div className="dau-white-card dau-jobs-list-card">
                 <div className="dau-card-header">
                    <h4>Cơ hội vừa được đăng</h4>
                    <p>Cập nhật những việc làm mới nhất</p>
                 </div>
                 <div className="dau-job-items">
                   {recommendations.slice(0, 5).map((job, idx) => (
                      <div key={idx} className="dau-job-row">
                        <div className="dau-job-left">
                          <div className="dau-company-logo">
                            <img src={job.companyLogo || "https://ui-avatars.com/api/?name=" + job.companyName} alt="Logo" />
                          </div>
                          <div className="dau-job-main">
                            <h6>{job.title}</h6>
                            <p>{job.companyName} • {idx + 2} ngày trước</p>
                          </div>
                        </div>
                        <div className="dau-job-salary">
                          {job.minSalary ? `${job.minSalary / 1000000} - ${job.maxSalary / 1000000} triệu` : 'Thỏa thuận'}
                        </div>
                      </div>
                   ))}
                 </div>
              </div>
            </div>

            {/* My Applications Row */}
            <div className="dau-grid-col-4">
              <div className="dau-white-card">
                 <div className="dau-card-header-between">
                    <div className="dau-header-left">
                       <h4><span className="dau-icon-inline red">✓</span> Đơn ứng tuyển của tôi</h4>
                       <p>Theo dõi trạng thái hồ sơ</p>
                    </div>
                    <Link to="/student/applications" className="dau-link-all">Xem tất cả &rsaquo;</Link>
                 </div>
                 <div className="dau-empty-apps">
                    <div className="dau-empty-icon">📄</div>
                    <p>Bạn chưa ứng tuyển công việc nào</p>
                    <p className="dau-sub">Hãy khám phá các cơ hội làm mới! 🎯</p>
                    <Link to="/jobs" className="dau-action-btn-red">Tìm việc ngay</Link>
                 </div>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
};

export default Dashboard;
