import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../components/CompanySidebar';
import CompanyTopbar from '../components/CompanyTopbar';
import { companyApi } from '../api';
import './CompanyDashboard.css';

const MONTHS = ['T1', 'T2', 'T3', 'T4 (NAY)', 'T5', 'T6'];
const CHART_DATA = [38, 55, 70, 100, 72, 60]; // relative heights %

const MOCK_JOBS = [
  { id: 1, title: 'Senior UI/UX Designer', type: 'Toàn thời gian', location: 'Quận 1, HCM', applicants: 48, status: 'active' },
  { id: 2, title: 'Marketing Lead', type: 'Từ xa', location: 'Việt Nam', applicants: 124, status: 'active' },
  { id: 3, title: 'Frontend Developer (React)', type: 'Hợp đồng', location: 'Đà Nẵng', applicants: 12, status: 'expired' },
];

const MOCK_CANDIDATES = [
  { id: 1, name: 'Lê Minh...', role: 'UX Researcher...', avatar: 'L', color: '#f59e0b' },
  { id: 2, name: 'Trần Hoà...', role: 'Backend Dev...', avatar: 'T', color: '#3b82f6' },
  { id: 3, name: 'Nguyễn...', role: 'Digital Market...', avatar: 'N', color: '#10b981' },
];

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    companyApi.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => {});
  }, []);

  const companyName = user.fullName || 'Admin User';
  const firstWord = companyName.split(' ')[0];

  const statCards = [
    { icon: '💼', label: 'ACTIVE JOBS', value: stats?.activeJobsCount ?? 24, delta: '+12%', color: '#3b82f6' },
    { icon: '👥', label: 'TOTAL APPLICANTS', value: stats?.totalCandidatesCount ?? 1284, delta: '+8%', color: '#8b5cf6' },
    { icon: '📄', label: 'NEW RESUMES', value: stats?.pendingInterviewsCount ?? 92, delta: '+45', color: '#10b981' },
    { icon: '⭐', label: 'SHORTLISTED', value: 18, delta: 'Ổn định', color: '#ef4444', noBadge: true },
  ];

  return (
    <div className="cd-layout">
      <CompanySidebar />

      <div className="cd-main">
        <CompanyTopbar activeTab="Dashboard" />

        {/* Content */}
        <div className="cd-content">
          {/* Greeting */}
          <div className="cd-greeting-row">
            <div>
              <h1 className="cd-greeting-title">Chào buổi sáng.</h1>
              <p className="cd-greeting-sub">Dưới đây là tổng quan về hoạt động tuyển dụng của bạn hôm nay.</p>
            </div>
            <div className="cd-greeting-actions">
              <button className="cd-btn-outline">↑ Xuất báo cáo</button>
              <Link to="/company/jobs/post" className="cd-btn-primary">+ Tạo tin mới</Link>
            </div>
          </div>

          <div className="cd-body">
            {/* Left Column */}
            <div className="cd-col-main">
              {/* Stat Cards */}
              <div className="cd-stats-grid">
                {statCards.map((s, i) => (
                  <div key={i} className="cd-stat-card">
                    <div className="cd-stat-top">
                      <span className="cd-stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</span>
                      {!s.noBadge
                        ? <span className="cd-stat-delta green">{s.delta}</span>
                        : <span className="cd-stat-delta gray">{s.delta}</span>
                      }
                    </div>
                    <p className="cd-stat-val">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
                    <p className="cd-stat-label">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="cd-card">
                <div className="cd-card-head">
                  <div>
                    <h3>Xu hướng ứng tuyển</h3>
                    <p className="cd-card-sub">Thống kê hồ sơ trong 30 ngày qua</p>
                  </div>
                  <div className="cd-chart-tabs">
                    <button className="chart-tab active">Tháng</button>
                    <button className="chart-tab">Tuần</button>
                  </div>
                </div>
                <div className="cd-chart">
                  {CHART_DATA.map((val, i) => (
                    <div key={i} className="cd-bar-wrap">
                      <div
                        className={`cd-bar ${i === 3 ? 'cd-bar-highlight' : ''}`}
                        style={{ height: `${val}%` }}
                      />
                      <span className="cd-bar-label">{MONTHS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Jobs Table */}
              <div className="cd-card">
                <div className="cd-card-head">
                  <h3>Tin tuyển dụng đang chạy</h3>
                </div>
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>VỊ TRÍ</th>
                      <th>ỨNG VIÊN</th>
                      <th>TRẠNG THÁI</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_JOBS.map(job => (
                      <tr key={job.id}>
                        <td>
                          <p className="cd-job-title">{job.title}</p>
                          <p className="cd-job-meta">{job.type} • {job.location}</p>
                        </td>
                        <td className="cd-applicants">{job.applicants}</td>
                        <td>
                          {job.status === 'active'
                            ? <span className="cd-badge green">ĐANG TUYỂN</span>
                            : <span className="cd-badge gray">HẾT HẠN</span>
                          }
                        </td>
                        <td className="cd-actions">
                          <Link to={`/company/management/jobs/${job.id}/applicants`} className="cd-action-icon" title="Xem ứng viên">✏️</Link>
                          <button className="cd-action-icon danger" title="Xóa">🗑️</button>
                          {job.status === 'expired' && (
                            <button className="cd-action-icon" title="Gia hạn">🔄</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column */}
            <div className="cd-col-side">
              {/* New Candidates */}
              <div className="cd-card">
                <div className="cd-card-head">
                  <h3>Ứng viên mới</h3>
                  <Link to="/company/candidates/search" className="cd-viewall">XEM TẤT CẢ</Link>
                </div>
                {MOCK_CANDIDATES.map(c => (
                  <div key={c.id} className="cd-candidate-row">
                    <div className="cd-cand-avatar" style={{ background: c.color }}>{c.avatar}</div>
                    <div>
                      <p className="cd-cand-name">{c.name}</p>
                      <p className="cd-cand-role">{c.role}</p>
                    </div>
                    <button className="cd-cv-btn">XEM CV</button>
                  </div>
                ))}
              </div>

              {/* Recruitment Efficiency */}
              <div className="cd-card cd-metric-card">
                <h4>Chỉ số tuyển dụng hiệu quả</h4>
                <div className="cd-metric-body">
                  <div className="cd-metric-ring">
                    <svg viewBox="0 0 100 100" width="80" height="80">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="38"
                        fill="none" stroke="white" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 38 * 0.85} ${2 * Math.PI * 38 * 0.15}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="800">85%</text>
                    </svg>
                  </div>
                  <p>Tỷ lệ chuyển đổi ứng viên của bạn cao hơn 15% so với cùng kỳ tháng trước.</p>
                </div>
              </div>

              {/* Expert Support */}
              <div className="cd-card">
                <div className="cd-expert-icon">🤝</div>
                <h4>Hỗ trợ chuyên gia</h4>
                <p>Cần giúp tối ưu hóa tin tuyển dụng? Liên hệ với chuyên viên của chúng tôi.</p>
                <button className="cd-connect-btn">Kết nối ngay</button>
              </div>
            </div>
          </div>

          {/* Footer mini */}
          <footer className="cd-footer">
            <div className="cd-footer-grid">
              <div>
                <strong>Nexus Talent</strong>
                <p>Giải pháp nhân sự chuyên nghiệp cho doanh nghiệp hội hiện đại.</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                  <span className="cd-footer-icon">🌐</span>
                  <span className="cd-footer-icon">↗</span>
                </div>
              </div>
              <div>
                <h5>LIÊN KẾT</h5>
                <p><a href="#">Privacy Policy</a></p>
                <p><a href="#">Terms of Service</a></p>
              </div>
              <div>
                <h5>HỖ TRỢ</h5>
                <p><a href="#">Contact Us</a></p>
                <p><a href="#">About</a></p>
              </div>
              <div>
                <h5>BẢN TIN</h5>
                <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>Cập nhật tin tức thị trường</p>
                <div className="cd-newsletter">
                  <input placeholder="Email của bạn" />
                  <button>▶</button>
                </div>
              </div>
            </div>
            <p className="cd-footer-copy">© 2024 THE DIGITAL CURATOR. ALL RIGHTS RESERVED.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
