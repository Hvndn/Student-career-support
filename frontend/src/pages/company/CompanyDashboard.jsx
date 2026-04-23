import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { companyApi } from '../../api';
import '../../assets/css/company/CompanyDashboard.css';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

const CompanyDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7); // 1: Ngày, 7: Tuần, 30: Tháng
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchDashboardData(timeRange);
    }, [timeRange]);

    const fetchDashboardData = async (days) => {
        setLoading(true);
        try {
            const response = await companyApi.getDashboard(days);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const trendData = (data?.applicationTrends || []).map(item => {
        if (timeRange === 1) {
            return {
                date: item.date,
                count: item.count
            };
        }
        const d = new Date(item.date);
        return {
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            count: item.count
        };
    });

    if (loading) return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        </div>
    );

    const companyName = data?.companyName || 'Công ty';

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyNavbar />

                <div className="cd-content dau-style">
                    {/* Recruitment Hub Tag */}
                    <div className="db-tag-container">
                        <span className="db-tag">● RECRUITMENT HUB</span>
                    </div>

                    {/* Welcome Header */}
                    <header className="db-welcome-header">
                        <h2>
                            Chào buổi chiều, <span className="company-highlight">{companyName}</span> 👋
                        </h2>
                        <p className="db-subtitle">Tổng quan tuyển dụng của bạn</p>
                    </header>

                    {/* Top Stats Cards */}
                    <div className="db-stats-row intro-y delay-1">
                        <div className="stat-card">
                            <div className="stat-icon-box blue">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <div className="stat-info">
                                <h3>{data?.activeJobsCount || 0}</h3>
                                <p>Tin tuyển dụng</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-box orange">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <div className="stat-info">
                                <h3>{data?.totalCandidatesCount || 0}</h3>
                                <p>Ứng viên ứng tuyển</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-box green">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div className="stat-info">
                                <h3>{data?.interviewCount || 0}</h3>
                                <p>Lịch hẹn phỏng vấn</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-box purple">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            </div>
                            <div className="stat-info">
                                <h3>{data?.totalViews || 0}</h3>
                                <p>Tổng lượt xem</p>
                            </div>
                        </div>
                    </div>

                    <div className="db-main-grid">
                        <div className="db-left-col">
                            <section className="db-widget trend-widget">
                                <div className="widget-header">
                                    <div className="header-left">
                                        <h4>Xu hướng Ứng tuyển</h4>
                                        <p className="widget-subtitle">Số lượng hồ sơ theo thời gian</p>
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
                                    {trendData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={260}>
                                            <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                                                />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: '#f8fafc' }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                />
                                                <Bar 
                                                    dataKey="count" 
                                                    fill="#3b82f6" 
                                                    radius={[4, 4, 0, 0]} 
                                                    barSize={30}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="empty-trend">Chưa có đủ dữ liệu để vẽ biểu đồ.</div>
                                    )}
                                </div>
                            </section>

                            <section className="db-widget bottom-list">
                                <div className="widget-header">
                                    <h4>Trạng thái tin tuyển dụng</h4>
                                    <Link to="/company/management" className="link-view-all">Quản lý →</Link>
                                </div>
                                <div className="widget-body compact-table">
                                    {data?.jobs?.slice(0, 3).map((job) => (
                                        <div key={job.id} className="compact-job-row">
                                            <div className="job-icon-small">📁</div>
                                            <div className="job-desc">
                                                <p className="job-title">{job.title}</p>
                                                <p className="job-meta">Tất cả tin đã đăng</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Area 2: Side widgets */}
                        <div className="db-right-col">
                            <section className="db-widget actions-widget">
                                <div className="widget-header">
                                    <h4>Thao tác nhanh</h4>
                                    <p className="widget-subtitle">Truy cập nhanh các tính năng</p>
                                </div>
                                <div className="action-list">
                                    <Link to="/company/management/candidates" className="action-item">
                                        <div className="action-icon orange">👥</div>
                                        <div className="action-text">
                                            <p className="a-title">Xem ứng viên</p>
                                            <p className="a-desc">Quản lý hồ sơ ứng viên</p>
                                        </div>
                                    </Link>
                                    <Link to="#" className="action-item">
                                        <div className="action-icon green">📅</div>
                                        <div className="action-text">
                                            <p className="a-title">Lịch hẹn</p>
                                            <p className="a-desc">Đặt lịch phỏng vấn</p>
                                        </div>
                                    </Link>
                                    <Link to="/company/profile" className="action-item">
                                        <div className="action-icon purple">🏢</div>
                                        <div className="action-text">
                                            <p className="a-title">Hồ sơ công ty</p>
                                            <p className="a-desc">Cập nhật thông tin</p>
                                        </div>
                                    </Link>
                                </div>
                            </section>

                            <section className="db-widget recent-cand-widget">
                                <div className="widget-header">
                                    <h4>Ứng viên gần đây</h4>
                                    <Link to="/company/management/candidates" className="link-view-all">Tất cả →</Link>
                                </div>
                                <div className="widget-body">
                                    {data?.recentCandidates?.length > 0 ? (
                                        <div className="compact-list">
                                            {data.recentCandidates.map((cand) => (
                                                <div key={cand.id} className="compact-item">
                                                    <div className="item-avatar">
                                                        {cand.studentAvatar ? (
                                                            <img src={cand.studentAvatar} alt={cand.studentName} />
                                                        ) : (
                                                            <div className="avatar-placeholder">
                                                                {cand.studentName?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="item-info">
                                                        <p className="item-name">{cand.studentName}</p>
                                                        <p className="item-meta">Ứng tuyển: {cand.jobTitle}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="empty-text">Chưa có ứng viên mới nào hôm nay.</p>
                                    )}
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
