import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api';
import '../../assets/css/student/Interviews.css';

const Interviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await studentApi.getInterviews();
                setInterviews(response.data.data || []);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('vi-VN', { month: 'long' }),
            time: date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('vi-VN')
        };
    };

    if (loading) {
        return <div className="loading-container">Đang tải...</div>;
    }

    return (
        <div className="student-interviews-page">
            <div className="si-container">
                <header className="si-header">
                    <h1>Lịch phỏng vấn của tôi</h1>
                    <p>Theo dõi và chuẩn bị tốt nhất cho các buổi phỏng vấn sắp tới.</p>
                </header>

                <div className="si-list">
                    {interviews.length > 0 ? interviews.map((interview, index) => {
                        const dateInfo = formatDate(interview.interviewDate);
                        return (
                            <div key={index} className="si-card">
                                <div className="si-date-box">
                                    <span className="si-day">{dateInfo.day}</span>
                                    <span className="si-month">{dateInfo.month}</span>
                                </div>
                                <div className="si-info">
                                    <h3>{interview.application?.job?.title || 'Vị trí phỏng vấn'}</h3>
                                    <p className="si-company">{interview.application?.job?.company?.name || 'Công ty'}</p>
                                    <div className="si-details">
                                        <div className="si-detail-item">
                                            <span className="si-icon">🕒</span> {dateInfo.time}
                                        </div>
                                        <div className="si-detail-item">
                                            <span className="si-icon">📍</span> {interview.location || 'Online'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`si-status-badge si-status-${interview.status}`}>
                                    {interview.status === 'scheduled' ? 'Sắp diễn ra' : interview.status}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="si-no-data">
                            <div className="si-no-data-icon">📅</div>
                            <h3>Chưa có lịch phỏng vấn nào</h3>
                            <p>Đừng nản lòng! Hãy tiếp tục ứng tuyển vào các vị trí phù hợp.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Interviews;
