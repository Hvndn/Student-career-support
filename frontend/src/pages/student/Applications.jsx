import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/common/Applications.css'; // Use shared CSS folder structure
import ApplicationDetailDrawer from '../../components/student/ApplicationDetailDrawer';

const Applications = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

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

    const getStatusConfig = (status) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'review': 
            case 'suitable': return { class: 'status-reviewing', icon: 'visibility', label: 'Đã xem' };
            case 'interview': return { class: 'status-interview', icon: 'event', label: 'Phỏng vấn' };
            case 'accepted': return { class: 'status-accepted', icon: 'stars', label: 'Trúng tuyển' };
            case 'rejected': return { class: 'status-rejected', icon: 'cancel', label: 'Từ chối' };
            case 'pending': return { class: 'status-pending', icon: 'send', label: 'Đang chờ duyệt' };
            default: return { class: 'status-pending', icon: 'pending', label: status || 'Chờ xử lý' };
        }
    };

    const formatDate = (dt) => {
        if (!dt) return 'N/A';
        return new Date(dt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (loading) return (
        <div className="job-list-container-inner" style={{ paddingTop: '100px', textAlign: 'center' }}>
             <span className="material-symbols-outlined spinner" style={{fontSize: '3rem', color: '#0f409f', animation: 'spin 1s linear infinite'}}>refresh</span>
             <p style={{ marginTop: '1rem', color: '#64748b' }}>Đang tải danh sách đơn ứng tuyển...</p>
        </div>
    );

    return (
        <>
        <div className="job-list-container-inner fade-in">
            {/* Breadcrumb - Cleaned up */}
            <div className="job-list-top-bar" style={{ padding: '24px 0 8px' }}>
                <div className="breadcrumb-premium">
                    <Link to="/student/dashboard" className="breadcrumb-prev">DAU Connect</Link>
                    <span className="material-symbols-outlined breadcrumb-sep">chevron_right</span>
                    <span className="breadcrumb-current">Đơn ứng tuyển</span>
                </div>
            </div>

            {/* Results Header */}
            <div className="results-info-premium">
                <div className="results-title-wrap">
                    <h2 className="results-count-title">Việc làm đã ứng tuyển</h2>
                    <span className="results-badge-premium">{apps.length}</span>
                </div>
                <p className="results-subtitle-premium">Danh sách các công việc bạn đã nộp hồ sơ</p>
                <div className="results-page-info" style={{ marginLeft: 'auto' }}>Trang 1 / 1</div>
            </div>

            {/* Applications Table */}
            {apps.length === 0 ? (
                <div className="empty-apps">
                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }}>inbox</span>
                    <h3>Chưa có đơn ứng tuyển</h3>
                    <p>Bạn chưa nộp đơn ứng tuyển nào. Hãy khám phá các cơ hội việc làm ngay!</p>
                    <Link to="/jobs" className="btn-find-jobs" style={{ display: 'inline-flex', marginTop: '24px' }}>
                        <span className="material-symbols-outlined">search</span>
                        Tìm việc làm
                    </Link>
                </div>
            ) : (
                <div className="apps-table-container">
                    <table className="apps-table">
                        <thead>
                            <tr>
                                <th>CÔNG TY</th>
                                <th>VỊ TRÍ ỨNG TUYỂN</th>
                                <th>KỸ NĂNG</th>
                                <th>MỨC LƯƠNG</th>
                                <th>ĐỊA ĐIỂM</th>
                                <th>TRẠNG THÁI</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map(app => {
                                const status = getStatusConfig(app.status);
                                return (
                                    <tr key={app.id} className="app-row-premium">
                                        <td>
                                            <div className="company-cell">
                                                <div className="company-logo-mini">
                                                    {app.companyLogoUrl ? (
                                                        <img src={app.companyLogoUrl} alt={app.companyName} />
                                                    ) : (
                                                        app.companyName?.charAt(0) || 'C'
                                                    )}
                                                </div>
                                                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748b' }}>{app.companyName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="job-cell-info">
                                                <h4>{app.jobTitle}</h4>
                                                <p>{app.companyName}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="skills-cell-wrap">
                                                {(app.skills || ['SketchUp', 'AutoCAD']).slice(0, 2).map((s, i) => (
                                                    <span key={i} className="skill-tag-micro">{s}...</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="salary-cell">
                                                $ {app.salaryRange || '20 - 30 triệu'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="location-cell">
                                                <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#f97316' }}>location_on</span>
                                                {app.jobLocation || 'Hà Nội'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-cell-wrap">
                                                <span className={`app-status-badge ${status.class}`}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{status.icon}</span>
                                                    {status.label}
                                                </span>
                                                <span className="status-meta">Nộp: {formatDate(app.appliedAt)}</span>
                                            </div>
                                        </td>
                                        <td className="action-cell">
                                            <button className="btn-row-detail" onClick={() => setSelectedApp(app)}>
                                                <span className="material-symbols-outlined">menu_open</span>
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        {/* Detail Drawer - Moved outside the fade-in container */}
        {selectedApp && (
            <ApplicationDetailDrawer 
                application={selectedApp} 
                onClose={() => setSelectedApp(null)} 
            />
        )}
        </>
    );
};

export default Applications;
