import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyApi } from '../api';

const CompanyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        companyApi.getDashboard()
            .then(res => {
                setStats(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải dashboard...</div>;
    
    // Check if stats grew or if there was an error
    if (!stats) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
                <h2 style={{ color: 'var(--danger)' }}>Không thể tải dữ liệu Thống kê</h2>
                <p style={{ color: 'var(--text-muted)' }}>Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.</p>
                <div style={{ marginTop: '2rem' }}>
                    <Link to="/login" className="btn btn-primary">Đến trang Đăng nhập</Link>
                    <button onClick={() => window.location.reload()} className="btn glass" style={{ marginLeft: '1rem' }}>Thử lại</button>
                </div>
            </div>
        );
    }

    const statCards = [
        { label: 'Tin tuyển dụng', value: stats.activeJobsCount, color: 'var(--primary)' },
        { label: 'Tổng ứng viên', value: stats.totalCandidatesCount, color: 'var(--secondary)' },
        { label: 'Phỏng vấn sắp tới', value: stats.pendingInterviewsCount, color: 'var(--success)' },
        { label: 'Lượt xem hồ sơ', value: stats.profileViewsCount, color: '#f59e0b' }
    ];

    return (
        <div className="fade-in" style={{ padding: '3rem 2rem 6rem' }}>
            <div className="container">
                <header style={{ marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>
                        Chào mừng trở lại, <span className="gradient-text">{stats.fullName}</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Quản lý hoạt động tuyển dụng của doanh nghiệp bạn.</p>
                </header>
                
                {/* Thống kê nhanh */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    {statCards.map((card, i) => (
                        <div key={i} className="card fade-in" style={{ 
                            textAlign: 'left', 
                            padding: '1.5rem 2rem',
                            borderTop: `4px solid ${card.color}`,
                            animationDelay: `${i * 0.1}s`,
                            background: 'rgba(100, 100, 100, 0.6)'
                        }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'black', marginBottom: '0.5rem' }}>{card.value}</h2>
                            <p style={{ color: 'rgba(0,0,0,0.7)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{card.label}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
                    {/* Danh sách tin đăng */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Tin tuyển dụng <span className="gradient-text">Hiện tại</span></h3>
                            <Link to="/company/jobs/post" className="btn btn-primary">+ Đăng tin mới</Link>
                        </div>
                        <div className="card glass" style={{ padding: '0.5rem' }}>
                            {stats.jobs.map(job => (
                                <div key={job.id} className="fade-in" style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    padding: '1.5rem 2rem', 
                                    borderBottom: '1px solid rgba(255,255,255,0.05)' 
                                }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', fontWeight: '600' }}>{job.title}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--success)' }}>{job.salary}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Link to={`/company/management/jobs/${job.id}/applicants`} className="btn glass" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>Ứng viên</Link>
                                        <button className="btn glass" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>Sửa</button>
                                    </div>
                                </div>
                            ))}
                            {stats.jobs.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Bạn chưa có tin tuyển dụng nào.</div>
                            )}
                        </div>
                    </section>

                    {/* Ứng viên gần đây */}
                    <aside>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700' }}>Ứng viên <span className="gradient-text">Mới nhất</span></h3>
                        <div className="card glass" style={{ padding: '1.5rem' }}>
                            {stats.recentCandidates.map(can => (
                                <div key={can.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                                    <p style={{ fontWeight: '700', fontSize: '1.05rem' }}>{can.studentName}</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)', margin: '0.4rem 0', fontWeight: '500' }}>{can.jobTitle}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span>🕒</span> {can.appliedDate}
                                    </p>
                                </div>
                            ))}
                            <Link to="#" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--primary)', fontWeight: '600' }}>Xem tất cả hồ sơ →</Link>
                            {stats.recentCandidates.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Chưa có ứng viên nào.</div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};


export default CompanyDashboard;
