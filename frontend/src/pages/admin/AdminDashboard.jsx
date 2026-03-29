import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';


const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getStats()
            .then(res => {
                setStats(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải dữ liệu hệ thống...</div>;
    if (!stats) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Không thể tải dữ liệu. Vui lòng kiểm tra lại Backend.</div>;

    const statCards = [
        { label: 'Việc làm', value: stats.totalJobs || 0, color: '#2563eb', icon: '💼' },
        { label: 'Sinh viên', value: stats.totalStudents || 0, color: '#7c3aed', icon: '🎓' },
        { label: 'Doanh nghiệp', value: stats.totalCompanies || 0, color: '#10b981', icon: '🏢' },
        { label: 'Đơn ứng tuyển', value: stats.totalApplications || 0, color: '#f59e0b', icon: '📄' }
    ];



    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Tổng quan hệ thống" />
                <main className="admin-body">
                    <h1 style={{ marginBottom: '2rem', color: '#1e293b' }}>Quản trị <span style={{ color: '#2563eb' }}>Hệ thống</span></h1>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {statCards.map((card, i) => (
                            <div key={i} className="card fade-in" style={{ 
                                textAlign: 'left', 
                                padding: '1.5rem 2rem', 
                                borderLeft: `4px solid ${card.color}`,
                                background: 'white',
                                borderTop: '1px solid #e2e8f0',
                                borderRight: '1px solid #e2e8f0',
                                borderBottom: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                animationDelay: `${i * 0.1}s`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ color: '#475569', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{card.label}</span>
                                    <div style={{ fontSize: '1.5rem', opacity: 0.9 }}>{card.icon}</div>
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>{card.value}</h2>
                                <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.4rem', fontWeight: '600' }}>↑ +12% so với tháng trước</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="card" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Tin tuyển dụng mới</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {stats.recentJobs?.length > 0 ? (
                                    stats.recentJobs.slice(0, 5).map(job => (
                                        <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#0f172a' }}>{job.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '500', marginTop: '0.2rem' }}>{job.companyName}</div>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '700' }}>
                                                {new Date(job.postedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#475569', textAlign: 'center', padding: '2rem', fontWeight: '500' }}>Chưa có tin tuyển dụng mới.</p>
                                )}
                            </div>
                            <Link to="/admin/jobs" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#2563eb', fontWeight: '700' }}>Xem tất cả việc làm →</Link>
                        </div>
                        <div className="card" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Hành động nhanh</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <Link to="/admin/jobs" className="btn" style={{ background: '#eff6ff', color: '#2563eb', justifyContent: 'flex-start', border: '1px solid #dbeafe' }}>💼 Phê duyệt Tin tuyển dụng</Link>
                                <Link to="/admin/companies/pending" className="btn" style={{ background: '#f0fdf4', color: '#16a34a', justifyContent: 'flex-start', border: '1px solid #dcfce7' }}>🏢 Phê duyệt Doanh nghiệp mới</Link>
                                <Link to="/admin/skills" className="btn" style={{ background: '#f8fafc', color: '#475569', justifyContent: 'flex-start', border: '1px solid #e2e8f0', fontWeight: '600' }}>⚙️ Quản lý Kỹ năng Hệ thống</Link>
                                <Link to="/admin/users" className="btn" style={{ background: '#fff1f2', color: '#be123c', justifyContent: 'flex-start', border: '1px solid #ffe4e6', fontWeight: '600' }}>👤 Quản lý Thành viên</Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
