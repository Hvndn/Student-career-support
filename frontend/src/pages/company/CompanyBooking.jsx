import React, { useState, useEffect } from 'react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { recruitmentApi, companyApi } from '../../api';
import toast from 'react-hot-toast';
import CreateBookingModal from '../../components/company/CreateBookingModal';
import StudentProfileModal from '../../components/company/StudentProfileModal';
import InterviewEvaluationModal from '../../components/company/InterviewEvaluationModal';
import InterviewDetailModal from '../../components/company/InterviewDetailModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import '../../assets/css/company/CompanyBooking.css';

const CompanyBooking = () => {
    const [interviews, setInterviews] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobFilter, setJobFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('oldest');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'danger'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [interviewsRes, jobsRes] = await Promise.all([
                recruitmentApi.getInterviews(),
                companyApi.getJobs()
            ]);
            
            if (interviewsRes.data.status === 'success') {
                setInterviews(interviewsRes.data.data || []);
            }
            if (jobsRes.data.status === 'success') {
                setJobs(jobsRes.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCancelInterview = async (interview) => {
        if (!interview?.id) {
            toast.error('Không tìm thấy mã lịch hẹn');
            return;
        }

        if (interview.status === 'completed') {
            toast.error('Không thể hủy lịch phỏng vấn đã hoàn thành');
            return;
        }

        setConfirmModal({
            show: true,
            title: 'Hủy lịch phỏng vấn',
            message: 'Bạn có chắc chắn muốn HỦY lịch phỏng vấn này? Hành động này sẽ thông báo tới ứng viên.',
            type: 'danger',
            onConfirm: async () => {
                try {
                    const response = await recruitmentApi.deleteInterview(interview.id);
                    if (response.data.status === 'success') {
                        toast.success('Đã hủy lịch phỏng vấn thành công');
                        setConfirmModal(prev => ({ ...prev, show: false }));
                        fetchData();
                    }
                } catch (error) {
                    console.error('Lỗi khi hủy lịch:', error);
                    toast.error('Không thể hủy lịch hẹn. Vui lòng thử lại sau.');
                }
            }
        });
    };

    const handleEditInterview = (interview) => {
        setSelectedInterview(interview);
        setIsModalOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedInterview(null);
        setIsModalOpen(true);
    };

    const handleViewDetail = (interview) => {
        setSelectedInterview(interview);
        setShowDetail(true);
    };

    const handleViewProfile = async (studentId) => {
        if (!studentId) {
            toast.error('Ứng viên này chưa có tài khoản sinh viên trên hệ thống');
            return;
        }
        
        try {
            const response = await recruitmentApi.getCandidateDetail(studentId);
            setSelectedCandidate(response.data.data);
            setShowProfile(true);
        } catch (error) {
            console.error('Lỗi khi tải hồ sơ:', error);
        }
    };

    const handleEvaluate = (interview) => {
        setSelectedInterview(interview);
        setShowEvaluation(true);
    };

    const handleUpdateStatus = async (interview, status) => {
        if (status === 'no_show') {
            setConfirmModal({
                show: true,
                title: 'Đánh dấu Vắng mặt',
                message: 'Xác nhận ứng viên này KHÔNG ĐẾN phỏng vấn? Trạng thái sẽ được cập nhật để lưu trữ lịch sử.',
                type: 'warning',
                onConfirm: async () => {
                    await executeUpdateStatus(interview.id, status);
                    setConfirmModal(prev => ({ ...prev, show: false }));
                }
            });
            return;
        }

        await executeUpdateStatus(interview.id, status);
    };

    const executeUpdateStatus = async (id, status) => {
        try {
            const response = await recruitmentApi.updateInterviewStatus(id, status);
            if (response.data.status === 'success') {
                toast.success(`Đã cập nhật trạng thái: ${status.toUpperCase()}`);
                fetchData();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
        }
    };

    const getScoreClass = (score) => {
        if (!score) return '';
        if (score >= 8) return 'score-high';
        if (score >= 5) return 'score-medium';
        return 'score-low';
    };

    const formatDate = (dateString) => {
        if (!dateString) return { day: '--', month: '--', year: '----', time: '--:--' };
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('vi-VN', { month: 'short' }),
            year: date.getFullYear(),
            time: date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('vi-VN')
        };
    };

    const filteredInterviews = interviews
        .filter(item => {
            const studentName = (item.studentName || '').toLowerCase();
            const jobTitle = (item.jobTitle || '').toLowerCase();
            const status = (item.status || '').trim().toLowerCase();
            const filterSearch = searchTerm.toLowerCase().trim();
            const filterStatus = statusFilter.toLowerCase().trim();
            const filterJob = jobFilter.toLowerCase().trim();

            const matchesSearch = studentName.includes(filterSearch) || jobTitle.includes(filterSearch);
            const matchesStatus = statusFilter === 'all' || status === filterStatus;
            const matchesJob = jobFilter === 'all' || jobTitle === filterJob;
            
            // Console log to help debug filtering issues
            if (filterSearch || statusFilter !== 'all' || jobFilter !== 'all') {
                console.log(`Filtering item: ${item.studentName}, Status: ${status}, Target: ${filterStatus}, Match: ${matchesStatus}`);
            }

            return matchesSearch && matchesStatus && matchesJob;
        })
        .sort((a, b) => {
            if (sortOrder === 'newest') return b.id - a.id;
            if (sortOrder === 'oldest') return a.id - b.id;
            if (sortOrder === 'dateAsc') return new Date(a.interviewDate) - new Date(b.interviewDate);
            if (sortOrder === 'dateDesc') return new Date(b.interviewDate) - new Date(a.interviewDate);
            return 0;
        });

    if (loading) return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang tải lịch phỏng vấn...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyNavbar activeTab="Đặt lịch phỏng vấn" />

                <div className="booking-page">
                    <div className="section-header intro-y">
                        <div className="header-title-group">
                            <h3><span className="icon">📅</span> Lịch phỏng vấn</h3>
                            <p className="subtitle">Quản lý và theo dõi các buổi hẹn phỏng vấn với ứng viên.</p>
                        </div>
                        <div className="header-actions">
                            <button 
                                className="btn-respond primary"
                                onClick={handleCreateNew}
                            >
                                <span className="material-symbols-outlined">add</span>
                                Tạo lịch mới
                            </button>
                        </div>
                    </div>

                    <div className="booking-container">
                        <div className="filter-panel glass intro-y delay-1">
                            <div className="filter-group">
                                <label>Tìm kiếm</label>
                                <div className="search-input-wrapper">
                                    <span className="material-symbols-outlined">search</span>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm ứng viên, vị trí..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="filter-group">
                                <label>Trạng thái</label>
                                <select 
                                    className="filter-control"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="scheduled">Sắp diễn ra</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                    <option value="no_show">No-show (Ứng viên vắng)</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Theo công việc</label>
                                <select 
                                    className="filter-control"
                                    value={jobFilter}
                                    onChange={(e) => setJobFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả công việc</option>
                                    {jobs.map(job => (
                                        <option key={job.id} value={job.title}>{job.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Sắp xếp</label>
                                <select 
                                    className="filter-control"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="oldest">Cũ nhất (Ngày tạo)</option>
                                    <option value="newest">Mới nhất (Ngày tạo)</option>
                                    <option value="dateAsc">Sắp diễn ra nhất</option>
                                    <option value="dateDesc">Xa nhất (Ngày hẹn)</option>
                                </select>
                            </div>
                        </div>

                        <div className="booking-list">
                            {filteredInterviews.length > 0 ? (
                                filteredInterviews.map((interview, idx) => {
                                    const dateInfo = formatDate(interview.interviewDate);
                                    return (
                                        <div 
                                            key={interview.id} 
                                            className="booking-card glass hover-lift intro-y"
                                            style={{ animationDelay: `${(idx + 1) * 0.05}s` }}
                                        >
                                            <div className="booking-date-side">
                                                <div className="date-badge">
                                                    <span className="d-day">{dateInfo.day}</span>
                                                    <span className="d-month">{dateInfo.month}</span>
                                                    <span className="d-year">{dateInfo.year}</span>
                                                </div>
                                                <div className="time-badge">
                                                    <span className="material-symbols-outlined">schedule</span>
                                                    {dateInfo.time}
                                                </div>
                                            </div>

                                            <div className="booking-main-content">
                                                <div className="candidate-info">
                                                    <img 
                                                        src={interview.studentAvatar || `https://ui-avatars.com/api/?name=${interview.studentName}&background=random`} 
                                                        alt={interview.studentName} 
                                                        className="c-avatar"
                                                    />
                                                    <div className="c-text">
                                                        <h4>{interview.studentName}</h4>
                                                        <p className="c-email">{interview.studentEmail}</p>
                                                    </div>
                                                </div>

                                                <div className="interview-details">
                                                    <div className="detail-item job-tag-detail">
                                                        <span className="material-symbols-outlined">work</span>
                                                        <span className="text fw-bold" style={{ color: 'var(--primary-color)' }}>
                                                            {interview.jobTitle}
                                                        </span>
                                                        {interview.stageType && (
                                                            <span className="badge-stage" style={{ 
                                                                marginLeft: '8px', 
                                                                background: '#eff6ff', 
                                                                color: '#2563eb',
                                                                fontWeight: '700',
                                                                textTransform: 'uppercase',
                                                                border: '1px solid #dbeafe'
                                                            }}>
                                                                {interview.stageType}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {interview.interviewFormat === 'Trực tuyến' && interview.meetingLink ? (
                                                        <div className="detail-item">
                                                            <span className="material-symbols-outlined" style={{ color: '#3b82f6' }}>link</span>
                                                            <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="text link-text">
                                                                Link họp Online
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="detail-item">
                                                            <span className="material-symbols-outlined">location_on</span>
                                                            <span className="text">{interview.location || 'Địa điểm chưa xác định'}</span>
                                                        </div>
                                                    )}

                                                    <div className="detail-row-flex" style={{ display: 'flex', gap: '15px' }}>
                                                        <div className="detail-item">
                                                            <span className="material-symbols-outlined">
                                                                {interview.interviewFormat === 'Trực tuyến' ? 'videocam' : 'meeting_room'}
                                                            </span>
                                                            <span className="text">{interview.interviewFormat}</span>
                                                        </div>
                                                        {interview.duration && (
                                                            <div className="detail-item">
                                                                <span className="material-symbols-outlined">timer</span>
                                                                <span className="text">{interview.duration} phút</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="booking-status-side">
                                                <div className="status-group-stack" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                    <span className={`status-pill status-${interview.status.toLowerCase()}`}>
                                                        {interview.status === 'scheduled' ? 'Sắp diễn ra' : 
                                                         interview.status === 'confirmed' ? 'Đã xác nhận' :
                                                         interview.status === 'completed' ? 'Đã hoàn thành' : 
                                                         interview.status === 'cancelled' ? 'Đã hủy' : 
                                                         interview.status === 'no_show' ? 'No-show' :
                                                         interview.status === 'pending' ? 'Chờ xác nhận' : interview.status}
                                                    </span>
                                                    
                                                    {interview.status === 'completed' && interview.result && (
                                                        <span className={`result-badge result-${interview.result.toLowerCase()}`} style={{
                                                            fontSize: '0.75rem',
                                                            fontWeight: 'bold',
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            textTransform: 'uppercase',
                                                            background: interview.result === 'PASS' ? '#dcfce7' : interview.result === 'FAIL' ? '#fee2e2' : '#fef3c7',
                                                            color: interview.result === 'PASS' ? '#166534' : interview.result === 'FAIL' ? '#991b1b' : '#92400e',
                                                            border: `1px solid ${interview.result === 'PASS' ? '#bbf7d0' : interview.result === 'FAIL' ? '#fecaca' : '#fde68a'}`
                                                        }}>
                                                            {interview.result === 'PASS' ? '✅ Pass -> Offer' : 
                                                             interview.result === 'FAIL' ? '❌ Rejected' : '🤔 Consider'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="card-actions-wrapper">
                                                    <div className="action-main-group">
                                                        {/* 1. Xem chi tiết - Luôn ưu tiên */}
                                                        <button className="icon-btn" onClick={() => handleViewDetail(interview)} title="Chi tiết lịch hẹn">
                                                            <span className="material-symbols-outlined">visibility</span>
                                                        </button>

                                                        {/* 2. Chỉnh sửa - Chỉ hiện khi chưa xong/hủy */}
                                                        {['scheduled', 'confirmed'].includes(interview.status) && (
                                                            <button className="icon-btn" onClick={() => handleEditInterview(interview)} title="Chỉnh sửa lịch">
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </button>
                                                        )}

                                                        {/* 3. Thao tác trạng thái theo workflow */}
                                                        {interview.status === 'scheduled' && (
                                                            <button className="icon-btn success" onClick={() => handleUpdateStatus(interview, 'confirmed')} title="Xác nhận tham gia">
                                                                <span className="material-symbols-outlined">check_circle</span>
                                                            </button>
                                                        )}

                                                        {interview.status === 'confirmed' && (
                                                            <>
                                                                <button className="icon-btn evaluate" onClick={() => handleEvaluate(interview)} title="Đánh giá kết quả">
                                                                    <span className="material-symbols-outlined">fact_check</span>
                                                                </button>
                                                                <button className="icon-btn warning" onClick={() => handleUpdateStatus(interview, 'no_show')} title="Đánh dấu ứng viên vắng mặt">
                                                                    <span className="material-symbols-outlined">event_busy</span>
                                                                </button>
                                                            </>
                                                        )}

                                                        {interview.status === 'completed' && (
                                                            <button className="icon-btn evaluate" onClick={() => handleEvaluate(interview)} title="Xem/Sửa đánh giá">
                                                                <span className="material-symbols-outlined">assignment_turned_in</span>
                                                            </button>
                                                        )}

                                                        {/* 4. Điểm đánh giá (nếu có) */}
                                                        {interview.overallScore > 0 && (
                                                            <div className={`score-badge-mini ${getScoreClass(interview.overallScore)}`} title="Điểm đánh giá">
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>analytics</span>
                                                                {interview.overallScore}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 5. Nhóm nguy hiểm (Hủy) - Tách biệt */}
                                                    {['scheduled', 'confirmed'].includes(interview.status) && (
                                                        <div className="action-danger-group">
                                                            <button className="icon-btn cancel" onClick={() => handleCancelInterview(interview)} title="Hủy lịch phỏng vấn">
                                                                <span className="material-symbols-outlined">cancel</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-data-card glass intro-y">
                                    <div className="no-data-icon">📅</div>
                                    <h3>Không tìm thấy lịch hẹn nào</h3>
                                    <p>Hãy thử thay đổi tiêu chí lọc hoặc tạo lịch phỏng vấn mới.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateBookingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                initialData={selectedInterview}
            />

            <InterviewDetailModal 
                isOpen={showDetail}
                onClose={() => setShowDetail(false)}
                interview={selectedInterview}
                onEdit={handleEditInterview}
            />

            <StudentProfileModal 
                show={showProfile}
                candidate={selectedCandidate}
                onClose={() => setShowProfile(false)}
            />

            <InterviewEvaluationModal 
                isOpen={showEvaluation}
                onClose={() => setShowEvaluation(false)}
                onSuccess={fetchData}
                interview={selectedInterview}
            />

            <ConfirmModal 
                show={confirmModal.show}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                confirmText="Xác nhận"
                cancelText="Quay lại"
            />
        </div>
    );
};

export default CompanyBooking;
