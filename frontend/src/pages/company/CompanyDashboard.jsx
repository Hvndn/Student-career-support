import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { companyApi } from '../../api';
import '../../assets/css/company/CompanyDashboard.css';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FiUsers, FiCalendar, FiBriefcase, FiPlusCircle } from 'react-icons/fi';

const CompanyDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(30);

    // [FE Logic] Lấy dữ liệu Dashboard từ Backend
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Gọi API getDashboard từ api.js
                // Tham số timeRange (1, 7, 30 ngày) được truyền vào để BE lọc dữ liệu xu hướng (trends)
                const response = await companyApi.getDashboard(timeRange);
                if (response.data.success || response.data.status === 'success') {
                    // Cập nhật state data với dữ liệu nhận được từ BE (CompanyDashboardResponse)
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [timeRange]); // Chạy lại mỗi khi người dùng thay đổi khoảng thời gian (Ngày/Tuần/Tháng)

    // Format trend data for display
    const trendData = data?.applicationTrends || [];

    if (loading) return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <div className="loading-container">
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        </div>
    );

    const companyName = data?.companyName || "Doanh nghiệp";

    return (
        <div className="cd-layout">
            <CompanySidebar active="dashboard" />
            <div className="cd-main">
                <CompanyNavbar activeTab="Tổng quan" />
                <div className="dashboard-v2">
                    {/* Welcome Header */}
                    <header className="db-welcome-header">
                        <h2>
                            Chào buổi chiều, <span className="company-highlight">{companyName}</span> 👋
                        </h2>
                        <p className="db-subtitle">Tổng quan tuyển dụng của bạn</p>
                    </header>

                    <div className="db-stats-row intro-y delay-1">
                        {/* Hiển thị số lượng tin tuyển dụng đang mở (activeJobsCount) */}
                        <div className="db-stat-card">
                            <div className="db-stat-icon-box blue">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <div className="db-stat-info">
                                <h3>{data?.activeJobsCount || 0}</h3>
                                <p>Tin tuyển dụng</p>
                            </div>
                        </div>
                        {/* Hiển thị tổng số ứng viên đã nộp đơn (totalCandidatesCount) */}
                        <div className="db-stat-card">
                            <div className="db-stat-icon-box orange">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <div className="db-stat-info">
                                <h3>{data?.totalCandidatesCount || 0}</h3>
                                <p>Ứng viên ứng tuyển</p>
                            </div>
                        </div>
                        {/* Hiển thị số lượng lịch phỏng vấn đã thiết lập (interviewCount) */}
                        <div className="db-stat-card">
                            <div className="db-stat-icon-box green">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div className="db-stat-info">
                                <h3>{data?.interviewCount || 0}</h3>
                                <p>Lịch hẹn phỏng vấn</p>
                            </div>
                        </div>
                        {/* Hiển thị tổng lượt xem tất cả tin tuyển dụng (totalViews) */}
                        <div className="db-stat-card">
                            <div className="db-stat-icon-box purple">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            </div>
                            <div className="db-stat-info">
                                <h3>{data?.totalViews || 0}</h3>
                                <p>Tổng lượt xem</p>
                            </div>
                        </div>
                    </div>

                    <div className="db-main-grid">
                        <div className="db-left-col">
                            {/* Trend Chart Area */}
                            <section className="db-widget trend-widget intro-y delay-2">
                                <div className="widget-header">
                                    <div className="header-left">
                                        <h4>Xu hướng tuyển dụng</h4>
                                        <p className="widget-subtitle">Số lượng hồ sơ ứng tuyển theo thời gian</p>
                                    </div>
                                    <div className="range-pill-selector">
                                        <button 
                                            className={timeRange === 1 ? 'active' : ''} 
                                            onClick={() => setTimeRange(1)}
                                        >Ngày</button>
                                        <button 
                                            className={timeRange === 7 ? 'active' : ''} 
                                            onClick={() => setTimeRange(7)}
                                        >Tuần</button>
                                        <button 
                                            className={timeRange === 30 ? 'active' : ''} 
                                            onClick={() => setTimeRange(30)}
                                        >Tháng</button>
                                    </div>
                                </div>
                                <div className="widget-body">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#A31D1D" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#A31D1D" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                                dy={10}
                                                tickFormatter={(val) => {
                                                    if (timeRange === 1) return val;
                                                    if (val && val.includes('-')) return val.split('-').slice(2).join('-');
                                                    return val;
                                                }}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                                tickCount={6}
                                                allowDecimals={false}
                                            />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '13px', padding: '10px 15px' }}
                                                labelStyle={{ color: '#1e293b', fontWeight: 700, marginBottom: '5px' }}
                                                itemStyle={{ color: '#A31D1D', fontWeight: 500 }}
                                                formatter={(value) => [value, 'Hồ sơ ứng tuyển']}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#A31D1D" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorCount)" 
                                                dot={{ r: 4, fill: '#fff', stroke: '#A31D1D', strokeWidth: 2 }}
                                                activeDot={{ r: 6, fill: '#A31D1D', stroke: '#fff', strokeWidth: 2 }}
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            {/* Job Post Status */}
                            <section className="db-widget intro-y delay-3">
                                <div className="widget-header">
                                    <h4>Trạng thái tin tuyển dụng</h4>
                                    <Link to="/company/management" className="view-all-link">Quản lý →</Link>
                                </div>
                                <div className="widget-body compact-table">
                                    <div className="db-job-status-grid">
                                        {data?.jobs?.slice(0, 4).map(job => (
                                            <div key={job.id} className="db-job-card">
                                                <div className="db-job-info">
                                                    <h5>{job.title}</h5>
                                                    <span>{job.applicantsCount || 0} hồ sơ</span>
                                                </div>
                                                <div className={`db-status-pill ${job.status}`}>
                                                    {job.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="db-right-col">
                            {/* Quick Actions */}
                            <section className="db-widget action-widget intro-y delay-2">
                                <div className="widget-header">
                                    <h4>Thao tác nhanh</h4>
                                </div>
                                <div className="widget-body">
                                    <div className="db-action-list">
                                        {/* Link đến trang Quản lý tin tuyển dụng (CompanyJobManagement.jsx) */}
                                        <Link to="/company/management" className="db-action-card">
                                            <div className="db-action-icon blue"><FiPlusCircle size={20} /></div>
                                            <div className="db-action-info">
                                                <h6>Đăng tin mới</h6>
                                                <p>Tạo bản tin tuyển dụng</p>
                                            </div>
                                        </Link>
                                        {/* Link đến trang Tìm kiếm ứng viên (CompanyCandidates.jsx) */}
                                        <Link to="/company/management/candidates" className="db-action-card">
                                            <div className="db-action-icon orange"><FiUsers size={20} /></div>
                                            <div className="db-action-info">
                                                <h6>Xem ứng viên</h6>
                                                <p>Quản lý hồ sơ ứng viên</p>
                                            </div>
                                        </Link>
                                        {/* Link đến trang Lịch hẹn phỏng vấn (CompanyBooking.jsx) */}
                                        <Link to="/company/booking" className="db-action-card">
                                            <div className="db-action-icon green"><FiCalendar size={20} /></div>
                                            <div className="db-action-info">
                                                <h6>Lịch hẹn</h6>
                                                <p>Đặt lịch phỏng vấn</p>
                                            </div>
                                        </Link>
                                        {/* Link đến trang Hồ sơ công ty (CompanyProfile.jsx) */}
                                        <Link to="/company/profile" className="db-action-card">
                                            <div className="db-action-icon purple"><FiBriefcase size={20} /></div>
                                            <div className="db-action-info">
                                                <h6>Hồ sơ công ty</h6>
                                                <p>Cập nhật thông tin</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            {/* Recent Candidates */}
                            <section className="db-widget recent-widget intro-y delay-3">
                                <div className="widget-header">
                                    <h4>Ứng viên mới hôm nay</h4>
                                    <Link to="/company/management/candidates" className="view-all-link">Tất cả →</Link>
                                </div>
                                <div className="widget-body">
                                    <div className="db-recent-candidates">
                                        {data?.recentCandidates?.length > 0 ? (
                                            data.recentCandidates.slice(0, 3).map(app => (
                                                <div key={app.id} className="db-candidate-item">
                                                    <div className="db-candidate-avatar">
                                                        {app.studentAvatar ? (
                                                            <img src={app.studentAvatar} alt={app.studentName} />
                                                        ) : (
                                                            app.studentName?.charAt(0) || 'U'
                                                        )}
                                                    </div>
                                                    <div className="db-candidate-info">
                                                        <h6>{app.studentName}</h6>
                                                        <p>{app.jobTitle}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-state">Chưa có ứng viên mới nào hôm nay.</div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
