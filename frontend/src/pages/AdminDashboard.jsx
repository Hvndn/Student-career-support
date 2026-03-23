import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';


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
        { label: 'Việc làm', value: stats.totalJobs || 0, color: 'var(--primary)', icon: '💼' },
        { label: 'Sinh viên', value: stats.totalStudents || 0, color: 'var(--secondary)', icon: '🎓' },
        { label: 'Doanh nghiệp', value: stats.totalCompanies || 0, color: 'var(--success)', icon: '🏢' },
        { label: 'Đơn ứng tuyển', value: stats.totalApplications || 0, color: '#f59e0b', icon: '📄' }
    ];



    return (
        <div className="container" style={{ marginTop: '3rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Quản trị <span className="gradient-text">Hệ thống</span></h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map((card, i) => (
                    <div key={i} className="card fade-in" style={{ 
                        textAlign: 'left', 
                        padding: '1.5rem 2rem', 
                        borderLeft: `4px solid ${card.color}`,
                        animationDelay: `${i * 0.1}s`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{card.label}</span>
                            <div style={{ fontSize: '1.5rem', opacity: 0.8 }}>{card.icon}</div>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', letterSpacing: '-0.02em' }}>{card.value}</h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.4rem' }}>↑ +12% so với tháng trước</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card glass">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Đơn tuyển gần đây</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Chưa có dữ liệu đơn tuyển mới.</p>
                    </div>
                </div>
                <div className="card glass">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Hành động nhanh</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <Link to="/admin/skills" className="btn glass" style={{ color: 'var(--primary)', justifyContent: 'flex-start' }}>⚙️ Quản lý Kỹ năng Hệ thống</Link>
                        <Link to="/admin/users" className="btn glass" style={{ color: 'var(--secondary)', justifyContent: 'flex-start' }}>👤 Quản lý Thành viên</Link>
                        <button className="btn glass" style={{ color: 'var(--success)', justifyContent: 'flex-start' }}>🏢 Phê duyệt Doanh nghiệp mới</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
