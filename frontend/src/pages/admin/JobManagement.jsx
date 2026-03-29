import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';

const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await adminApi.getJobs();
            if (res.data.status === 'success') {
                setJobs(res.data.data || []);
            }
            setLoading(false);
        } catch (err) {
            console.error('Fetch jobs error:', err);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (jobId, status) => {
        try {
            const res = await adminApi.updateJobStatus(jobId, status);
            if (res.data.status === 'success') {
                loadJobs();
            } else {
                alert(res.data.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            console.error('Update job status error:', err);
            alert('Đã có lỗi xảy ra!');
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (filter === 'all') return true;
        return job.status.toLowerCase() === filter;
    });

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return { bg: '#dcfce7', color: '#16a34a' };
            case 'pending': return { bg: '#fef3c7', color: '#d97706' };
            case 'rejected': return { bg: '#ffe4e6', color: '#e11d48' };
            case 'closed': return { bg: '#f1f5f9', color: '#64748b' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem', color: '#475569' }}>Đang tải danh sách việc làm...</div>;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý việc làm" />
                <main className="admin-body">
                    <div className="fade-in">
                        <div className="container">
                            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.8rem', color: '#1e293b' }}>
                                        Quản lý <span style={{ color: '#2563eb' }}>Việc làm</span>
                                    </h1>
                                    <p style={{ color: '#475569' }}>Kiểm duyệt và quản lý tất cả các tin tuyển dụng trên hệ thống.</p>
                                </div>
                                <div className="filter-tabs" style={{ display: 'flex', gap: '1rem', background: 'white', padding: '0.4rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    {['all', 'pending', 'open', 'rejected'].map(f => (
                                        <button 
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            style={{ 
                                                padding: '0.5rem 1.2rem', 
                                                borderRadius: '8px', 
                                                border: 'none',
                                                background: filter === f ? '#2563eb' : 'transparent',
                                                color: filter === f ? 'white' : '#475569',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                transition: 'all 0.2s',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ duyệt' : f === 'open' ? 'Hoạt động' : 'Đã từ chối'}
                                        </button>
                                    ))}
                                </div>
                            </header>

                            <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: '#f8fafc', color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Công việc & Công ty</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Loại hình</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Ngày đăng</th>
                                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Trạng thái</th>
                                            <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center', fontWeight: '700' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredJobs.map(job => {
                                            const statusStyle = getStatusStyle(job.status);
                                            return (
                                                <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{job.title}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '0.2rem', fontWeight: '600' }}>{job.company?.name || 'N/A Company'}</div>
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '500' }}>{job.jobType}</span>
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <div style={{ fontSize: '0.85rem', color: '#475569' }}>{new Date(job.postedAt).toLocaleDateString('vi-VN')}</div>
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <span style={{ 
                                                            padding: '0.3rem 0.8rem', 
                                                            borderRadius: '6px', 
                                                            fontSize: '0.75rem', 
                                                            fontWeight: '700',
                                                            background: statusStyle.bg,
                                                            color: statusStyle.color
                                                        }}>
                                                            {job.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                            {job.status.toLowerCase() === 'pending' && (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handleUpdateStatus(job.id, 'open')}
                                                                        className="btn" 
                                                                        style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid #bbf7d0' }}
                                                                    >
                                                                        Duyệt
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleUpdateStatus(job.id, 'rejected')}
                                                                        className="btn" 
                                                                        style={{ background: '#ffe4e6', color: '#e11d48', fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid #fecdd3' }}
                                                                    >
                                                                        Từ chối
                                                                    </button>
                                                                </>
                                                            )}
                                                            {job.status.toLowerCase() === 'open' && (
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(job.id, 'closed')}
                                                                    className="btn" 
                                                                    style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0' }}
                                                                >
                                                                    Đóng
                                                                </button>
                                                            )}
                                                            <button 
                                                                className="btn" 
                                                                style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid #dbeafe' }}
                                                                onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {filteredJobs.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
                                        Không tìm thấy công việc nào phù hợp với bộ lọc.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default JobManagement;
