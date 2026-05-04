import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import CandidateDetailModal from '../../components/company/CandidateDetailModal';
import { recruitmentApi, companyApi } from '../../api';
import { tagService } from '../../utils/tagService';
import toast from 'react-hot-toast';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import '../../assets/css/company/CompanyCandidates.css';

const CompanyCandidates = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedTagId, setSelectedTagId] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    
    // State for Tagging
    const [allTags, setAllTags] = useState([]);
    const [tagMappings, setTagMappings] = useState({});
    const customDateRef = useRef(null);
    
    // State for Modal
    const [selectedApp, setSelectedApp] = useState(null);
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
                    const apps = appsRes.data.data;
                    setApplications(apps);
                    
                    // Tăng cường dữ liệu: Lấy thông tin chi tiết từ profile gốc để đảm bảo chuyên ngành và kỹ năng là mới nhất
                    const uniqueStudentIds = [...new Set(apps.map(a => a.studentId))];
                    if (uniqueStudentIds.length > 0) {
                        const detailsRes = await Promise.all(
                            uniqueStudentIds.map(id => companyApi.getCandidateDetail(id).catch(() => null))
                        );
                        
                        const detailsMap = {};
                        detailsRes.forEach(res => {
                            if (res?.data?.status === 'success') {
                                const d = res.data.data;
                                // API này trả về đối tượng có id là studentId
                                const sId = d.id || d.studentId;
                                if (sId) detailsMap[sId] = d;
                            }
                        });
                        
                        setApplications(prev => prev.map(a => {
                            const detail = detailsMap[a.studentId];
                            if (detail) {
                                return {
                                    ...a,
                                    // Ghi đè bằng dữ liệu tươi mới nhất từ profile sinh viên gốc
                                    studentMajor: detail.major || a.studentMajor,
                                    studentSkills: (detail.skills && Array.isArray(detail.skills)) 
                                        ? detail.skills.map(s => typeof s === 'string' ? s : (s.name || '')).join(', ') 
                                        : (detail.skills || a.studentSkills),
                                    studentExperience: detail.experience || a.studentExperience,
                                    studentLocation: detail.location || a.studentLocation,
                                    expectedSalary: detail.expectedSalary || a.expectedSalary,
                                    githubUrl: detail.githubUrl || a.githubUrl,
                                    cvUrl: detail.cvUrl || a.cvUrl,
                                    gpa: detail.gpa || a.gpa,
                                    studentProjects: detail.projects || []
                                };
                            }
                            return a;
                        }));
                    }
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

    const handleOpenModal = (app) => {
        setSelectedApp(app);
        setSelectedStudentId(app.studentId);
        setSelectedAppId(app.id);
        setCurrentStatus(app.status);
        setShowModal(true);
    };

    const handleUpdateStatus = async (appId, status, e) => {
        if (e) e.stopPropagation();
        try {
            const res = await recruitmentApi.updateStatus(appId, status);
            if (res.data.status === 'success') {
                if (status === 'pending') {
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

    // State for Sorting
    const [sortConfig, setSortConfig] = useState({ key: 'appliedAt', direction: 'desc' });

    // Filter and Sort logic
    const filteredApps = applications
        .map(app => {
            // SỬ DỤNG TRỰC TIẾP ĐIỂM SỐ VÀ CHI TIẾT TỪ BACKEND
            const score = app.matchScore || app.matchPercentage || 0;
            const details = app.matchDetails || {};
            
            return { 
                ...app, 
                enhancedMatch: score,
                matchBreakdown: {
                    skills: details.skillsScore || 0,
                    major: details.educationScore || 0,
                    location: details.locationScore || 0,
                    experience: details.experienceScore || 0,
                    projectBonus: (details.projectScore || 0) + (details.softSkillScore || 0)
                }
            };
        })
        .filter(app => {
            const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 (app.studentSkills || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesJob = selectedJobId === 'all' || app.jobId.toString() === selectedJobId;
            const matchesTab = activeTab === 'all' || app.status.toLowerCase() === activeTab.toLowerCase();
            
            const matchesDate = (() => {
                if (dateFilter === 'all') return true;
                
                const appDate = new Date(app.appliedAt);
                const now = new Date();

                if (dateFilter === '15m') return appDate >= new Date(now.getTime() - 15 * 60 * 1000);
                if (dateFilter === '1d') return appDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
                if (dateFilter === '7d') return appDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (dateFilter === '30d') return appDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                
                if (dateFilter === 'custom') {
                    if (!startDate) return true;
                    const d = new Date(app.appliedAt);
                    const appDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    return appDateStr === startDate;
                }

                return true;
            })();

            return matchesSearch && matchesJob && matchesTab && matchesDate;
        })
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            // Handle date comparison
            if (sortConfig.key === 'appliedAt') {
                valA = new Date(valA);
                valB = new Date(valB);
            }
            
            // Đảm bảo matchPercentage/enhancedMatch là số
            if (sortConfig.key === 'matchPercentage') {
                valA = parseFloat(a.enhancedMatch || 0);
                valB = parseFloat(b.enhancedMatch || 0);
            }
            
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FiArrowDown size={12} style={{ opacity: 0.3, marginLeft: '4px' }} />;
        return sortConfig.direction === 'asc' 
            ? <FiArrowUp size={12} style={{ color: '#2563eb', marginLeft: '4px' }} /> 
            : <FiArrowDown size={12} style={{ color: '#2563eb', marginLeft: '4px' }} />;
    };

    // Auto-open calendar when "Custom" is selected with a small delay for stable positioning
    useEffect(() => {
        if (dateFilter === 'custom') {
            const timer = setTimeout(() => {
                if (customDateRef.current) {
                    customDateRef.current.focus();
                    if (customDateRef.current.showPicker) {
                        try {
                            customDateRef.current.showPicker();
                        } catch (e) {
                            console.log('Picker interaction deferred');
                        }
                    }
                }
            }, 250); // Increased delay to ensure DOM stability
            return () => clearTimeout(timer);
        }
    }, [dateFilter]);

    const getStatusLabel = (status) => {
        const labels = {
    
            'review': 'Theo dõi thêm',
            'interview': 'Phỏng vấn',
            'rejected': 'Từ chối'
        };
        return labels[status.toLowerCase()] || 'Chờ xử lý';
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
                <CompanyNavbar />

                <div className="candidates-page">
                    <div className="section-header intro-y">
                        <h3><span className="icon">👥</span> Quản lý ứng viên</h3>
                        <div className="header-actions">
                            <button className="btn-respond" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{marginRight: '8px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Xuất báo cáo
                            </button>
                        </div>
                    </div>

                    <div className="candidates-container">
                        <div className="candidates-main-content full-width">
                            
                            {/* Fivecore Standard Filter Bar */}
                            <div className="dau-filter-bar intro-y" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                <div className="filter-left" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {/* Lọc Trạng Thái */}
                                    <select 
                                        className="dau-select filter-control"
                                        value={activeTab}
                                        onChange={(e) => setActiveTab(e.target.value)}
                                        style={{ width: '150px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '10px 14px', color: '#64748b', fontSize: '14px' }}
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="pending">Chờ duyệt</option>
                                        <option value="interview">Phỏng vấn</option>
                                        <option value="review">Theo dõi thêm</option>
                                        <option value="rejected">Từ chối</option>
                                    </select>

                                    {/* Chọn vị trí ứng tuyển */}
                                    <select 
                                        className="dau-select filter-control"
                                        value={selectedJobId}
                                        onChange={(e) => setSelectedJobId(e.target.value)}
                                        style={{ width: '180px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '10px 14px', color: '#64748b', fontSize: '14px' }}
                                    >
                                        <option value="all">Tất cả tin tuyển dụng</option>
                                        {jobs.map(job => (
                                            <option key={job.id} value={job.id.toString()}>
                                                {job.title}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Lọc Theo Thời Gian */}
                                    <select 
                                        className="dau-select filter-control"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        style={{ width: '130px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '10px 14px', color: '#64748b', fontSize: '14px' }}
                                    >
                                        <option value="all">Mọi thời gian</option>
                                        <option value="15m">15 phút qua</option>
                                        <option value="1d">1 ngày qua</option>
                                        <option value="7d">7 ngày qua</option>
                                        <option value="30d">30 ngày qua</option>
                                        <option value="custom">Tùy chọn...</option>
                                    </select>

                                    {/* MỤC SẮP XẾP RIÊNG BIỆT - Đồng bộ màu sắc */}
                                    <div className="sort-section" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', height: '42px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 6h18M6 12h12m-9 6h6"></path></svg>
                                            <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sắp xếp</span>
                                        </div>
                                        <select 
                                            className="dau-select filter-control"
                                            value={`${sortConfig.key}-${sortConfig.direction}`}
                                            onChange={(e) => {
                                                const [key, direction] = e.target.value.split('-');
                                                setSortConfig({ key, direction });
                                            }}
                                            style={{ minWidth: '120px', border: 'none', background: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: '500', cursor: 'pointer', outline: 'none', paddingRight: '4px' }}
                                        >
                                            <option value="matchPercentage-desc">Phù hợp nhất ↑</option>
                                            <option value="appliedAt-desc">Mới nhất ↑</option>
                                            <option value="appliedAt-asc">Cũ nhất ↓</option>
                                            <option value="studentName-asc">Tên (A-Z)</option>
                                            <option value="studentName-desc">Tên (Z-A)</option>
                                            <option value="jobTitle-asc">Vị trí (A-Z)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="filter-right" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    {dateFilter === 'custom' && (
                                        <div className="date-picker-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input 
                                                ref={customDateRef}
                                                type="date" 
                                                className="dau-input filter-control"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                style={{ width: '150px', borderRadius: '8px', border: '2px solid #6366f1', padding: '8px 12px', fontSize: '13px' }}
                                            />
                                        </div>
                                    )}
                                    <div className="search-input-wrapper" style={{ position: 'relative' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Tìm ứng viên..." 
                                            className="filter-control dau-search-pill"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ width: '220px', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '10px 16px 10px 42px', fontSize: '14px', background: '#fff' }}
                                        />
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="#94a3b8" strokeWidth="2" fill="none" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Standard DAU Table */}
                            <div className="dau-table-container intro-y delay-1">
                                <div className="candidates-list-card" style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                    <table className="candidates-table dau-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                            <tr>
                                                <th 
                                                    style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase', cursor: 'pointer' }}
                                                    onClick={() => requestSort('studentName')}
                                                >
                                                    ỨNG VIÊN {getSortIcon('studentName')}
                                                </th>
                                                <th 
                                                    style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase', cursor: 'pointer' }}
                                                    onClick={() => requestSort('jobTitle')}
                                                >
                                                    VỊ TRÍ ỨNG TUYỂN {getSortIcon('jobTitle')}
                                                </th>
                                                <th 
                                                    style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase', cursor: 'pointer' }}
                                                    onClick={() => requestSort('appliedAt')}
                                                >
                                                    NGÀY NỘP {getSortIcon('appliedAt')}
                                                </th>
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
                                                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                {(() => {
                                                                    const m = app.studentMajor || app.major || app.majorName || app.student?.major || app.student?.majorName || app.major?.name || app.studentMajor?.name || app.major_name;
                                                                    if (m) return typeof m === 'string' ? m : (m.name || 'Chuyên ngành');
                                                                    return 'Chuyên ngành chưa cập nhật';
                                                                })()}
                                                                {app.enhancedMatch && (
                                                                    <span 
                                                                        title={`Phân tích: Kỹ năng (+${app.matchBreakdown?.skills || 0}), Kinh nghiệm (+${app.matchBreakdown?.experience || 0}), Học vấn (+${app.matchBreakdown?.major || 0}), Địa điểm (+${app.matchBreakdown?.location || 0}), Dự án (+${app.matchBreakdown?.projectBonus || 0})`}
                                                                        style={{ 
                                                                            background: app.enhancedMatch >= 80 ? '#f0fdf4' : app.enhancedMatch >= 60 ? '#fffbeb' : '#fef2f2', 
                                                                            color: app.enhancedMatch >= 80 ? '#16a34a' : app.enhancedMatch >= 60 ? '#d97706' : '#dc2626',
                                                                            padding: '2px 8px',
                                                                            borderRadius: '12px',
                                                                            fontSize: '11px',
                                                                            fontWeight: '700',
                                                                            border: `1px solid ${app.enhancedMatch >= 80 ? '#dcfce7' : app.enhancedMatch >= 60 ? '#fef3c7' : '#fee2e2'}`,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px',
                                                                            cursor: 'help'
                                                                        }}
                                                                    >
                                                                        <span style={{ 
                                                                            width: '6px', 
                                                                            height: '6px', 
                                                                            borderRadius: '50%', 
                                                                            backgroundColor: 'currentColor' 
                                                                        }}></span>
                                                                        {app.enhancedMatch}% {app.enhancedMatch >= 80 ? 'RẤT PHÙ HỢP' : app.enhancedMatch >= 60 ? 'PHÙ HỢP' : 'ÍT PHÙ HỢP'}
                                                                    </span>
                                                                )}
                                                            </div>
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
                                                        color: app.status === 'pending' ? '#ea580c' : app.status === 'review' ? '#7c3aed' : app.status === 'rejected' ? '#dc2626' : app.status === 'interview' ? '#2563eb' : '#64748b', 
                                                        fontSize: '14px', fontWeight: '600',
                                                        background: app.status === 'pending' ? '#fff7ed' : app.status === 'review' ? '#f5f3ff' : app.status === 'rejected' ? '#fef2f2' : '#eff6ff',
                                                        padding: '4px 10px',
                                                        borderRadius: '20px'
                                                    }}>
                                                        {app.status === 'pending' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                                                        {app.status === 'review' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
                                                        {app.status === 'rejected' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>}
                                                        {app.status === 'interview' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                                                        {getStatusLabel(app.status)}
                                                    </span>
                                                </td>

                                                {/* Cột 5: Hành động */}
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <button 
                                                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', height: '32px', padding: '0 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}
                                                            onClick={() => handleOpenModal(app)}
                                                        >
                                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                            Chi tiết
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
                jobTitle={selectedApp?.jobTitle}
                jobType={selectedApp?.jobType}
                jobLocation={selectedApp?.jobLocation}
                appliedAt={selectedApp?.appliedAt}
                coverLetter={selectedApp?.coverLetter}
                cvFileName={selectedApp?.cvFileName}
                cvUrl={selectedApp?.cvUrl}
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
