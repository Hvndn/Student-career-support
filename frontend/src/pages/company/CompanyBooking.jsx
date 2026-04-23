import React, { useState, useEffect } from 'react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { recruitmentApi } from '../../api';
import toast from 'react-hot-toast';
import CreateBookingModal from '../../components/company/CreateBookingModal';
import StudentProfileModal from '../../components/company/StudentProfileModal';
import '../../assets/css/company/CompanyBooking.css';

const CompanyBooking = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const response = await recruitmentApi.getInterviews();
            if (response.data.status === 'success') {
                setInterviews(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Không thể tải danh sách lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const handleCancelInterview = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy lịch phỏng vấn này?')) return;

        try {
            await recruitmentApi.cancelInterview(id);
            toast.success('Đã hủy lịch phỏng vấn');
            fetchInterviews();
        } catch (error) {
            console.error('Lỗi khi hủy lịch:', error);
        }
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

    const filteredInterviews = interviews.filter(item => {
        const matchesSearch = 
            item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
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
                <CompanyNavbar activeTab="Đặt lịch làm việc" />

                <div className="booking-page">
                    <div className="section-header intro-y">
                        <div className="header-title-group">
                            <h3><span className="icon">📅</span> Lịch phỏng vấn</h3>
                            <p className="subtitle">Quản lý và theo dõi các buổi hẹn phỏng vấn với ứng viên.</p>
                        </div>
                        <div className="header-actions">
                            <button 
                                className="btn-respond primary"
                                onClick={() => setIsModalOpen(true)}
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
                                    <option value="scheduled">Đã lên lịch</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
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
                                            className="booking-card glass intro-y hover-lift"
                                            style={{ animationDelay: `${(idx + 2) * 0.1}s` }}
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
                                                        <p className="c-job">Ứng tuyển: <strong>{interview.jobTitle}</strong></p>
                                                    </div>
                                                </div>

                                                <div className="interview-details">
                                                    <div className="detail-item">
                                                        <span className="material-symbols-outlined">location_on</span>
                                                        <span className="text">{interview.location || 'Địa điểm chưa xác định'}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="material-symbols-outlined">mail</span>
                                                        <span className="text">{interview.studentEmail}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="booking-status-side">
                                                <span className={`status-pill status-${interview.status.toLowerCase()}`}>
                                                    {interview.status === 'scheduled' ? 'Sắp diễn ra' : 
                                                     interview.status === 'completed' ? 'Hoàn thành' : 
                                                     interview.status === 'cancelled' ? 'Đã hủy' : interview.status}
                                                </span>
                                                <div className="card-actions">
                                                    <button 
                                                        className="icon-btn" 
                                                        title="Xem chi tiết"
                                                        onClick={() => handleViewProfile(interview.studentId)}
                                                    >
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </button>
                                                    <button 
                                                        className="icon-btn delete" 
                                                        title="Hủy lịch"
                                                        onClick={() => handleCancelInterview(interview.id)}
                                                    >
                                                        <span className="material-symbols-outlined">close</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-data-card glass">
                                    <div className="no-data-icon">📅</div>
                                    <h3>Chưa có lịch hẹn nào</h3>
                                    <p>Các buổi phỏng vấn bạn đã lên lịch sẽ xuất hiện tại đây.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateBookingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchInterviews}
            />

            <StudentProfileModal 
                show={showProfile}
                candidate={selectedCandidate}
                onClose={() => setShowProfile(false)}
            />
        </div>
    );
};

export default CompanyBooking;
