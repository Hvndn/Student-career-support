import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/common/Applications.css'; // Use shared CSS folder structure

const Applications = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadApps = () => {
        studentApi.getMyApplications()
            .then(res => {
                setApps(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadApps();
    }, []);

    const handleCancel = async (jobId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn ứng tuyển này?")) return;
        try {
            await studentApi.cancelApplication(jobId);
            toast.success("Hủy ứng tuyển thành công");
            loadApps();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi hủy ứng tuyển');
        }
    };

    const getStatusConfig = (status) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'review': return { class: 'status-reviewing', icon: 'hourglass_top', label: 'Đang xem xét' };
            case 'suitable': return { class: 'status-accepted', icon: 'thumb_up', label: 'Phù hợp' };
            case 'interview': return { class: 'status-interview', icon: 'event', label: 'Phỏng vấn' };
            case 'accepted': return { class: 'status-accepted', icon: 'check_circle', label: 'Đã chấp nhận' };
            case 'rejected': return { class: 'status-rejected', icon: 'cancel', label: 'Đã từ chối' };
            case 'pending': return { class: 'status-pending', icon: 'hourglass_empty', label: 'Chờ duyệt' };
            default: return { class: 'status-pending', icon: 'pending', label: status || 'Chờ xử lý' };
        }
    };

    const formatDate = (dt) => {
        if (!dt) return 'N/A';
        return new Date(dt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (loading) return (
        <div className="applications-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <span className="material-symbols-outlined premium-spinner">refresh</span>
                <p className="loading-text" style={{ marginTop: '1rem' }}>Đang tải danh sách đơn ứng tuyển...</p>
            </div>
        </div>
    );

    return (
        <div className="applications-page">
            <div className="applications-container">
                {/* Header */}
                    <div className="apps-header-main">
                        <div>
                            <h1 className="apps-title">Đơn ứng tuyển của tôi</h1>
                            <p className="apps-desc">Theo dõi trạng thái tất cả các đơn ứng tuyển bạn đã gửi.</p>
                        </div>
                        <div>
                            <span className="apps-count-badge">
                                {apps.length} đơn
                            </span>
                        </div>
                    </div>

                {/* Stats Row */}
                <div className="apps-stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon total">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                            <p className="stat-value">{apps.length}</p>
                            <p className="stat-label">Tổng đơn</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon reviewing">
                            <span className="material-symbols-outlined">hourglass_top</span>
                        </div>
                        <div>
                            <p className="stat-value">{apps.filter(a => ['review', 'suitable', 'interview', 'pending'].includes((a.status||'').toLowerCase())).length}</p>
                            <p className="stat-label">Đang xét</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon accepted">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <div>
                            <p className="stat-value">{apps.filter(a => (a.status||'').toLowerCase() === 'accepted').length}</p>
                            <p className="stat-label">Chấp nhận</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon rejected">
                            <span className="material-symbols-outlined">cancel</span>
                        </div>
                        <div>
                            <p className="stat-value">{apps.filter(a => (a.status||'').toLowerCase() === 'rejected').length}</p>
                            <p className="stat-label">Từ chối</p>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                {apps.length === 0 ? (
                    <div className="empty-apps">
                        <span className="material-symbols-outlined">inbox</span>
                        <h3>Chưa có đơn ứng tuyển</h3>
                        <p>Bạn chưa nộp đơn ứng tuyển nào. Hãy khám phá các cơ hội việc làm ngay!</p>
                        <Link to="/jobs" className="btn-find-jobs">
                            <span className="material-symbols-outlined">search</span>
                            Tìm việc làm
                        </Link>
                    </div>
                ) : (
                    <div className="apps-list">
                        {apps.map(app => {
                            const status = getStatusConfig(app.status);
                            return (
                                <div key={app.id} className="app-card">
                                    {/* Company Icon */}
                                    <div className="app-company-logo">
                                        {app.companyName ? app.companyName.charAt(0).toUpperCase() : 'C'}
                                    </div>

                                    {/* Info */}
                                    <div className="app-info">
                                        <div className="app-header-row">
                                            <div>
                                                <h3 className="app-job-title">{app.jobTitle}</h3>
                                                <p className="app-company-name">{app.companyName}</p>
                                            </div>
                                            {/* Status Badge */}
                                            <span className={`app-status-badge ${status.class}`}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>{status.icon}</span>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="app-meta-row">
                                            <span className="app-meta-item">
                                                <span className="material-symbols-outlined">calendar_today</span>
                                                Ứng tuyển: {formatDate(app.appliedAt)}
                                            </span>
                                            <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                                                {app.jobId && (
                                                    <Link to={`/jobs/${app.jobId}`} className="app-job-link">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>open_in_new</span>
                                                        Xem việc làm
                                                    </Link>
                                                )}
                                                {['pending', 'reviewing'].includes((app.status||'').toLowerCase()) && (
                                                    <button onClick={() => handleCancel(app.jobId)} style={{ color: 'var(--error, #ef4444)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.75rem' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>cancel</span>
                                                        Hủy
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
