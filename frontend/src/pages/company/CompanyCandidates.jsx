import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CandidateDetailModal from '../../components/company/CandidateDetailModal';
import { recruitmentApi, companyApi } from '../../api';
import { tagService } from '../../utils/tagService';
import toast from 'react-hot-toast';
import '../../assets/css/company/CompanyCandidates.css';

const CompanyCandidates = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedTagId, setSelectedTagId] = useState('all');
    
    // State for Tagging
    const [allTags, setAllTags] = useState([]);
    const [tagMappings, setTagMappings] = useState({});
    
    // State for Modal
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, jobsRes] = await Promise.all([
                    recruitmentApi.getApplications(),
                    companyApi.getJobs()
                ]);
                
                if (appsRes.data.status === 'success') {
                    setApplications(appsRes.data.data);
                }
                if (jobsRes.data.status === 'success') {
                    setJobs(jobsRes.data.data);
                }
                
                // Load Tags metadata
                setAllTags(tagService.getTags());
                setTagMappings(tagService.getAllMappings());
                
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu ứng viên:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Re-load tags when modal closes (to reflect changes made in modal)
    const handleCloseModal = () => {
        setShowModal(false);
        setTagMappings(tagService.getAllMappings());
    };

    const handleOpenModal = (studentId, appId, status) => {
        setSelectedStudentId(studentId);
        setSelectedAppId(appId);
        setCurrentStatus(status);
        setShowModal(true);
    };

    const handleUpdateStatus = async (appId, status, e) => {
        if (e) e.stopPropagation();
        try {
            const res = await recruitmentApi.updateStatus(appId, status);
            if (res.data.status === 'success') {
                if (status === 'suitable') {
                    toast.success("Đã duyệt ứng viên");
                } else if (status === 'pending') {
                    toast.success("Đã hoàn tác trạng thái ứng viên");
                } else {
                    toast.success(`Đã chuyển ứng viên sang trạng thái ${getStatusLabel(status)}`);
                }
                // Cập nhật state local
                setApplications(prev => prev.map(app => 
                    app.id === appId ? { ...app, status: status } : app
                ));
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
    };

    // Filter logic
    const filteredApps = applications.filter(app => {
        const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJob = selectedJobId === 'all' || app.jobId.toString() === selectedJobId;
        const matchesTab = activeTab === 'all' || app.status.toLowerCase() === activeTab.toLowerCase();
        const matchesTag = selectedTagId === 'all' || (tagMappings[app.studentId] || []).includes(Number(selectedTagId));
        
        return matchesSearch && matchesJob && matchesTab && matchesTag;
    });

    const getStatusLabel = (status) => {
        const labels = {
            'pending': 'Chờ đánh giá',
            'suitable': 'Đã duyệt',
            'interview': 'Phỏng vấn',
            'offered': 'Đã gửi offer',
            'accepted': 'Đã nhận',
            'rejected': 'Từ chối'
        };
        return labels[status.toLowerCase()] || status;
    };

    const getMatchClass = (percent) => {
        if (percent >= 85) return 'match-high';
        if (percent >= 70) return 'match-med';
        return '';
    };

    if (loading) return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang tải danh sách ứng viên...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyNavbar activeTab="Ứng viên" />

                <div className="candidates-page">
                    <div className="section-header intro-y">
                        <h3><span className="icon">👥</span> Quản lý ứng viên</h3>
                        <div className="header-actions">
                            <Link to="/company/candidate-tags" className="btn-respond" style={{ width: 'auto', padding: '0.6rem 1.2rem', textDecoration: 'none', background: '#eef2ff', color: '#6366f1', marginRight: '10px' }}>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight: '8px'}}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                Quản lý thẻ
                            </Link>
                            <button className="btn-respond" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight: '8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Xuất báo cáo
                            </button>
                        </div>
                    </div>

                    <div className="candidates-container">
                        <div className="candidates-main-content full-width">
                            
                            {/* DAU Connect Standard Filter Bar */}
                            <div className="dau-filter-bar intro-y" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                                <div className="filter-left" style={{ display: 'flex', gap: '16px' }}>
                                    {/* Lọc Trạng Thái */}
                                    <select 
                                        className="dau-select filter-control"
                                        value={activeTab}
                                        onChange={(e) => setActiveTab(e.target.value)}
                                        style={{ minWidth: '180px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '10px 16px', color: '#64748b', fontSize: '14px' }}
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="pending">Chờ duyệt</option>
                                        <option value="suitable">Đã duyệt</option>
                                        <option value="interview">Phỏng vấn</option>
                                        <option value="offered">Đã gửi offer</option>
                                        <option value="accepted">Đã nhận</option>
                                        <option value="rejected">Từ chối</option>
                                    </select>

                                    {/* Chọn vị trí ứng tuyển */}
                                    <select 
                                        className="dau-select filter-control"
                                        value={selectedJobId}
                                        onChange={(e) => setSelectedJobId(e.target.value)}
                                        style={{ minWidth: '220px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '10px 16px', color: '#64748b', fontSize: '14px' }}
                                    >
                                        <option value="all">Chọn ngày...</option>
                                    </select>
                                </div>
                                
                                <div className="filter-right">
                                    <div className="search-input-wrapper" style={{ position: 'relative' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Tìm ứng viên hoặc vị trí..." 
                                            className="filter-control dau-search-pill"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ minWidth: '280px', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '10px 36px 10px 16px', fontSize: '14px' }}
                                        />
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94a3b8" strokeWidth="2" fill="none" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Standard DAU Table */}
                            <div className="dau-table-container intro-y delay-1">
                                <div className="candidates-list-card" style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                    <table className="candidates-table dau-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                            <tr>
                                                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase' }}>ỨNG VIÊN</th>
                                                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase' }}>VỊ TRÍ ỨNG TUYỂN</th>
                                                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase' }}>NGÀY NỘP</th>
                                                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>TRẠNG THÁI</th>
                                                <th style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'right', textTransform: 'uppercase' }}>HÀNH ĐỘNG</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {filteredApps.map(app => (
                                            <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                {/* Cột 1: Ứng viên */}
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img src={app.studentAvatar || `https://ui-avatars.com/api/?name=${app.studentName}&background=random`} alt={app.studentName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                        <div>
                                                            <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14.5px' }}>{app.studentName}</div>
                                                            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{app.studentSkills?.split(',')[0] || 'Kiến trúc'}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Cột 2: Vị trí */}
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '14.5px' }}>{app.jobTitle}</div>
                                                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>Full-time - Vị trí ứng tuyển</div>
                                                </td>

                                                {/* Cột 3: Ngày nộp */}
                                                <td style={{ padding: '16px 20px', color: '#0f172a', fontSize: '14px', fontWeight: '500' }}>
                                                    {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                                                </td>

                                                {/* Cột 4: Trạng thái */}
                                                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                                    <span style={{ 
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                                        color: app.status === 'pending' ? '#ea580c' : app.status === 'suitable' ? '#16a34a' : app.status === 'rejected' ? '#dc2626' : '#2563eb', 
                                                        fontSize: '14px', fontWeight: '600'
                                                    }}>
                                                        {app.status === 'pending' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> : null}
                                                        {app.status === 'suitable' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> : null}
                                                        {app.status === 'rejected' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> : null}
                                                        {app.status === 'pending' ? 'Chờ duyệt' : app.status === 'suitable' ? 'Đã duyệt' : app.status === 'rejected' ? 'Từ chối' : 'Chờ xử lý'}
                                                    </span>
                                                </td>

                                                {/* Cột 5: Hành động */}
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <button 
                                                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500' }}
                                                            onClick={() => handleOpenModal(app.studentId, app.id, app.status)}
                                                        >
                                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                            Xem
                                                        </button>
                                                        <button 
                                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '500' }}
                                                        >
                                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredApps.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                    Không tìm thấy hồ sơ ứng tuyển nào.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Detail Modal */}
            <CandidateDetailModal 
                show={showModal} 
                studentId={selectedStudentId}
                applicationId={selectedAppId}
                initialStatus={currentStatus}
                onClose={handleCloseModal}
                onStatusUpdate={(newStatus) => {
                    setApplications(prev => prev.map(app => 
                        app.id === selectedAppId ? { ...app, status: newStatus } : app
                    ));
                }}
            />
        </div>
    );
};

export default CompanyCandidates;
