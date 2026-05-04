import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api';
import '../../assets/css/student/Interviews.css';
import toast from 'react-hot-toast';

const Interviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
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
        const companyName = item.application?.job?.company?.name || '';
        const jobTitle = item.application?.job?.title || '';
        
        const matchesSearch = 
            companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
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
                            <option value="scheduled">Sắp diễn ra</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>

                <div className="booking-list">
                    {filteredInterviews.length > 0 ? (
                        filteredInterviews.map((interview, idx) => {
                            const dateInfo = formatDate(interview.interviewDate);
                            const companyName = interview.application?.job?.company?.name || 'Công ty ẩn danh';
                            const companyLogo = interview.application?.job?.company?.logo || `https://ui-avatars.com/api/?name=${companyName}&background=random`;
                            
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
                                                <p className="c-job">Vị trí: <strong>{interview.application?.job?.title || 'Chưa xác định'}</strong></p>
                                            </div>
                                        </div>

                                        <div className="interview-details">
                                            <div className="detail-item">
                                                <span className="material-symbols-outlined">location_on</span>
                                                <span className="text">{interview.location || 'Địa điểm chưa xác định'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="material-symbols-outlined">mail</span>
                                                <span className="text">{interview.application?.job?.company?.email || 'Chưa có email'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="booking-status-side">
                                        <span className={`status-pill status-${interview.status?.toLowerCase() || 'pending'}`}>
                                            {interview.status === 'scheduled' ? 'Sắp diễn ra' : 
                                             interview.status === 'completed' ? 'Hoàn thành' : 
                                             interview.status === 'cancelled' ? 'Đã hủy' : (interview.status || 'Chờ xác nhận')}
                                        </span>
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
