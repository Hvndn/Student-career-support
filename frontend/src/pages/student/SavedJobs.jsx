import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import toast from 'react-hot-toast';
import '../../assets/css/common/JobList.css';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSavedJobs();
    }, []);

    const loadSavedJobs = () => {
        setLoading(true);
        studentApi.getSavedJobs()
            .then(res => {
                setJobs(res.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleUnsave = async (e, jobId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await studentApi.saveJob(jobId); // Assuming toggle behavior in backend
            toast.success('Đã bỏ lưu công việc');
            setJobs(prev => prev.filter(j => j.id !== jobId));
        } catch (err) {
            toast.error('Không thể bỏ lưu công việc. Vui lòng thử lại!');
        }
    };

    if (loading) return (
        <div className="job-list-container-inner" style={{ paddingTop: '100px', textAlign: 'center' }}>
             <span className="material-symbols-outlined spinner" style={{fontSize: '3rem', color: '#0f409f', animation: 'spin 1s linear infinite'}}>refresh</span>
             <p style={{ marginTop: '1rem', color: '#64748b' }}>Đang tải danh sách việc làm đã lưu...</p>
        </div>
    );

    return (
        <div className="job-list-container-inner fade-in">

            {/* Results Header */}
            <div className="results-info-premium">
                <div className="results-title-wrap">
                    <h2 className="results-count-title">Việc làm đã lưu</h2>
                    <span className="results-badge-premium">{jobs.length}</span>
                </div>
                <p className="results-subtitle-premium">Các công việc bạn đã đánh dấu quan tâm</p>
                <div className="results-page-info">Trang 1 / 1</div>
            </div>

            {/* Content Area */}
            <div className="job-content-area">
                {jobs.length === 0 ? (
                    <div className="empty-state-premium" style={{ background: 'white', padding: '100px 20px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#cbd5e1' }}>bookmark_border</span>
                        <h3>Chưa có việc làm nào được lưu</h3>
                        <p>Hãy khám phá các cơ hội nghề nghiệp và lưu lại những vị trí bạn yêu thích.</p>
                        <Link to="/jobs" className="apply-btn-premium" style={{ marginTop: '24px', display: 'inline-flex' }}>
                            Khám phá ngay <span className="material-symbols-outlined">east</span>
                        </Link>
                    </div>
                ) : (
                    <div className="job-grid-premium">
                        {jobs.map(job => (
                            <div key={job.id} state={{ from: '/student/saved' }} className="job-card-premium fade-in">
                                <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div className="card-top-media">
                                        {job.imageUrl ? (
                                            <img src={getImageUrl(job.imageUrl)} alt={job.title} className="card-banner-img" />
                                        ) : (
                                            <div className="media-placeholder">
                                                <span className="material-symbols-outlined">apartment</span>
                                            </div>
                                        )}
                                        <span className="card-type-tag" style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '8px' }}>{job.jobType || 'Toàn thời gian'}</span>
                                        <button 
                                            className="card-fav-btn" 
                                            onClick={(e) => handleUnsave(e, job.id)}
                                            style={{ 
                                                right: '12px', 
                                                top: '12px', 
                                                background: '#f97316', 
                                                color: 'white', 
                                                borderRadius: '50%', 
                                                width: '40px', 
                                                height: '40px',
                                                boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>bookmark</span>
                                        </button>
                                    </div>
                                    <div className="card-main-body" style={{ padding: '20px' }}>
                                        <h3 className="job-title-premium" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{job.title}</h3>
                                        <div className="company-info-row" style={{ marginBottom: '20px' }}>
                                            <div className="company-logo-placeholder" style={{ background: '#1e293b', color: 'white' }}>
                                                {job.companyName ? job.companyName.charAt(0) : 'C'}
                                            </div>
                                            <span className="company-name-premium" style={{ color: '#64748b' }}>{job.companyName}</span>
                                        </div>
                                        <div className="job-detail-box" style={{ background: '#f8fafc', border: 'none' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#10b981', fontSize: '20px' }}>payments</span>
                                            <span className="detail-text" style={{ fontWeight: '600' }}>
                                                {job.salary || (job.minSalary ? `${job.minSalary/1000000} - ${job.maxSalary/1000000} triệu` : 'Thỏa thuận')}
                                            </span>
                                        </div>
                                        <div className="job-detail-box" style={{ background: '#f8fafc', border: 'none' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '20px' }}>location_on</span>
                                            <span className="detail-text" style={{ fontWeight: '500' }}>{job.location || 'Đà Nẵng'}</span>
                                        </div>
                                    </div>
                                    <div className="card-footer-premium" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                        <div className="posted-time">
                                            <span className="material-symbols-outlined">schedule</span> {job.postedAt ? new Date(job.postedAt).toLocaleDateString('vi-VN') : '14/3/2026'}
                                        </div>
                                        <div className="apply-btn-premium" style={{ background: '#0f409f', padding: '8px 20px' }}>
                                            Ứng tuyển <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
