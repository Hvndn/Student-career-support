import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';
import '../../assets/css/common/JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        jobApi.getJobDetail(id)
            .then(res => {
                const jobData = res.data.data;
                setJob(jobData);
                
                // Fetch applied jobs to check application status
                if (user?.role === 'ROLE_STUDENT') {
                    studentApi.getMyApplications()
                        .then(appsRes => {
                            const apps = appsRes.data.data || [];
                            const isApplied = apps.some(app => app.jobId === parseInt(id));
                            if (isApplied) {
                                setJob(prev => ({ ...prev, isApplied: true, applied: true }));
                            }
                        })
                        .catch(err => console.error(err))
                        .finally(() => setLoading(false));
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleApply = async () => {
        try {
            const res = await studentApi.applyJob(id);
            setMessage(res.data.message);
            setJob(prev => ({ ...prev, isApplied: true, applied: true }));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Bạn cần đăng nhập để ứng tuyển!');
        }
    };

    const handleCancel = async () => {
        try {
            const res = await studentApi.cancelApplication(id);
            setMessage(res.data.message);
            setJob(prev => ({ ...prev, isApplied: false, applied: false }));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi hủy ứng tuyển');
        }
    };

    if (loading) return (
        <div className="job-detail-page flex items-center justify-center">
            <div className="text-center">
                <span className="material-symbols-outlined premium-spinner">refresh</span>
                <p className="loading-text mt-4">Đang tải thông tin việc làm...</p>
            </div>
        </div>
    );

    if (!job) return (
        <div className="job-detail-page flex items-center justify-center">
            <div className="text-center">
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--text-muted)' }}>search_off</span>
                <h2 className="font-bold text-xl mt-4 mb-2">Không tìm thấy công việc</h2>
                <Link to="/jobs" style={{ color: 'var(--accent)', fontWeight: 600 }}>← Quay lại danh sách</Link>
            </div>
        </div>
    );

    const renderActionButtons = () => {
        if (!user) {
            return (
                <Link to="/login" className="btn-apply">
                    Đăng nhập để ứng tuyển
                </Link>
            );
        }
        
        // Hide for non-student roles (Company, Admin, etc.)
        if (user.role !== 'ROLE_STUDENT') return null;

        const hasApplied = job.isApplied || job.applied;
        return hasApplied ? (
            <button onClick={handleCancel} className="btn-cancel">
                Hủy ứng tuyển ↩️
            </button>
        ) : (
            <button onClick={handleApply} className="btn-apply">
                Ứng tuyển ngay 🚀
            </button>
        );
    };

    // Parse description into paragraphs
    const descParagraphs = job.description ? job.description.split('\n').filter(p => p.trim()) : [];

    return (
        <div className="job-detail-page">
            <main className="job-detail-container">
                {/* Left Sidebar Navigation (Sticky) */}
                <aside className="job-sidebar-left">
                    <div className="text-center mb-6">
                        <div className="company-logo-large">
                            {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <h2 className="font-bold text-sm">{job.companyName}</h2>
                        <p className="company-mini-header" style={{ marginBottom: 0, marginTop: '0.25rem' }}>
                            Hiring for {job.title?.split(' ').slice(0, 3).join(' ')}
                        </p>
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <a className="nav-anchor active" href="#overview">
                            <span className="material-symbols-outlined">info</span> Overview
                        </a>
                        <a className="nav-anchor" href="#description">
                            <span className="material-symbols-outlined">description</span> Job Description
                        </a>
                        <a className="nav-anchor" href="#requirements">
                            <span className="material-symbols-outlined">verified</span> Requirements
                        </a>
                        <a className="nav-anchor" href="#benefits">
                            <span className="material-symbols-outlined">card_giftcard</span> Benefits
                        </a>
                        <a className="nav-anchor" href="#company">
                            <span className="material-symbols-outlined">business</span> Company Info
                        </a>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="job-main-content">
                    {/* Header Section */}
                    <section className="job-header-section" id="overview">
                        <nav className="job-breadcrumb">
                            <Link to="/">Trang chủ</Link>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_right</span>
                            <Link to="/jobs">Việc làm</Link>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_right</span>
                            <span style={{ color: 'var(--text)' }}>{job.title}</span>
                        </nav>
                        
                        <div className="job-header-main">
                            <div>
                                <h1 className="job-title-large">{job.title}</h1>
                                <div className="job-meta-row">
                                    <div className="job-meta-item">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <span>{job.location || 'Chưa cập nhật'}</span>
                                    </div>
                                    {job.jobType && (
                                        <div className="job-meta-item">
                                            <span className="material-symbols-outlined">schedule</span>
                                            <span>{job.jobType}</span>
                                        </div>
                                    )}
                                    {job.deadline && (
                                        <div className="job-meta-item">
                                            <span className="material-symbols-outlined">event</span>
                                            <span>Hạn: {job.deadline}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="salary-badge">
                                {job.salary || 'Thoả thuận'}
                            </div>
                        </div>
                    </section>

                    {/* Message Toast */}
                    {message && (
                        <div className="toast-message">
                            ✨ {message}
                        </div>
                    )}

                    {/* Job Description */}
                    <article className="detail-section" id="description">
                        <div className="section-header">
                            <div className="section-indicator"></div>
                            <h3 className="section-title">Mô tả công việc</h3>
                        </div>
                        <div className="section-content">
                            {descParagraphs.length > 0 ? (
                                descParagraphs.map((p, i) => <p key={i}>{p}</p>)
                            ) : (
                                <p>{job.description || 'Chưa có mô tả chi tiết.'}</p>
                            )}
                        </div>
                    </article>

                    {/* Requirements */}
                    <article className="detail-section" id="requirements">
                        <div className="section-header">
                            <div className="section-indicator"></div>
                            <h3 className="section-title">Yêu cầu ứng viên</h3>
                        </div>
                        <div className="section-content">
                            <ul>
                                <li>
                                    <span className="material-symbols-outlined">check_circle</span>
                                    <span>Có kinh nghiệm hoặc đam mê với lĩnh vực liên quan.</span>
                                </li>
                                <li>
                                    <span className="material-symbols-outlined">check_circle</span>
                                    <span>Kỹ năng giao tiếp và làm việc nhóm tốt.</span>
                                </li>
                                <li>
                                    <span className="material-symbols-outlined">check_circle</span>
                                    <span>Tinh thần chủ động, ham học hỏi và sáng tạo.</span>
                                </li>
                                <li>
                                    <span className="material-symbols-outlined">check_circle</span>
                                    <span>Ưu tiên sinh viên năm cuối hoặc đã tốt nghiệp.</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div style={{ marginTop: '2rem' }}>
                            <p className="company-mini-header" style={{ marginBottom: '0.75rem' }}>Loại hình công việc</p>
                            <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                                {job.jobType && (
                                    <span style={{ background: 'var(--surface-hover)', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                        {job.jobType}
                                    </span>
                                )}
                                {job.level && (
                                    <span style={{ background: 'var(--surface-hover)', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                        {job.level}
                                    </span>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Benefits */}
                    <article className="detail-section" id="benefits">
                        <div className="section-header">
                            <div className="section-indicator"></div>
                            <h3 className="section-title">Quyền lợi</h3>
                        </div>
                        <div className="benefits-grid">
                            <div className="benefit-item">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                                <div>
                                    <h4 className="benefit-title">Mức lương cạnh tranh</h4>
                                    <p className="benefit-desc">{job.salary || 'Thoả thuận theo năng lực'}</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                                <div>
                                    <h4 className="benefit-title">Bảo hiểm sức khoẻ</h4>
                                    <p className="benefit-desc">Chăm sóc sức khỏe toàn diện cho nhân viên.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>laptop_mac</span>
                                <div>
                                    <h4 className="benefit-title">Thiết bị hiện đại</h4>
                                    <p className="benefit-desc">Cung cấp thiết bị làm việc tốt nhất.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home_work</span>
                                <div>
                                    <h4 className="benefit-title">Môi trường chuyên nghiệp</h4>
                                    <p className="benefit-desc">Làm việc linh hoạt, sáng tạo.</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Right Sidebar Area */}
                <aside className="job-sidebar-right">
                    <div className="action-card">
                        {renderActionButtons()}
                        
                        <button className="btn-bookmark">
                            <span className="material-symbols-outlined">bookmark</span> Lưu tin tuyển dụng
                        </button>
                        
                        <div className="text-center mt-4">
                            <Link to="/student/profile" style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700 }}>
                                Tải CV mẫu chuẩn
                            </Link>
                        </div>
                        
                        <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)', borderStyle: 'solid', borderBottom: 'none' }} />
                        
                        <div className="company-mini-info" id="company">
                            <p className="company-mini-header">Thông tin công ty</p>
                            <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                                <div className="company-mini-logo">
                                    {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <h4 className="font-bold text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.companyName}</h4>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Đang tuyển dụng</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>location_on</span>
                                <span>{job.location || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, padding: '0 0.5rem', marginBottom: '0.75rem' }}>Khám phá thêm</h4>
                        <Link to="/jobs" className="back-card">
                            ← Quay lại danh sách việc làm
                        </Link>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default JobDetail;
