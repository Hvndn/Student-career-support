import React, { useState, useEffect } from 'react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { recruitmentApi, companyApi } from '../../api';
import toast from 'react-hot-toast';
import CreateBookingModal from '../../components/company/CreateBookingModal';
import InterviewDetailModal from '../../components/company/InterviewDetailModal';
import StudentProfileModal from '../../components/company/StudentProfileModal';
import '../../assets/css/company/CompanyBooking.css';

const CompanyBooking = () => {
    const [interviews, setInterviews] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobFilter, setJobFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);

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

    const handleDeleteInterview = async (id) => {
        if (!id) {
            toast.error('Không tìm thấy mã lịch hẹn');
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN lịch phỏng vấn này?')) return;

        try {
            const response = await recruitmentApi.deleteInterview(id);
            if (response.data.status === 'success') {
                toast.success('Đã xóa lịch phỏng vấn thành công');
                fetchData();
            }
        } catch (error) {
            console.error('Lỗi khi xóa lịch:', error);
            toast.error('Không thể xóa lịch hẹn. Vui lòng thử lại sau.');
        }
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
        const matchesJob = jobFilter === 'all' || item.jobTitle === jobFilter;
        return matchesSearch && matchesStatus && matchesJob;
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
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
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
                                                        <span className="text fw-bold" style={{ color: 'var(--primary-color)' }}>{interview.jobTitle}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="material-symbols-outlined">location_on</span>
                                                        <span className="text">{interview.location || 'Địa điểm chưa xác định'}</span>
                                                    </div>
                                                    {interview.interviewFormat && (
                                                        <div className="detail-item">
                                                            <span className="material-symbols-outlined">
                                                                {interview.interviewFormat === 'Trực tuyến' ? 'videocam' : 'meeting_room'}
                                                            </span>
                                                            <span className="text">{interview.interviewFormat}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="booking-status-side">
                                                <span className={`status-pill status-${interview.status.toLowerCase()}`}>
                                                    {interview.status === 'scheduled' ? 'Sắp diễn ra' : 
                                                     interview.status === 'completed' ? 'Hoàn thành' : 
                                                     interview.status === 'cancelled' ? 'Đã hủy' : interview.status}
                                                </span>
                                                <div className="card-actions">
                                                    <button className="icon-btn" onClick={() => handleViewDetail(interview)} title="Chi tiết lịch hẹn">
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </button>
                                                    <button className="icon-btn" onClick={() => handleEditInterview(interview)} title="Sửa">
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button className="icon-btn delete" onClick={() => handleDeleteInterview(interview.id)} title="Xóa">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
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
        </div>
    );
};

export default CompanyBooking;
