import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';
import CompanyTopbar from '../../components/CompanyTopbar';
import { companyApi } from '../../api';
import '../../assets/css/CompanyDashboard.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList 
} from 'recharts';

const CompanyDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await companyApi.getDashboard();
                if (res.data.status === 'success') {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
        
        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        
        return () => clearInterval(timer);
    }, []);

    // Format current date: DD/MM/YYYY
    const formattedDate = currentTime.toLocaleDateString('vi-VN');
    
    // Define chart data based on real API data
    const chartData = data ? [
        { name: 'Hồ sơ ứng tuyển', value: data.totalCandidatesCount || 0, color: '#bfdbfe' },
        { name: 'Chưa xem', value: data.pendingCount || 0, color: '#bfdbfe' },
        { name: 'Chờ đánh giá', value: data.reviewCount || 0, color: '#bfdbfe' },
        { name: 'Phù hợp', value: data.suitableCount || 0, color: '#bfdbfe' },
        { name: 'Phỏng vấn', value: data.interviewCount || 0, color: '#bfdbfe' },
        { name: 'Đã tuyển', value: data.acceptedCount || 0, color: '#3b82f6' },
    ] : [];

    if (loading) return (
// ... (rest of loading remains)
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang chuẩn bị dữ liệu phân tích...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyTopbar activeTab="Dashboard" />

                <div className="cd-content dashboard-v2">
                    {/* Welcome Header */}
                    <header className="db-welcome-header">
                        <h2>
                            Chào {data?.companyName || 'Công ty'}, 
                            bạn có <span className="highlight">{data?.newCandidatesTodayCount || 0}</span> hồ sơ mới hôm nay!
                        </h2>
                    </header>

                    <div className="db-grid-v2">
                        {/* Main Stream */}
                        <div className="db-main-stream">
                            
                            {/* AI Recommendations Section */}
                            <section className="db-section ai-recommendations glass">
                                <div className="section-header">
                                    <h3><span className="icon">⚡</span> Đề xuất tối ưu bởi AI</h3>
                                    <p className="subtitle">Hệ thống tự động phân tích hiệu quả và đề xuất hành động tối ưu bằng AI</p>
                                </div>

                                <div className="job-stats-list">
                                    {data?.jobs?.slice(0, 2).map((job, index) => (
                                        <div key={job.id} className="job-stat-card">
                                            <div className="job-info-basic">
                                                <span className="job-id">ID{job.id} • {new Date(job.postedAt).toLocaleDateString('vi-VN')} - {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                                                <h4>{job.title}</h4>
                                            </div>
                                            
                                            <div className="job-metrics">
                                                <div className="metric">
                                                    <span className="metric-label">Ứng viên</span>
                                                    <div className="metric-value">
                                                        <Link to={`/company/jobs/${job.id}/applicants`} className="main-val">{job.applicantsCount} CV</Link>
                                                        <span className="sub-val">({job.applicantsTodayCount || 0} mới)</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="metric">
                                                    <span className="metric-label">Hiệu suất phản hồi</span>
                                                    <div className="metric-value">
                                                        <span className="main-val">80% (trong 24h)</span>
                                                        <span className={`status-pill ${index === 0 ? 'good' : 'excellent'}`}>
                                                            {index === 0 ? '●●● Tốt' : '●●●● Xuất sắc'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="job-card-actions">
                                                <button className="btn-respond">Phản hồi</button>
                                                <span className="action-hint">Còn {job.pendingApplicantsCount || 0} hồ sơ đang chờ</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!data?.jobs || data.jobs.length === 0) && (
                                        <div className="no-jobs-placeholder">
                                            <p>Bạn chưa có tin đăng nào đang hoạt động. Hãy đăng tin ngay để nhận đề xuất từ AI!</p>
                                            <Link to="/company/jobs/post" className="btn-create-small">Tạo tin ngay</Link>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Chart Section */}
                            <section className="db-section recruitment-efficiency glass">
                                <div className="section-header">
                                    <div className="title-group">
                                        <h3><span className="icon">📊</span> Hiệu quả tuyển dụng</h3>
                                        <p className="subtitle">Thống kê hồ sơ theo các trạng thái khác nhau</p>
                                    </div>
                                    <span className="last-updated">Cập nhật lúc {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                                domain={[0, 50]}
                                                ticks={[0, 10, 20, 30, 40, 50]}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={65}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                                <LabelList dataKey="value" position="top" offset={10} style={{ fill: '#64748b', fontSize: 14, fontWeight: 'bold' }} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="chart-footer">
                                        <p>Thời gian: 01/{currentTime.getMonth() + 1}/{currentTime.getFullYear()} - {formattedDate}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Column */}
                        <aside className="db-sidebar-column">
                            <div className="sidebar-card service-status glass">
                                <h4>Dịch vụ đang có</h4>
                                <ul className="service-list">
                                    <li className="service-item">
                                        <div className="s-count">125x</div>
                                        <div className="s-info">
                                            <p className="s-name">Điểm dịch vụ 🔒</p>
                                            <p className="s-expiry">Hạn sử dụng: 26/04/2026</p>
                                        </div>
                                    </li>
                                    <li className="service-item">
                                        <div className="s-count">2x</div>
                                        <div className="s-info">
                                            <p className="s-name">Tin cơ bản</p>
                                            <p className="s-expiry">Hạn sử dụng: 26/04/2026</p>
                                        </div>
                                    </li>
                                    <li className="service-item">
                                        <div className="s-count">2x</div>
                                        <div className="s-info">
                                            <p className="s-name">Trang chủ tuyển gấp</p>
                                            <p className="s-expiry">Hạn sử dụng: 26/04/2026</p>
                                        </div>
                                    </li>
                                    <li className="service-item">
                                        <div className="s-count">2x</div>
                                        <div className="s-info">
                                            <p className="s-name">Ưu tiên trang ngành</p>
                                            <p className="s-expiry">Hạn sử dụng: 26/04/2026</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="sidebar-card new-features glass">
                                <h4>Tính năng mới</h4>
                                <div className="feature-item">
                                    <h5>Tự động đánh giá ứng viên phù hợp</h5>
                                    <p>3 ngày trước</p>
                                </div>
                                <div className="feature-item">
                                    <h5>Báo cáo phân tích thị trường lương</h5>
                                    <p>1 tuần trước</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
