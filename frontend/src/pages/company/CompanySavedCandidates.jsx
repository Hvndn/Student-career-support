import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CompanySidebar from '../../components/CompanySidebar';
import CompanyTopbar from '../../components/CompanyTopbar';
import ConfirmModal from '../../components/ConfirmModal';
import CandidateDetailModal from '../../components/CandidateDetailModal';
import { companyApi } from '../../api';
import '../../assets/css/CompanySavedCandidates.css';

const CompanySavedCandidates = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [savedCandidates, setSavedCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

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

    const handleViewCV = (studentId) => {
        setSelectedStudentId(studentId);
        setShowDetailModal(true);
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
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             c.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUni = universityFilter === '' || c.university === universityFilter;
        const matchesPos = positionFilter === '' || c.position === positionFilter;
        
        // Time filter logic
        let matchesTime = true;
        if (timeFilter !== 'all') {
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
        }

        return matchesSearch && matchesUni && matchesPos && matchesTime;
    });

    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyTopbar title="Ứng viên" />
                <main className="cd-main">
                    <div className="saved-candidates-page">
                        <div className="header-flex">
                            <h2 className="title-with-count">Hồ sơ đã lưu ({filteredCandidates.length})</h2>
                        </div>

                        <div className="policy-banner">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#f59e0b" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span>Hệ thống chỉ lưu trữ hồ sơ tối đa 12 tháng kể từ ngày lưu. Sau thời gian này hồ sơ sẽ tự động bị xóa để đảm bảo hiệu quả tuyển dụng.</span>
                        </div>

                        <div className="filter-panel glass">
                            <div className="filter-grid">
                                <div className="filter-item search">
                                    <label>Tìm kiếm hồ sơ</label>
                                    <div className="search-input-wrapper">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        <input 
                                            type="text" 
                                            placeholder="Nhập tên ứng viên..." 
                                            className="filter-control"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="filter-item">
                                    <label>Trường đại học</label>
                                    <select 
                                        className="filter-control select"
                                        value={universityFilter}
                                        onChange={(e) => setUniversityFilter(e.target.value)}
                                    >
                                        <option value="">Tất cả các trường</option>
                                        {[...new Set(savedCandidates.map(c => c.university))].filter(Boolean).map(uni => (
                                            <option key={uni} value={uni}>{uni}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label>Lĩnh vực chuyên môn</label>
                                    <select 
                                        className="filter-control select"
                                        value={positionFilter}
                                        onChange={(e) => setPositionFilter(e.target.value)}
                                    >
                                        <option value="">Tất cả lĩnh vực</option>
                                        {[...new Set(savedCandidates.map(c => c.position))].filter(Boolean).map(pos => (
                                            <option key={pos} value={pos}>{pos}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label>Thời gian lưu</label>
                                    <select 
                                        className="filter-control select"
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                    >
                                        <option value="all">Tất cả thời gian</option>
                                        <option value="15m">15 phút qua</option>
                                        <option value="30m">30 phút qua</option>
                                        <option value="60m">60 phút qua</option>
                                        <option value="24h">24 giờ qua</option>
                                        <option value="7d">7 ngày qua</option>
                                        <option value="30d">30 ngày qua</option>
                                        <option value="3m">3 tháng qua</option>
                                        <option value="6m">6 tháng qua</option>
                                        <option value="older">Hồ sơ cũ hơn</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="saved-list-card glass">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                </div>
                            ) : filteredCandidates.length === 0 ? (
                                <div className="empty-state">Chưa có hồ sơ ứng viên nào được lưu.</div>
                            ) : (
                                <table className="saved-table">
                                    <thead>
                                        <tr>
                                            <th>Ứng viên</th>
                                            <th>Tình trạng</th>
                                            <th>Thời gian lưu</th>
                                            <th>Lĩnh vực chuyển môn</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCandidates.map(candidate => (
                                            <tr key={candidate.id}>
                                                <td>
                                                    <div className="user-profile">
                                                        <img src={candidate.avatar || 'https://i.pravatar.cc/150'} alt={candidate.name} className="user-avatar" />
                                                        <div className="user-info">
                                                            <span className="user-name">{candidate.name}</span>
                                                            <span className="user-pos">{candidate.university}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="status-badge">Đã lưu</span></td>
                                                <td>{formatSavedTime(candidate.savedDate)}</td>
                                                <td><span className="recruit-status pending">{candidate.position}</span></td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button 
                                                            className="btn-icon" 
                                                            title="Xem chi tiết"
                                                            onClick={() => handleViewCV(candidate.studentId)}
                                                        >
                                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                        </button>
                                                        <button 
                                                            className="btn-icon delete" 
                                                            title="Xóa"
                                                            onClick={() => handleDeleteClick(candidate.studentId)}
                                                        >
                                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

            <CandidateDetailModal 
                show={showDetailModal}
                studentId={selectedStudentId}
                onClose={() => setShowDetailModal(false)}
            />
        </div>
    );
};

export default CompanySavedCandidates;
