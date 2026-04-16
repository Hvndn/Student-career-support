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
        
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        
        return () => clearInterval(timer);
    }, []);

    const chartData = data ? [
        { name: 'Hồ sơ ứng tuyển', value: data.totalCandidatesCount || 0, color: '#3b82f6' },
        { name: 'Phù hợp', value: data.suitableCount || 0, color: '#10b981' },
        { name: 'Phỏng vấn', value: data.interviewCount || 0, color: '#f59e0b' },
        { name: 'Từ chối', value: data.rejectedCount || 0, color: '#ef4444' },
    ] : [];

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
                    <div className="db-stats-row">
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
                                <h3>{data?.totalViews || 59}</h3>
                                <p>Tổng lượt xem</p>
                            </div>
                        </div>
                    </div>

                    <div className="db-main-grid">
                        {/* Area 1: Efficiency Chart */}
                        <div className="db-left-col">
                            <section className="db-widget efficiency-widget">
                                <div className="widget-header">
                                    <h4>Hiệu suất tuyển dụng</h4>
                                    <p className="widget-subtitle">Ứng viên & Trạng thái hồ sơ</p>
                                    <button className="btn-refresh" onClick={() => window.location.reload()}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                                        Làm mới
                                    </button>
                                </div>
                                <div className="widget-body">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                            <XAxis type="number" hide />
                                            <YAxis 
                                                type="category" 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                width={100}
                                                tick={{ fill: '#4b5563', fontSize: 13 }}
                                            />
                                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={25}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                                <LabelList dataKey="value" position="right" style={{ fontSize: 13, fontWeight: 700, fill: '#1f2937' }} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
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
                                    <Link to="/company/jobs/post" className="action-item">
                                        <div className="action-icon blue">＋</div>
                                        <div className="action-text">
                                            <p className="a-title">Đăng tin mới</p>
                                            <p className="a-desc">Tạo tin tuyển dụng</p>
                                        </div>
                                    </Link>
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
                                    <p className="empty-text">Chưa có ứng viên mới nào gần đây.</p>
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
