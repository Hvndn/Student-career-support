import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recruitmentApi } from '../../api';
import toast from 'react-hot-toast';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import '../../assets/css/company/Applicants.css';
import RejectionModal from '../../components/company/RejectionModal';
import CandidateDetailModal from '../../components/company/CandidateDetailModal';

const Applicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [pendingRejectData, setPendingRejectData] = useState(null);
    
    // States cho Detail Modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        recruitmentApi.getApplicants(jobId)
            .then(res => {
                setApplicants(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [jobId]);

    const handleStatusUpdate = async (appId, status, rejectionReason = null) => {
        if (status === 'rejected' && rejectionReason === null) {
            const app = applicants.find(a => a.id === appId);
            setPendingRejectData({ id: appId, studentName: app?.studentName });
            setShowRejectionModal(true);
            return;
        }

        try {
            await recruitmentApi.updateStatus(appId, status, rejectionReason);
            const normalizedStatus = status.toLowerCase();
            setApplicants(prev => prev.map(app =>
                app.id === appId ? { ...app, status: normalizedStatus, rejectionReason } : app
            ));
            
            if (selectedApp?.id === appId) {
                setSelectedApp(prev => ({ ...prev, status: normalizedStatus, rejectionReason }));
            }

            if (normalizedStatus === 'accepted') {
                toast.success('Đã duyệt ứng viên! Thông báo đã được gửi tới sinh viên.');
            } else if (normalizedStatus === 'rejected') {
                toast.success('Đã từ chối ứng viên. Lý do đã được lưu lại.');
                setShowRejectionModal(false);
            } else {
                toast.success('Cập nhật trạng thái thành công!');
            }
        } catch (err) {
            toast.error('Cập nhật trạng thái thất bại!');
        }
    };

    const handleOpenDetail = (app) => {
        setSelectedApp(app);
        setShowDetailModal(true);
    };

    const getStatusConfig = (status) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'accepted': return { label: 'Đã duyệt', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: 'check_circle' };
            case 'rejected': return { label: 'Đã từ chối', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: 'cancel' };
            case 'review': return { label: 'Đang xem xét', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: 'hourglass_top' };
            case 'suitable': return { label: 'Phù hợp', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: 'thumb_up' };
            case 'interview': return { label: 'Phỏng vấn', bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', icon: 'event' };
            case 'offer': return { label: 'Mời nhận việc', bg: 'rgba(16, 185, 129, 0.25)', color: '#059669', icon: 'card_giftcard' };
            case 'hired': return { label: 'Đã tuyển', bg: 'rgba(5, 150, 105, 0.3)', color: '#047857', icon: 'person_check' };
            case 'pending':
            default: return { label: 'Chờ duyệt', bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', icon: 'hourglass_empty' };
        }
    };

    const formatDate = (dt) => {
        if (!dt) return 'N/A';
        return new Date(dt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải...</div>;

    const pendingCount = applicants.filter(a => ['pending', 'review', 'suitable', 'interview'].includes((a.status || '').toLowerCase())).length;
    const acceptedCount = applicants.filter(a => ['accepted', 'offer', 'hired'].includes((a.status || '').toLowerCase())).length;
    const rejectedCount = applicants.filter(a => (a.status || '').toLowerCase() === 'rejected').length;

    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyNavbar title="Ứng viên" />
                <main className="cd-main">
                    <div className="container" style={{ marginTop: '3rem' }}>
                        <h1 style={{ marginBottom: '1rem' }}>Quản lý <span className="gradient-text">Ứng viên</span></h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Tổng: {applicants.length} ứng viên —
                            <span style={{ color: '#6366f1' }}> {pendingCount} chờ duyệt</span>,
                            <span style={{ color: '#10b981' }}> {acceptedCount} đã duyệt</span>,
                            <span style={{ color: '#ef4444' }}> {rejectedCount} từ chối</span>
                        </p>

                        <div className="glass applicants-table-container" style={{ padding: '2rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Ứng viên</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Ngày nộp</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Hồ sơ</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Trạng thái</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(app => {
                                        const statusCfg = getStatusConfig(app.status);
                                        const isDecided = ['accepted', 'rejected'].includes((app.status || '').toLowerCase());
                                        return (
                                            <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td data-label="ỨNG VIÊN" style={{ padding: '1.5rem 1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white', fontWeight: 'bold', fontSize: '0.85rem',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {app.studentAvatar ? (
                                                                <img src={app.studentAvatar.startsWith('http') ? app.studentAvatar : `http://localhost:8080${app.studentAvatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                (app.studentName || 'U').charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div 
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleOpenDetail(app)}
                                                        >
                                                            <div style={{ fontWeight: 'bold', color: 'var(--dau-primary)' }}>{app.studentName}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                                {app.matchPercentage ? `Phù hợp ${app.matchPercentage}%` : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td data-label="NGÀY NỘP" style={{ padding: '1.5rem 1rem' }}>{formatDate(app.appliedAt)}</td>
                                                <td data-label="HỒ SƠ" style={{ padding: '1.5rem 1rem' }}>
                                                    {(app.cvData || app.cvUrl) ? (
                                                        <div 
                                                            onClick={() => handleOpenDetail(app)}
                                                            style={{ 
                                                                color: app.cvData ? 'var(--dau-primary)' : '#6366f1', 
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                gap: '0.25rem',
                                                                fontWeight: 600,
                                                                fontSize: '0.85rem',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                                                                {app.cvData ? 'auto_stories' : 'picture_as_pdf'}
                                                            </span>
                                                            {app.cvName || (app.cvData ? 'CV Online' : 'File PDF')}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#ccc', fontSize: '0.85rem' }}>N/A</span>
                                                    )}
                                                </td>
                                                <td data-label="TRẠNG THÁI" style={{ padding: '1.5rem 1rem' }}>
                                                    <span style={{
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        background: statusCfg.bg,
                                                        color: statusCfg.color,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem'
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>{statusCfg.icon}</span>
                                                        {statusCfg.label}
                                                    </span>
                                                </td>
                                                <td data-label="THAO TÁC" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        {!isDecided && (
                                                            <>
                                                                <button onClick={() => handleStatusUpdate(app.id, 'review')} className="btn glass" style={{ fontSize: '0.75rem', color: '#f59e0b', padding: '0.4rem 0.6rem' }}>
                                                                     <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>hourglass_top</span>
                                                                     Xem xét
                                                                 </button>
                                                                 <button onClick={() => handleStatusUpdate(app.id, 'interview')} className="btn glass" style={{ fontSize: '0.75rem', color: '#3b82f6', padding: '0.4rem 0.6rem' }}>
                                                                     <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>event</span>
                                                                     Phỏng vấn
                                                                 </button>
                                                                 {['interview', 'interviewing', 'suitable', 'accepted', 'passed', 'hired'].includes((app.status || '').toLowerCase()) && (
                                                                     <>
                                                                         <button onClick={() => handleStatusUpdate(app.id, 'suitable')} className="btn glass" style={{ fontSize: '0.75rem', color: '#10b981', padding: '0.4rem 0.6rem' }}>
                                                                             <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>thumb_up</span>
                                                                             Phù hợp
                                                                         </button>
                                                                         <button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="btn glass" style={{ fontSize: '0.75rem', color: '#10b981', padding: '0.4rem 0.6rem', border: '1px solid #10b981' }}>
                                                                             <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>check_circle</span>
                                                                             Duyệt
                                                                         </button>
                                                                     </>
                                                                 )}
                                                                 <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="btn glass" style={{ fontSize: '0.75rem', color: '#ef4444', padding: '0.4rem 0.6rem' }}>
                                                                     <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>cancel</span>
                                                                     Từ chối
                                                                 </button>
                                                            </>
                                                        )}
                                                        {isDecided && (
                                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                                Đã xử lý
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {applicants.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chưa có ứng viên nào nộp đơn.</div>}
                        </div>
                    </div>
                </main>
            </div>
            <RejectionModal 
                show={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                onConfirm={(reason) => {
                    if (pendingRejectData) {
                        handleStatusUpdate(pendingRejectData.id, 'rejected', reason);
                    }
                }}
                studentName={pendingRejectData?.studentName}
            />

            <CandidateDetailModal 
                show={showDetailModal}
                applicationId={selectedApp?.id}
                studentId={selectedApp?.studentId}
                initialStatus={selectedApp?.status}
                jobTitle={selectedApp?.jobTitle}
                appliedAt={selectedApp?.appliedAt}
                coverLetter={selectedApp?.coverLetter}
                cvUrl={selectedApp?.cvUrl}
                cvData={selectedApp?.cvData}
                cvName={selectedApp?.cvName}
                onClose={() => setShowDetailModal(false)}
                onStatusUpdate={(newStatus) => {
                    handleStatusUpdate(selectedApp.id, newStatus);
                }}
            />
        </div>
    );
};

export default Applicants;
