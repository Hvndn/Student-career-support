import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import ConfirmModal from '../../components/common/ConfirmModal';
import StudentProfileModal from '../../components/company/StudentProfileModal';
import { companyApi } from '../../api';
import '../../assets/css/company/CompanySavedCandidates.css';

const CompanySavedCandidates = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [savedCandidates, setSavedCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Filter states
    const [universityFilter, setUniversityFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');

    const fetchSavedCandidates = async () => {
        setLoading(true);
        try {
            const { data } = await companyApi.getSavedCandidates();
            setSavedCandidates(data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ứng viên đã lưu:", error);
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (!user || user.role !== 'ROLE_COMPANY') {
            navigate('/login');
            return;
        }
        fetchSavedCandidates();
    }, [user, navigate]);

    const handleDeleteClick = (studentId) => {
        setCandidateToDelete(studentId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!candidateToDelete) return;
        
        try {
            await companyApi.unsaveCandidate(candidateToDelete);
            setSavedCandidates(savedCandidates.filter(c => c.studentId !== candidateToDelete));
            toast.success("Đã gỡ ứng viên khỏi danh sách lưu");
        } catch (error) {
            console.error("Lỗi khi xóa ứng viên:", error);
            toast.error("Không thể xóa. Vui lòng thử lại.");
        } finally {
            setShowDeleteModal(false);
            setCandidateToDelete(null);
        }
    };

    const handleViewCV = async (studentId) => {
        try {
            setLoading(true);
            const res = await companyApi.getCandidateDetail(studentId);
            if (res.data.status === 'success') {
                setSelectedCandidate(res.data.data);
                setShowDetailModal(true);
            } else {
                toast.error("Không thể lấy thông tin chi tiết ứng viên");
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết:", error);
            toast.error("Lỗi khi lấy thông tin chi tiết ứng viên");
        } finally {
            setLoading(false);
        }
    };

    const formatSavedTime = (dateString) => {
        if (!dateString) return 'Đang cập nhật...';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';

        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const filteredCandidates = savedCandidates.filter(c => {
        const name = c.name || '';
        const position = c.position || '';
        const university = c.university || '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUni = universityFilter === '' || university === universityFilter;
        const matchesPos = positionFilter === '' || position === positionFilter;
        
        // Time filter logic
        let matchesTime = true;
        if (timeFilter !== 'all' && c.savedDate) {
            const savedDate = new Date(c.savedDate);
            const now = new Date();
            const diffMs = now - savedDate;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (timeFilter === '15m') matchesTime = diffMins <= 15;
            else if (timeFilter === '30m') matchesTime = diffMins <= 30;
            else if (timeFilter === '60m') matchesTime = diffMins <= 60;
            else if (timeFilter === '24h') matchesTime = diffDays <= 1;
            else if (timeFilter === '7d') matchesTime = diffDays <= 7;
            else if (timeFilter === '30d') matchesTime = diffDays <= 30;
            else if (timeFilter === '3m') matchesTime = diffDays <= 90;
            else if (timeFilter === '6m') matchesTime = diffDays <= 180;
            else if (timeFilter === 'older') matchesTime = diffDays > 180;
        } else if (timeFilter !== 'all' && !c.savedDate) {
            matchesTime = false; // Nếu có lọc theo thời gian mà hồ sơ không có ngày lưu thì ẩn đi
        }

        return matchesSearch && matchesUni && matchesPos && matchesTime;
    });

    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyNavbar title="Ứng viên" />
                <main className="cd-main">
                    <div className="saved-candidates-page">
                        <div className="header-flex">
                            <h2 className="title-with-count intro-y">Hồ sơ đã lưu ({filteredCandidates.length})</h2>
                        </div>

                        <div className="policy-banner intro-y" style={{ animationDelay: '0.1s' }}>
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span>Hệ thống chỉ lưu trữ hồ sơ tối đa 12 tháng. Hồ sơ sẽ tự động ẩn sau thời gian này để đảm bảo hiệu suất.</span>
                        </div>

                        {/* Modern Filters */}
                        <div className="filter-panel-premium intro-y" style={{ animationDelay: '0.2s' }}>
                            <div className="filter-group">
                                <label>Tìm kiếm nhanh</label>
                                <div className="premium-input-box">
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input 
                                        type="text" 
                                        placeholder="Tên hoặc vị trí..." 
                                        className="premium-control"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>Trường đại học</label>
                                <select 
                                    className="premium-control select"
                                    value={universityFilter}
                                    onChange={(e) => setUniversityFilter(e.target.value)}
                                >
                                    <option value="">Tất cả các trường</option>
                                    {[...new Set(savedCandidates.map(c => c.university))].filter(Boolean).map(uni => (
                                        <option key={uni} value={uni}>{uni}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Thời gian lưu</label>
                                <select 
                                    className="premium-control select"
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả thời gian</option>
                                    <option value="24h">24 giờ qua</option>
                                    <option value="7d">7 ngày qua</option>
                                    <option value="30d">1 tháng qua</option>
                                    <option value="older">Lâu hơn</option>
                                </select>
                            </div>
                        </div>

                        {/* Candidate Grid */}
                        <div className="candidates-list-area intro-y" style={{ animationDelay: '0.3s' }}>
                            {loading ? (
                                <div className="loading-state-premium">
                                    <div className="premium-spinner"></div>
                                    <p>Đang tải danh sách hồ sơ...</p>
                                </div>
                            ) : filteredCandidates.length === 0 ? (
                                <div className="empty-state-premium">
                                    <p>Chưa có ứng viên nào khớp với tìm kiếm của bạn.</p>
                                </div>
                            ) : (
                                <div className="candidates-grid-premium">
                                    {filteredCandidates.map(candidate => (
                                        <div key={candidate.id} className="candidate-premium-card">
                                            <div className="candidate-card-header">
                                                <div className="avatar-large-box">
                                                    <img src={candidate.avatar || `https://ui-avatars.com/api/?name=${candidate.name}&background=random`} alt={candidate.name} />
                                                </div>
                                                <span className="time-badge">
                                                    {formatSavedTime(candidate.savedDate)}
                                                </span>
                                            </div>

                                            <div className="candidate-card-body">
                                                <h3>{candidate.name}</h3>
                                                <p className="candidate-uni">{candidate.university}</p>
                                                
                                                <div className="candidate-meta-info">
                                                    <div className="meta-item">
                                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                        <span>{candidate.position}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card-actions-row">
                                                <button 
                                                    className="btn-premium-view"
                                                    onClick={() => handleViewCV(candidate.studentId)}
                                                >
                                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                    Xem chi tiết
                                                </button>
                                                <button 
                                                    className="btn-premium-delete"
                                                    title="Gỡ khỏi danh sách"
                                                    onClick={() => handleDeleteClick(candidate.studentId)}
                                                >
                                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <ConfirmModal 
                show={showDeleteModal}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn gỡ ứng viên này khỏi danh sách đã lưu? Hành động này không thể hoàn tác."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            <StudentProfileModal 
                show={showDetailModal}
                candidate={selectedCandidate}
                onClose={() => setShowDetailModal(false)}
            />
        </div>
    );
};

export default CompanySavedCandidates;
