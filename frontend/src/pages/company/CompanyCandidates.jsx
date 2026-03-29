import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CandidateDetailModal from '../../components/company/CandidateDetailModal';
import { recruitmentApi, companyApi } from '../../api';
import { tagService } from '../../utils/tagService';
import '../../assets/css/company/CompanyCandidates.css';

const CompanyCandidates = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    
    // State for Tagging
    const [allTags, setAllTags] = useState([]);
    const [tagMappings, setTagMappings] = useState({});
    
    // State for Modal
    const [selectedStudentId, setSelectedStudentId] = useState(null);
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

    const handleOpenModal = (studentId) => {
        setSelectedStudentId(studentId);
        setShowModal(true);
    };

    // Filter logic
    const filteredApps = applications.filter(app => {
        const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJob = selectedJobId === 'all' || app.jobId.toString() === selectedJobId;
        const matchesTab = activeTab === 'all' || app.status.toLowerCase() === activeTab.toLowerCase();
        
        return matchesSearch && matchesJob && matchesTab;
    });

    const getStatusLabel = (status) => {
        const labels = {
            'pending': 'Chờ đánh giá',
            'suitable': 'Phù hợp',
            'interview': 'Đang phỏng vấn',
            'offered': 'Đã gửi offer',
            'accepted': 'Đã tuyển',
            'rejected': 'Không phù hợp'
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
                    <div className="section-header">
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
                            {/* Filter Panel */}
                            <div className="filter-panel glass">
                                <div className="filter-group">
                                    <label>Lọc theo tin đăng</label>
                                    <select 
                                        className="filter-control"
                                        value={selectedJobId}
                                        onChange={(e) => setSelectedJobId(e.target.value)}
                                    >
                                        <option value="all">Tất cả tin tuyển dụng</option>
                                        {jobs.map(job => (
                                            <option key={job.id} value={job.id}>{job.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label>Tìm kiếm ứng viên</label>
                                    <div className="search-input-wrapper">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        <input 
                                            type="text" 
                                            placeholder="Tên ứng viên, tên tin đăng..." 
                                            className="filter-control"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status Tabs */}
                            <div className="status-tabs">
                                <div className={`tab-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Tất cả ({applications.length})</div>
                                <div className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Chờ đánh giá</div>
                                <div className={`tab-item ${activeTab === 'suitable' ? 'active' : ''}`} onClick={() => setActiveTab('suitable')}>Phù hợp</div>
                                <div className={`tab-item ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>Đang phỏng vấn</div>
                                <div className={`tab-item ${activeTab === 'offered' ? 'active' : ''}`} onClick={() => setActiveTab('offered')}>Đã gửi offer</div>
                                <div className={`tab-item ${activeTab === 'accepted' ? 'active' : ''}`} onClick={() => setActiveTab('accepted')}>Đã tuyển</div>
                                <div className={`tab-item ${activeTab === 'rejected' ? 'active' : ''}`} onClick={() => setActiveTab('rejected')}>Không phù hợp</div>
                            </div>

                            {/* List Table */}
                            <div className="candidates-list-card glass">
                                <table className="candidates-table">
                                    <thead>
                                        <tr>
                                            <th>Ứng viên</th>
                                            <th>Phân loại</th>
                                            <th className="text-center">Mức phù hợp</th>
                                            <th>Tin đăng</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApps.map(app => (
                                            <tr key={app.id} onClick={() => handleOpenModal(app.studentId)}>
                                                <td>
                                                    <div className="candidate-info-cell">
                                                        <img src={app.studentAvatar || 'https://i.pravatar.cc/150'} alt={app.studentName} className="candidate-avatar" />
                                                        <div className="candidate-name-group">
                                                            <span className="candidate-name">{app.studentName}</span>
                                                            <span className="candidate-meta">ID: S{app.studentId}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="candidate-table-tags">
                                                        {(tagMappings[app.studentId] || []).map(tagId => {
                                                            const tag = allTags.find(t => t.id === tagId);
                                                            if (!tag) return null;
                                                            return (
                                                                <span 
                                                                    key={tag.id} 
                                                                    className="mini-tag-badge"
                                                                    style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}40` }}
                                                                >
                                                                    {tag.name}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="match-cell" onClick={e => e.stopPropagation()}>
                                                    <span className={`match-badge ${getMatchClass(app.matchPercentage)}`}>
                                                        {app.matchPercentage}%
                                                    </span>
                                                </td>
                                                <td className="job-title-cell" onClick={e => e.stopPropagation()}>
                                                    <Link to={`/jobs/${app.jobId}`} className="job-link">{app.jobTitle}</Link>
                                                </td>
                                                <td onClick={e => e.stopPropagation()}>
                                                    <span className={`status-pill status-${app.status.toLowerCase()}`}>
                                                        {getStatusLabel(app.status)}
                                                    </span>
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
            
            {/* Detail Modal */}
            <CandidateDetailModal 
                show={showModal} 
                studentId={selectedStudentId} 
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default CompanyCandidates;
