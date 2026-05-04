import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api';
import '../../assets/css/student/Interviews.css';
import toast from 'react-hot-toast';

const Interviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchInterviews = async () => {
        try {
            const response = await studentApi.getInterviews();
            setInterviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Không thể tải lịch phỏng vấn');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xác nhận tham gia buổi phỏng vấn này?')) return;
        
        try {
            await studentApi.confirmInterview(id);
            toast.success('Đã xác nhận tham gia thành công');
            fetchInterviews();
        } catch (error) {
            console.error('Error confirming interview:', error);
            toast.error('Có lỗi xảy ra khi xác nhận lịch phỏng vấn');
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

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
        const companyName = item.companyName || '';
        const jobTitle = item.jobTitle || '';
        const status = (item.status || '').toLowerCase();
        
        const matchesSearch = 
            companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
            
        let matchesStatus = false;
        if (statusFilter === 'all') {
            matchesStatus = true;
        } else if (statusFilter === 'scheduled') {
            matchesStatus = status === 'scheduled';
        } else if (statusFilter === 'confirmed') {
            matchesStatus = status === 'confirmed';
        } else if (statusFilter === 'pending') {
            matchesStatus = status === 'pending';
        } else if (statusFilter === 'completed') {
            matchesStatus = status === 'completed';
        } else if (statusFilter === 'cancelled') {
            matchesStatus = status === 'cancelled';
        }

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="student-interviews-page">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang tải lịch phỏng vấn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-interviews-page">
            <div className="section-header intro-y">
                <div className="header-title-group">
                    <h3><span className="icon">📅</span> Lịch phỏng vấn</h3>
                    <p className="subtitle">Theo dõi và chuẩn bị tốt nhất cho các buổi hẹn phỏng vấn của bạn.</p>
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
                                placeholder="Tìm theo công ty, vị trí..." 
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
                            <option value="pending">Chờ xác nhận</option>
                            <option value="scheduled">Sắp diễn ra</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>

                <div className="booking-list">
                    {filteredInterviews.length > 0 ? (
                        filteredInterviews.map((interview, idx) => {
                            const dateInfo = formatDate(interview.interviewDate);
                            const companyName = interview.companyName || 'Công ty ẩn danh';
                            const companyLogo = interview.companyLogo || `https://ui-avatars.com/api/?name=${companyName}&background=random`;
                            const isOnline = interview.location?.toLowerCase().includes('http') || interview.interviewFormat === 'Trực tuyến';
                            
                            // Map status for better UI display
                            const getStatusDisplay = (status) => {
                                switch(status?.toLowerCase()) {
                                    case 'confirmed':
                                    case 'scheduled':
                                        return { label: 'Sắp diễn ra', class: 'scheduled' };
                                    case 'completed':
                                        return { label: 'Hoàn thành', class: 'completed' };
                                    case 'cancelled':
                                        return { label: 'Đã hủy', class: 'cancelled' };
                                    case 'pending':
                                        return { label: 'Chờ xác nhận', class: 'pending' };
                                    default:
                                        return { label: status || 'Chờ xác nhận', class: 'pending' };
                                }
                            };

                            const statusInfo = getStatusDisplay(interview.status);
                            
                            return (
                                <div 
                                    key={interview.id || idx} 
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
                                                src={companyLogo} 
                                                alt={companyName} 
                                                className="c-avatar"
                                            />
                                            <div className="c-text">
                                                <h4>{companyName}</h4>
                                                <p className="c-job">Vị trí: <strong>{interview.jobTitle || 'Chưa xác định'}</strong></p>
                                                <p className="c-email" style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span>
                                                    {interview.companyEmail || 'Chưa có email'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="interview-details">
                                            <div className="detail-item">
                                                <span className="material-symbols-outlined" style={{ color: isOnline ? '#2563eb' : '#64748b' }}>
                                                    {isOnline ? 'videocam' : 'location_on'}
                                                </span>
                                                <span className="text">
                                                    {isOnline ? (
                                                        <a href={interview.location} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: '600' }}>
                                                            Phòng họp Online
                                                        </a>
                                                    ) : (
                                                        interview.location || 'Địa điểm chưa xác định'
                                                    )}
                                                </span>
                                            </div>
                                            
                                            {interview.interviewerInfo && (
                                                <div className="detail-item">
                                                    <span className="material-symbols-outlined">person</span>
                                                    <span className="text">Interviewer: <strong>{interview.interviewerInfo}</strong></span>
                                                </div>
                                            )}

                                            {interview.preliminaryContent && (
                                                <div className="detail-item">
                                                    <span className="material-symbols-outlined">assignment</span>
                                                    <span className="text">Nội dung: <strong>{interview.preliminaryContent}</strong></span>
                                                </div>
                                            )}

                                            {interview.requiredDocuments && (
                                                <div className="detail-item">
                                                    <span className="material-symbols-outlined">article</span>
                                                    <span className="text">Yêu cầu: <span className="doc-tag">{interview.requiredDocuments}</span></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="booking-status-side">
                                        <span className={`status-pill status-${statusInfo.class}`}>
                                            {statusInfo.label}
                                        </span>
                                        
                                        {interview.status === 'scheduled' && (
                                            <button 
                                                className="btn-confirm-interview"
                                                onClick={() => handleConfirm(interview.id)}
                                            >
                                                <span className="material-symbols-outlined">check_circle</span>
                                                Xác nhận tham gia
                                            </button>
                                        )}

                                        {interview.notes && (
                                            <div className="notes-tooltip-trigger">
                                                <span className="material-symbols-outlined">info</span>
                                                Ghi chú
                                                <div className="notes-tooltip">{interview.notes}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-data-card glass intro-y delay-2">
                            <div className="no-data-icon">📅</div>
                            <h3>Chưa có lịch hẹn nào</h3>
                            <p>Đừng nản lòng! Hãy tiếp tục ứng tuyển vào các vị trí phù hợp để nhận cơ hội phỏng vấn.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Interviews;
