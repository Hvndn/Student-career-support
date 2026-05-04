import React, { useState, useEffect } from 'react';
import { recruitmentApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/company/PostJobModal.css'; // Sử dụng chung CSS của Đăng tin

const CreateBookingModal = ({ isOpen, onClose, onSuccess }) => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        applicationId: '',
        interviewDate: '',
        location: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchApplications();
        }
    }, [isOpen]);

    const fetchApplications = async () => {
        try {
            const response = await recruitmentApi.getApplications();
            if (response.data.status === 'success') {
                const allApps = response.data.data || [];
                const candidatesForBooking = allApps.filter(app => 
                    ['suitable', 'interview'].includes(app.status.toLowerCase())
                );
                
                const uniqueJobs = [];
                const jobIds = new Set();
                candidatesForBooking.forEach(app => {
                    if (!jobIds.has(app.jobId)) {
                        jobIds.add(app.jobId);
                        uniqueJobs.push({ id: app.jobId, title: app.jobTitle });
                    }
                });
                
                setJobs(uniqueJobs);
                setApplications(candidatesForBooking);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Không thể tải danh sách dữ liệu');
        }
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleJobChange = (e) => {
        const jobId = e.target.value;
        setSelectedJobId(jobId);
        setFormData(prev => ({ ...prev, applicationId: '' }));
        
        if (jobId) {
            const candidates = applications.filter(app => app.jobId === parseInt(jobId));
            setFilteredCandidates(candidates);
        } else {
            setFilteredCandidates([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.applicationId || !formData.interviewDate || !formData.location) {
            toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
            return;
        }

        if (new Date(formData.interviewDate) < new Date()) {
            toast.error('Không thể đặt lịch phỏng vấn trong quá khứ');
            return;
        }

        setIsLoading(true);
        try {
            const response = await recruitmentApi.scheduleInterview({
                applicationId: parseInt(formData.applicationId),
                interviewDate: formData.interviewDate,
                location: formData.location,
                notes: formData.notes
            });

            if (response.data.status === 'success') {
                toast.success('Đặt lịch phỏng vấn thành công!');
                onSuccess();
                onClose();
                setFormData({ applicationId: '', interviewDate: '', location: '', notes: '' });
                setSelectedJobId('');
            }
        } catch (error) {
            console.error('Error scheduling interview:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatStatus = (status) => {
        const map = {
            'pending': 'Chờ duyệt',
            'review': 'Đang xem xét',
            'suitable': 'Phù hợp',
            'interview': 'Phỏng vấn'
        };
        return map[status.toLowerCase()] || status;
    };

    if (!isOpen) return null;

    return (
        <div className="pjm-overlay" onClick={onClose}>
            <div className="pjm-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
                <div className="pjm-header">
                    <h2><i className="fa-solid fa-calendar-check"></i> Đặt lịch phỏng vấn</h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="pjm-body">
                    <div className="pjm-section">
                        <div className="pjm-section-title">
                            <i className="fa-solid fa-user-tie"></i> Thông tin ứng viên
                        </div>
                        
                        <div className="pjm-field" style={{ marginBottom: '1.25rem' }}>
                            <label>Vị trí tuyển dụng *</label>
                            <select className="pjm-select" value={selectedJobId} onChange={handleJobChange} required>
                                <option value="">-- Chọn công việc --</option>
                                {jobs.map(job => (
                                    <option key={job.id} value={job.id}>{job.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pjm-field">
                            <label>Ứng viên phỏng vấn *</label>
                            <select 
                                className="pjm-select"
                                value={formData.applicationId} 
                                onChange={(e) => handleChange('applicationId', e.target.value)}
                                disabled={!selectedJobId}
                                required
                            >
                                <option value="">-- {selectedJobId ? 'Chọn ứng viên' : 'Vui lòng chọn công việc trước'} --</option>
                                {filteredCandidates.map(app => (
                                    <option key={app.id} value={app.id}>{app.studentName} ({formatStatus(app.status)})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pjm-section">
                        <div className="pjm-section-title">
                            <i className="fa-solid fa-clock"></i> Thời gian & Địa điểm
                        </div>
                        
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Thời gian hẹn *</label>
                                <input 
                                    type="datetime-local" 
                                    className="pjm-input"
                                    value={formData.interviewDate}
                                    onChange={(e) => handleChange('interviewDate', e.target.value)}
                                    min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pjm-field">
                            <label>Địa điểm / Link họp *</label>
                            <input 
                                type="text" 
                                className="pjm-input"
                                placeholder="Địa chỉ văn phòng hoặc link Zoom/Google Meet"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="pjm-section">
                        <div className="pjm-section-title">
                            <i className="fa-solid fa-comment-dots"></i> Ghi chú
                        </div>
                        <div className="pjm-field">
                            <textarea 
                                className="pjm-input"
                                rows="3"
                                placeholder="Lời nhắn tới ứng viên (Vd: Yêu cầu mang theo CV, laptop...)"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pjm-footer">
                    <button type="button" className="pjm-btn-cancel" onClick={onClose}>
                        Hủy bỏ
                    </button>
                    <button 
                        type="button" 
                        className="pjm-btn-submit" 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBookingModal;
