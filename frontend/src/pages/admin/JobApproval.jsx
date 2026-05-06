import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminDashboard.css';
import '../../assets/css/admin/AdminManagement.css';
import toast from 'react-hot-toast';

const JobApproval = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.paddingTop = '0';
        fetchJobs();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getJobs();
            // Lấy danh sách từ data.data của response
            setJobs(res.data.data || []);
        } catch (err) {
            console.error('Lấy danh sách tin tuyển dụng thất bại:', err);
            toast.error('Không thể tải danh sách tin tuyển dụng');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await adminApi.updateJobStatus(id, status);
            toast.success(`Đã ${status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} tin tuyển dụng!`);
            setIsModalOpen(false);
            fetchJobs();
        } catch (err) {
            toast.error('Cập nhật trạng thái thất bại. Vui lòng thử lại!');
        }
    };

    const handleViewDetail = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải dữ liệu...</div>;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý việc làm" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <h2 className="management-title">Danh sách việc làm hệ thống</h2>
                    </div>

                    {/* TOP CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', borderLeft: '6px solid #0d5cda' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#e0ebff', color: '#0d5cda', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><circle cx="12" cy="16" r="2"></circle></svg>
                                </div>
                                <span style={{ color: '#0d5cda', background: '#e0ebff', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Đang chờ</span>
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>Tổng tin chờ duyệt</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{jobs.filter(j => j.status === 'PENDING').length}</div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', borderLeft: '6px solid #10b981' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#d1fae5', color: '#10b981', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <span style={{ color: '#059669', background: '#d1fae5', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phê duyệt</span>
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>Tin đã phê duyệt</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{jobs.filter(j => j.status === 'APPROVED').length}</div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.8rem', border: '1px solid #eef0f4', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', borderLeft: '6px solid #dc2626' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#fee2e2', color: '#dc2626', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                                </div>
                                <span style={{ color: '#dc2626', background: '#fee2e2', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Từ chối</span>
                            </div>
                            <div style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.3rem' }}>Tin bị từ chối</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{jobs.filter(j => j.status === 'REJECTED').length}</div>
                        </div>
                    </div>

                    {/* MAIN TABLE CONTAINER */}
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eef0f4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '0.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: 0 }}>Danh sách tin tuyển dụng</h3>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '1.2rem 2rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Tên công việc</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Công ty</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Ngày đăng</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Mức lương</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #eef0f4' }}>Trạng thái</th>
                                        <th style={{ padding: '1.2rem 2rem', fontWeight: 600, borderBottom: '1px solid #eef0f4', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.length > 0 ? jobs.map((job) => (
                                        <tr key={job.id} style={{ borderBottom: '1px solid #eef0f4', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '1.5rem 2rem' }}>
                                                <div style={{ fontWeight: 700, color: '#111827', fontSize: '1rem', marginBottom: '0.2rem' }}>{job.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Mã số: #{job.id}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <div style={{ width: '32px', height: '32px', background: '#eef2ff', borderRadius: '6px', color: '#0d5cda', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {job.companyName?.charAt(0)}
                                                    </div>
                                                    <div style={{ color: '#374151', fontSize: '0.95rem', fontWeight: 500 }}>{job.companyName}</div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                                                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                            </td>
                                            <td style={{ padding: '1.5rem 1.5rem', color: '#374151', fontSize: '0.9rem', fontWeight: 600 }}>
                                                {job.minSalary?.toLocaleString()} - {job.maxSalary?.toLocaleString()} VNĐ
                                            </td>
                                            <td style={{ padding: '1.5rem 1.5rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 1.2rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    background: job.status === 'PENDING' ? '#ffedd5' : job.status === 'APPROVED' ? '#d1fae5' : '#fee2e2',
                                                    color: job.status === 'PENDING' ? '#d97706' : job.status === 'APPROVED' ? '#059669' : '#dc2626',
                                                }}>
                                                    ● {job.status === 'PENDING' ? 'Chờ duyệt' : job.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem 2rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                                                    <button 
                                                        onClick={() => handleViewDetail(job)}
                                                        title="Xem nhanh"
                                                        style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                    </button>
                                                    {job.status === 'PENDING' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(job.id, 'APPROVED')}
                                                                title="Phê duyệt"
                                                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d1fae5', color: '#10b981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(job.id, 'REJECTED')}
                                                                title="Từ chối"
                                                                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                                Không có dữ liệu tin tuyển dụng
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* BOTTOM INFO BANNER */}
                    <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '2rem', border: '1px solid #e0ebff' }}>
                        <div style={{ color: '#0d5cda', marginTop: '0.2rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.58 2 4 5.58 4 10c0 2.9 1.54 5.43 3.9 6.84V19c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2.16c2.36-1.41 3.9-3.94 3.9-6.84 0-4.42-3.58-8-8-8zm-1 19c0 .55.45 1 1 1h.5a1.5 1.5 0 0 1-1.5-1v-1h2v1A1.5 1.5 0 0 1 11 21zm4.5-4h-7v-1h7v1zm-.72-2.31l-.28.16v1.15h-5v-1.15l-.28-.16a6.002 6.002 0 0 1-3.22-5.32c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.21-1.2 4.19-3.22 5.32z" /></svg>
                        </div>
                        <div>
                            <h4 style={{ color: '#1e3a8a', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Mẹo kiểm duyệt nhanh</h4>
                            <p style={{ color: '#3b82f6', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
                                Đảm bảo thông tin mức lương và mô tả công việc không vi phạm chính sách của hệ thống trước khi phê duyệt.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {isModalOpen && selectedJob && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="premium-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', borderRadius: '24px', textAlign: 'left' }}>
                        <div className="modal-header" style={{ padding: '2rem 2.5rem', background: 'linear-gradient(to right, #f8fafc, #ffffff)', borderBottom: '1px solid #f1f5f9', position: 'relative', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                                <div style={{ background: '#0652dd', color: '#fff', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(6, 82, 221, 0.2)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>work</span>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', textAlign: 'left' }}>Chi tiết tin đăng tuyển</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', textAlign: 'left' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Mã số: #{selectedJob.id}</span>
                                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                                        <span style={{ fontSize: '0.85rem', color: '#0652dd', fontWeight: 700 }}>{selectedJob.industry || 'Lĩnh vực khác'}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)} style={{ 
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: '#f1f5f9', 
                                width: '36px', 
                                height: '36px',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#64748b',
                                transition: 'all 0.2s'
                            }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="modal-body" style={{ padding: '2.5rem', maxHeight: '75vh', textAlign: 'left' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem', textAlign: 'left' }}>
                                {/* Left Column: Info Card */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
                                    <section style={{ textAlign: 'left' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', textAlign: 'left' }}>Thông tin cơ bản</h4>
                                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', textAlign: 'left' }}>{selectedJob.title}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'left' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>business</span>
                                                    {selectedJob.companyName || 'Doanh nghiệp'}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                                                <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', textAlign: 'left' }}>
                                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px', textAlign: 'left' }}>MỨC LƯƠNG</div>
                                                    <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.95rem', textAlign: 'left' }}>
                                                        {selectedJob.minSalary && selectedJob.maxSalary ? 
                                                            `${(selectedJob.minSalary/1000000).toFixed(1)}M - ${(selectedJob.maxSalary/1000000).toFixed(1)}M` : 
                                                            'Thỏa thuận'}
                                                    </div>
                                                </div>
                                                <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', textAlign: 'left' }}>
                                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px', textAlign: 'left' }}>HÌNH THỨC</div>
                                                    <div style={{ color: '#0652dd', fontWeight: 800, fontSize: '0.95rem', textTransform: 'capitalize', textAlign: 'left' }}>
                                                        {selectedJob.jobType || 'Full-time'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left' }}>
                                                <div style={{ background: '#e0f2fe', color: '#0ea5e9', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span>
                                                </div>
                                                {selectedJob.location || 'Đà Nẵng (Toàn quốc)'}
                                            </div>
                                        </div>
                                    </section>

                                    {selectedJob.requirements && (
                                        <section style={{ textAlign: 'left' }}>
                                            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', textAlign: 'left' }}>Yêu cầu ứng viên</h4>
                                            <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line', textAlign: 'justify' }}>
                                                {selectedJob.requirements}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Right Column: Description & Benefits */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <section>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', textAlign: 'left' }}>Mô tả công việc</h4>
                                        <div style={{ 
                                            background: '#fff', 
                                            padding: '1.5rem', 
                                            borderRadius: '20px', 
                                            fontSize: '0.95rem', 
                                            lineHeight: 1.7, 
                                            color: '#334155',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                                            whiteSpace: 'pre-line',
                                            textAlign: 'justify'
                                        }}>
                                            {selectedJob.description || 'Chưa có mô tả chi tiết cho công việc này.'}
                                        </div>
                                    </section>

                                    {selectedJob.benefits && (
                                        <section>
                                            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', textAlign: 'left' }}>Quyền lợi & Phúc lợi</h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start' }}>
                                                {selectedJob.benefits.split('\n').map((benefit, i) => (
                                                    benefit.trim() && (
                                                        <span key={i} style={{ background: '#f0fdf4', color: '#166534', padding: '6px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #dcfce7' }}>
                                                            ✓ {benefit.trim()}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ borderRadius: '12px', padding: '12px 24px' }}>Để sau</button>
                            
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {selectedJob.status === 'PENDING' && (
                                    <>
                                        <button 
                                            className="btn-danger" 
                                            onClick={() => handleUpdateStatus(selectedJob.id, 'REJECTED')}
                                            style={{ borderRadius: '12px', padding: '12px 24px', background: '#fff', border: '1px solid #fee2e2', color: '#dc2626' }}
                                        >
                                            Từ chối tin
                                        </button>
                                        <button 
                                            className="btn-primary" 
                                            onClick={() => handleUpdateStatus(selectedJob.id, 'APPROVED')}
                                            style={{ borderRadius: '12px', padding: '12px 30px', background: '#0652dd', boxShadow: '0 10px 20px rgba(6, 82, 221, 0.2)' }}
                                        >
                                            Phê duyệt tin này
                                        </button>
                                    </>
                                )}
                                <button 
                                    className="btn-primary" 
                                    onClick={() => navigate(`/jobs/${selectedJob.id}`)} 
                                    style={{ 
                                        borderRadius: '12px', 
                                        padding: '12px 24px', 
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                                        color: 'white', 
                                        border: 'none',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 16px rgba(217, 119, 6, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span>
                                    Xem chi tiết trang web
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApproval;
