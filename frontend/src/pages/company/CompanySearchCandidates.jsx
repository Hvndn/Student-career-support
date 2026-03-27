import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CompanySidebar from '../../components/CompanySidebar';
import CompanyTopbar from '../../components/CompanyTopbar';
import { recruitmentApi, companyApi } from '../../api';
import '../../assets/css/CompanySearchCandidates.css';

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

    useEffect(() => {
        // Kiểm tra quyền đăng nhập doanh nghiệp (Thần quân sư gia cố thêm tại đây)
        if (!user || user.role !== 'ROLE_COMPANY') {
            navigate('/login');
            return;
        }
        fetchCandidates();
        fetchSavedCandidates();
    }, [user, navigate]);

    const handleSearch = () => {
        const params = {};
        if (searchParams.query) params.query = searchParams.query;
        if (searchParams.location !== 'Toàn quốc') params.location = searchParams.location;
        if (searchParams.skill) params.skill = searchParams.skill;
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
                toast.success(
                    <div className="toast-content">
                        <span className="toast-title">Đã bỏ lưu</span>
                        <span className="toast-desc">Hồ sơ ứng viên đã được xóa khỏi danh sách.</span>
                    </div>
                );
            } else {
                await companyApi.saveCandidate(studentId);
                const newIds = new Set(savedCandidateIds);
                newIds.add(studentId);
                setSavedCandidateIds(newIds);
                toast.success(
                    <div className="toast-content">
                        <span className="toast-title">Lưu thành công</span>
                        <span className="toast-desc">Hồ sơ ứng viên đã được lưu vào hệ thống.</span>
                    </div>
                );
            }
        } catch (error) {
            console.error("Lỗi khi xử lý lưu ứng viên:", error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    const getLatestExperience = (candidate) => {
        if (!candidate.experiences || candidate.experiences.length === 0) return 'Sinh viên mới tốt nghiệp';
        const latest = candidate.experiences[0];
        return `${latest.jobTitle} tại ${latest.companyName}`;
    };

    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyTopbar title="Ứng viên" />
                <main className="cd-main">
                    <div className="search-candidates-page">
                        {/* Search Tabs */}
                        <div className="search-nav-tabs">
                            <div className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                                Tìm ứng viên mới
                            </div>
                            <div className={`nav-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
                                Gợi ý ứng viên bởi AI <span className="beta-tag">Beta</span>
                            </div>
                        </div>

                        {/* Search Bar Panel */}
                        <div className="advanced-search-panel">
                            <div className="search-grid">
                                <div className="search-field main">
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="#94a3b8" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input 
                                        type="text" 
                                        placeholder="Vị trí cần tuyển: ví dụ Designer, Frontend..." 
                                        value={searchParams.query}
                                        onChange={(e) => setSearchParams({...searchParams, query: e.target.value})}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <div className="search-field loc">
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="#94a3b8" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    <select 
                                        value={searchParams.location}
                                        onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                                    >
                                        <option>Toàn quốc</option>
                                        <option>Hà Nội</option>
                                        <option>Hồ Chí Minh</option>
                                        <option>Đà Nẵng</option>
                                    </select>
                                </div>
                                <button className="btn-search-trigger" onClick={handleSearch} disabled={loading}>
                                    {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                                </button>
                                <button className="btn-filter-settings"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg></button>
                            </div>
                        </div>

                        {/* Split View Content */}
                        <div className="candidates-split-view">
                            {/* List Panel */}
                            <div className="candidates-list-sidebar">
                                {loading && <div className="loading-list">Đang triệu hồi hiền tài...</div>}
                                {!loading && candidates.length === 0 && <div className="empty-list">Không tìm thấy ứng viên phù hợp</div>}
                                {candidates.map(candidate => (
                                    <div 
                                        key={candidate.id} 
                                        className={`candidate-card-sm ${selectedCandidate?.id === candidate.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCandidate(candidate)}
                                    >
                                        <img src={candidate.avatarUrl || 'https://i.pravatar.cc/150'} alt={candidate.fullName} className="card-avatar" />
                                        <div className="card-details">
                                            <h4 className="card-name">{candidate.fullName}</h4>
                                            <p className="card-pos">{candidate.major}</p>
                                            <div className="card-meta">
                                                <span>{candidate.university}</span>
                                                {candidate.location && <span className="dot-sep">•</span>}
                                                <span>{candidate.location}</span>
                                            </div>
                                            <span className="card-time">{getLatestExperience(candidate)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Detail Panel */}
                            <div className="candidate-detail-preview">
                                {selectedCandidate ? (
                                    <div className="preview-content">
                                        <div className="preview-header">
                                            <div className="user-main">
                                                <img src={selectedCandidate.avatarUrl || 'https://i.pravatar.cc/150'} alt={selectedCandidate.fullName} className="large-avatar" />
                                                <div>
                                                    <h3>{selectedCandidate.fullName}</h3>
                                                    <p className="large-pos">{selectedCandidate.major} {selectedCandidate.location && `• ${selectedCandidate.location}`}</p>
                                                </div>
                                            </div>
                                            <button 
                                                className={`btn-contact-info ${savedCandidateIds.has(selectedCandidate.id) ? 'saved' : ''}`} 
                                                onClick={handleSaveCandidate}
                                                disabled={saving}
                                            >
                                                {saving ? 'Đang xử lý...' : (savedCandidateIds.has(selectedCandidate.id) ? 'Đã lưu hồ sơ' : 'Lưu thông tin liên hệ')}
                                            </button>
                                        </div>
                                        <hr className="divider" />
                                        <div className="preview-body">
                                            <div className="info-section">
                                                <h5 className="section-title">Thông tin học vấn</h5>
                                                <p className="section-text">{selectedCandidate.university} - Chuyên ngành {selectedCandidate.major}</p>
                                                {selectedCandidate.educations && selectedCandidate.educations.map(ed => (
                                                    <p key={ed.id} className="detail-item small-text">
                                                        • {ed.schoolName}: {ed.degree} ({ed.startDate} - {ed.endDate || 'Hiện tại'})
                                                    </p>
                                                ))}
                                            </div>
                                            <div className="info-section">
                                                <h5 className="section-title">Kinh nghiệm làm việc</h5>
                                                {selectedCandidate.experiences && selectedCandidate.experiences.length > 0 ? (
                                                    selectedCandidate.experiences.map(ex => (
                                                        <div key={ex.id} className="exp-item">
                                                            <p className="section-text strong">{ex.jobTitle} tại {ex.companyName}</p>
                                                            <p className="small-text">{ex.startDate} - {ex.endDate || 'Hiện tại'}</p>
                                                            <p className="section-text">{ex.description}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="section-text">Chưa có kinh nghiệm làm việc chính thức.</p>
                                                )}
                                            </div>
                                            {selectedCandidate.projects && selectedCandidate.projects.length > 0 && (
                                                <div className="info-section">
                                                    <h5 className="section-title">Dự án tiêu biểu</h5>
                                                    <div className="project-grid-preview">
                                                        {selectedCandidate.projects.map(pj => (
                                                            <div key={pj.id} className="project-item-preview">
                                                                <p className="section-text strong">{pj.name}</p>
                                                                <p className="section-text small-text">{pj.description}</p>
                                                                <div className="project-links">
                                                                    {pj.repositoryUrl && <a href={pj.repositoryUrl} target="_blank" rel="noreferrer" className="pj-link">GitHub</a>}
                                                                    {pj.demoUrl && <a href={pj.demoUrl} target="_blank" rel="noreferrer" className="pj-link">Demo</a>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="info-section">
                                                <h5 className="section-title">Kỹ năng</h5>
                                                <div className="tag-cloud">
                                                    {selectedCandidate.skills && selectedCandidate.skills.map(sk => (
                                                        <span key={sk.name} className="info-tag">{sk.name} - {sk.level}</span>
                                                    ))}
                                                    {(!selectedCandidate.skills || selectedCandidate.skills.length === 0) && (
                                                        <span className="small-text">Chưa cập nhật kỹ năng.</span>
                                                    )}
                                                </div>
                                            </div>
                                            {selectedCandidate.bio && (
                                                <div className="info-section">
                                                    <h5 className="section-title">Giới thiệu bản thân</h5>
                                                    <p className="section-text">{selectedCandidate.bio}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="no-selection">
                                        <div className="empty-state">
                                            <svg viewBox="0 0 24 24" width="60" height="60" stroke="#cbd5e1" strokeWidth="1.5" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
                                            <p>Vui lòng chọn một ứng viên trong danh sách để xem chi tiết hồ sơ</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanySearchCandidates;
