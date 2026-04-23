import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { recruitmentApi, companyApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/company/CompanySearchCandidates.css';

const CompanySearchCandidates = () => {
    const navigate = useNavigate();
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [activeTab, setActiveTab] = useState('search');
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedCandidateIds, setSavedCandidateIds] = useState(new Set());
    const [searchParams, setSearchParams] = useState({
        query: '',
        location: 'Toàn quốc',
        skill: ''
    });

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [aiCandidates, setAiCandidates] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);

    const fetchCandidates = async (params = {}) => {
        setLoading(true);
        try {
            const { data } = await recruitmentApi.searchCandidates(params);
            const list = data.data || [];
            setCandidates(list);
            if (list.length > 0) {
                setSelectedCandidate(list[0]);
            } else {
                setSelectedCandidate(null);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm ứng viên:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedCandidates = async () => {
        try {
            const { data } = await companyApi.getSavedCandidates();
            const ids = new Set((data.data || []).map(s => s.studentId));
            setSavedCandidateIds(ids);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đã lưu:", error);
        }
    };

    const fetchJobs = async () => {
        try {
            const { data } = await companyApi.getJobs();
            if (data.status === 'success') {
                const openJobs = data.data.filter(job => job.status === 'open');
                setJobs(openJobs);
                if (openJobs.length > 0) {
                    setSelectedJobId(openJobs[0].id);
                    fetchAIRecommendations(openJobs[0].id);
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách công việc:", error);
        }
    };

    const fetchAIRecommendations = async (jobId) => {
        if (!jobId) return;
        setLoadingAI(true);
        try {
            const { data } = await recruitmentApi.getRecommendations(jobId);
            if (data.status === 'success') {
                const list = data.data || [];
                setAiCandidates(list);
                if (list.length > 0 && activeTab === 'ai') {
                    setSelectedCandidate(list[0]);
                    fetchCandidateDetail(list[0].id);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gợi ý AI:", error);
        } finally {
            setLoadingAI(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'ROLE_COMPANY') {
            navigate('/login');
            return;
        }
        fetchCandidates();
        fetchSavedCandidates();
        fetchJobs();
    }, [user, navigate]);

    useEffect(() => {
        if (activeTab === 'ai' && aiCandidates.length > 0) {
            setSelectedCandidate(aiCandidates[0]);
            fetchCandidateDetail(aiCandidates[0].id);
        } else if (activeTab === 'search' && candidates.length > 0) {
            setSelectedCandidate(candidates[0]);
            fetchCandidateDetail(candidates[0].id);
        }
    }, [activeTab]);

    const fetchCandidateDetail = async (studentId) => {
        setLoading(true);
        try {
            const { data } = await companyApi.getCandidateDetail(studentId);
            if (data.status === 'success') {
                setSelectedCandidate(data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        fetchCandidateDetail(candidate.id);
    };

    const renderCandidateDetail = () => {
        if (!selectedCandidate) {
            return (
                <div className="no-selection intro-x">
                    <div className="empty-state">
                        <p>Chọn một ứng viên để xem chi tiết hồ sơ</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="preview-content intro-x">
                <div className="preview-header">
                    <div className="user-main">
                        <div className="avatar-wrapper">
                            <img 
                                src={getImageUrl(selectedCandidate.avatarUrl) || `https://ui-avatars.com/api/?name=${selectedCandidate.fullName}&background=random`} 
                                alt="" 
                                className="large-avatar" 
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${selectedCandidate.fullName}&background=random` }}
                            />
                        </div>
                        <div className="user-text">
                            <h3>{selectedCandidate.fullName}</h3>
                            <p className="large-pos">{selectedCandidate.major} {selectedCandidate.location && `• ${selectedCandidate.location}`}</p>
                        </div>
                    </div>
                    <button 
                        className={`btn-contact-info ${savedCandidateIds.has(selectedCandidate.id) ? 'saved' : ''}`} 
                        onClick={handleSaveCandidate}
                        disabled={saving}
                    >
                        {saving ? '...' : (savedCandidateIds.has(selectedCandidate.id) ? 'Đã lưu' : 'Lưu liên hệ')}
                    </button>
                </div>
                
                <hr className="divider" />

                <div className="preview-body thin-scrollbar">
                    <div className="info-section">
                        <h5 className="section-title">Chỉ số năng lực & Liên hệ</h5>
                        <div className="candidate-stats-grid">
                            <div className="stat-card">
                                <span className="stat-label">GPA</span>
                                <span className="stat-value highlight">{selectedCandidate.gpa ? parseFloat(selectedCandidate.gpa).toFixed(2) : 'N/A'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">MSSV</span>
                                <span className="stat-value">{selectedCandidate.studentIdStr || selectedCandidate.studentCode || 'N/A'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Khóa</span>
                                <span className="stat-value">{selectedCandidate.academicYear || 'N/A'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Địa chỉ</span>
                                <span className="stat-value small">{selectedCandidate.address || selectedCandidate.location || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="contact-details-box">
                            <div className="contact-row">
                                <span className="contact-icon">✉</span>
                                <span className="contact-info-text">{selectedCandidate.email || 'Chưa công khai'}</span>
                            </div>
                            <div className="contact-row">
                                <span className="contact-icon">📞</span>
                                <span className="contact-info-text">{selectedCandidate.phone || 'Chưa công khai'}</span>
                            </div>
                        </div>

                        <div className="media-resources-grid">
                            <div className="cv-download-panel">
                                <button className="btn-view-cv" onClick={() => (selectedCandidate.cvData || selectedCandidate.cvUrl) ? window.open(getImageUrl(selectedCandidate.cvData || selectedCandidate.cvUrl), '_blank') : toast.error("Chưa có CV")}>Xem CV</button>
                            </div>
                            {selectedCandidate.videoUrl && (
                                <div className="video-intro-panel">
                                    <button className="btn-play-video" onClick={() => window.open(getImageUrl(selectedCandidate.videoUrl), '_blank')}>Xem Video</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-section">
                        <h5 className="section-title">Giới thiệu bản thân</h5>
                        <div className="section-text bio-content" dangerouslySetInnerHTML={{ __html: selectedCandidate.bio || 'Chưa cập nhật.' }} />
                    </div>

                    <div className="info-section">
                        <h5 className="section-title">Kỹ năng</h5>
                        <div className="tag-cloud">
                            {selectedCandidate.skills?.map((sk, i) => (
                                <span key={i} className="info-tag">
                                    {typeof sk === 'string' ? sk : sk.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleSearch = () => {
        const params = {};
        if (searchParams.query) params.query = searchParams.query;
        if (searchParams.location !== 'Toàn quốc') params.location = searchParams.location;
        fetchCandidates(params);
    };

    const handleSaveCandidate = async () => {
        if (!selectedCandidate || saving) return;
        const studentId = selectedCandidate.id;
        const isSaved = savedCandidateIds.has(studentId);
        setSaving(true);
        try {
            if (isSaved) {
                await companyApi.unsaveCandidate(studentId);
                const newIds = new Set(savedCandidateIds);
                newIds.delete(studentId);
                setSavedCandidateIds(newIds);
                toast.success("Đã bỏ lưu");
            } else {
                await companyApi.saveCandidate(studentId);
                const newIds = new Set(savedCandidateIds);
                newIds.add(studentId);
                setSavedCandidateIds(newIds);
                toast.success("Lưu thành công");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyNavbar />
                <div className="search-candidates-page">
                    <div className="search-nav-tabs">
                        <div className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                            Tìm ứng viên mới
                        </div>
                        <div className={`nav-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
                            Gợi ý ứng viên phù hợp
                        </div>
                    </div>

                    <div className="tab-render-area">
                        {activeTab === 'search' ? (
                            <div className="search-mode-container intro-y">
                                <div className="advanced-search-panel">
                                    <div className="search-grid">
                                        <div className="search-field main">
                                            <input 
                                                type="text" 
                                                placeholder="Vị trí, kỹ năng..." 
                                                value={searchParams.query}
                                                onChange={(e) => setSearchParams({...searchParams, query: e.target.value})}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                        <button className="btn-search-trigger" onClick={handleSearch} disabled={loading}>
                                            Tìm kiếm
                                        </button>
                                    </div>
                                </div>
                                <div className="candidates-split-view">
                                    <div className="candidates-list-sidebar thin-scrollbar">
                                        {candidates.map(candidate => (
                                            <div 
                                                key={candidate.id} 
                                                className={`candidate-card-sm ${selectedCandidate?.id === candidate.id ? 'active' : ''}`}
                                                onClick={() => handleSelectCandidate(candidate)}
                                            >
                                                <img src={getImageUrl(candidate.avatarUrl) || `https://ui-avatars.com/api/?name=${candidate.fullName}&background=random`} alt="" className="card-avatar" />
                                                <div className="card-details">
                                                    <h4 className="card-name">{candidate.fullName}</h4>
                                                    <p className="card-pos">{candidate.major}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="candidate-preview-main thin-scrollbar">
                                        {renderCandidateDetail()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="ai-mode-container intro-y">
                                <div className="ai-controls-panel">
                                    <select 
                                        value={selectedJobId} 
                                        onChange={(e) => {
                                            setSelectedJobId(e.target.value);
                                            fetchAIRecommendations(e.target.value);
                                        }}
                                        className="ai-job-select"
                                    >
                                        <option value="">-- Chọn tin tuyển dụng --</option>
                                        {jobs.map(job => (
                                            <option key={job.id} value={job.id}>{job.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="candidates-split-view">
                                    <div className="candidates-list-sidebar thin-scrollbar ai-list">
                                        {aiCandidates.map(candidate => (
                                            <div 
                                                key={candidate.id} 
                                                className={`candidate-card-sm ai-card ${selectedCandidate?.id === candidate.id ? 'active' : ''}`}
                                                onClick={() => handleSelectCandidate(candidate)}
                                            >
                                                <div className="match-score-pill">
                                                    {Math.round(candidate.matchScore)}% Match
                                                </div>
                                                <img src={getImageUrl(candidate.avatarUrl) || `https://ui-avatars.com/api/?name=${candidate.fullName}&background=random`} alt="" className="card-avatar" />
                                                <div className="card-details">
                                                    <h4 className="card-name">{candidate.fullName}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="candidate-preview-main thin-scrollbar">
                                        {renderCandidateDetail()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanySearchCandidates;
