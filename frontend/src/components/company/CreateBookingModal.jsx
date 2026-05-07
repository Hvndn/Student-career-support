import React, { useState, useEffect } from 'react';
import { recruitmentApi, companyApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/company/PostJobModal.css';

const CreateBookingModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Lấy thông tin user hiện tại để auto-fill
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    const getLocalISOString = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().substring(0, 16);
    };

    const [formData, setFormData] = useState({
        applicationId: '',
        interviewDate: '',
        location: '',
        notes: '',
        status: 'scheduled',
        interviewerInfo: currentUser.fullName || '',
        interviewerEmail: currentUser.email || '',
        interviewerPhone: '',
        requiredDocuments: '',
        interviewFormat: 'Trực tuyến', // Mặc định online cho hiện đại
        preliminaryContent: '',
        duration: 60,
        meetingLink: '',
        stageType: 'Technical'
    });

    useEffect(() => {
        if (isOpen) {
            fetchApplications();
            if (initialData) {
                setFormData({
                    applicationId: initialData.applicationId,
                    interviewDate: initialData.interviewDate ? initialData.interviewDate.substring(0, 16) : '',
                    location: initialData.location || '',
                    notes: initialData.notes || '',
                    status: initialData.status || 'scheduled',
                    interviewerInfo: initialData.interviewerInfo || '',
                    interviewerEmail: initialData.interviewerEmail || '',
                    interviewerPhone: initialData.interviewerPhone || '',
                    requiredDocuments: initialData.requiredDocuments || '',
                    interviewFormat: initialData.interviewFormat || 'Trực tiếp',
                    preliminaryContent: initialData.preliminaryContent || '',
                    duration: initialData.duration || 60,
                    meetingLink: initialData.meetingLink || '',
                    stageType: initialData.stageType || 'Technical'
                });
            } else {
                setFormData({ 
                    applicationId: '', 
                    interviewDate: '', 
                    location: '', 
                    notes: '', 
                    status: 'scheduled', 
                    interviewerInfo: currentUser.fullName || '', 
                    interviewerEmail: currentUser.email || '',
                    interviewerPhone: '',
                    requiredDocuments: '', 
                    interviewFormat: 'Trực tuyến', 
                    preliminaryContent: '',
                    duration: 60,
                    meetingLink: '',
                    stageType: 'Technical'
                });
                setSelectedJobId('');
            }
        }
    }, [isOpen, initialData]);

    // [FE Logic] Lấy danh sách tin tuyển dụng và danh sách đơn ứng tuyển để chọn ứng viên cần đặt lịch
    const fetchApplications = async () => {
        try {
            // [BE] CompanyRestController.getJobs(), RecruitmentRestController.getApplications()
            const [jobsRes, appsRes] = await Promise.all([
                companyApi.getJobs(),
                recruitmentApi.getApplications()
            ]);

            if (jobsRes.data.status === 'success' && appsRes.data.status === 'success') {
                const allJobs = jobsRes.data.data || [];
                const allApps = appsRes.data.data || [];
                
                // Chỉ lấy những ứng viên đang ở trạng thái 'suitable' (phù hợp) hoặc 'interview' (đang phỏng vấn)
                const candidatesForBooking = allApps.filter(app => 
                    ['suitable', 'interview'].includes(app.status.toLowerCase()) || 
                    (initialData && app.id === initialData.applicationId)
                );
                
                setJobs(allJobs);
                setApplications(candidatesForBooking);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Không thể tải dữ liệu');
        }
    };

    const handleChange = (name, value) => {
        if (name === 'interviewDate' && value) {
            const selectedDate = new Date(value);
            const now = new Date();
            if (selectedDate < now) {
                toast.error('Thời gian không được ở quá khứ');
                return;
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleJobChange = (e) => {
        const jobId = e.target.value;
        setSelectedJobId(jobId);
        setFormData(prev => ({ ...prev, applicationId: '' }));
    };

    // [FE Logic] Lưu lịch phỏng vấn mới hoặc cập nhật lịch cũ
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate cơ bản
        if (!formData.applicationId || !formData.interviewDate || !formData.stageType) {
            toast.error('Vui lòng điền các thông tin bắt buộc');
            return;
        }

        // Kiểm tra thời gian phỏng vấn không được ở quá khứ
        const selectedDate = new Date(formData.interviewDate);
        const now = new Date();
        if (selectedDate < now) {
            toast.error('Thời gian phỏng vấn không được ở quá khứ');
            return;
        }

        // Validate địa điểm/link dựa trên hình thức (Online/Offline)
        if (formData.interviewFormat === 'Trực tuyến' && !formData.meetingLink) {
            toast.error('Vui lòng cung cấp link họp trực tuyến');
            return;
        }
        if (formData.interviewFormat === 'Trực tiếp' && !formData.location) {
            toast.error('Vui lòng nhập địa điểm phỏng vấn');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                applicationId: parseInt(formData.applicationId),
                duration: parseInt(formData.duration),
                round: formData.stageType // Đồng bộ round với stageType
            };

            let response;
            if (initialData) {
                // [BE] RecruitmentRestController.updateInterview()
                response = await recruitmentApi.updateInterview(initialData.id, payload);
            } else {
                // [BE] RecruitmentRestController.scheduleInterview()
                // [DB] INSERT INTO interviews (...)
                response = await recruitmentApi.scheduleInterview(payload);
            }

            if (response.data.status === 'success') {
                toast.success(initialData ? 'Đã cập nhật lịch phỏng vấn!' : 'Đặt lịch phỏng vấn thành công!');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error saving interview:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    const formatStatus = (status) => {
        const map = { 'suitable': 'Phù hợp', 'interview': 'Phỏng vấn' };
        return map[status.toLowerCase()] || status;
    };

    if (!isOpen) return null;

    return (
        <div className="pjm-overlay">
            <div className="pjm-container" style={{ maxWidth: '600px' }}>
                <div className="pjm-header">
                    <h2>
                        <span className="material-symbols-outlined">
                            {initialData ? 'edit_calendar' : 'calendar_add_on'}
                        </span> 
                        {initialData ? 'Chỉnh sửa lịch hẹn' : 'Đặt lịch phỏng vấn mới'}
                    </h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="pjm-body">
                    {/* Section 1: Thông tin cơ bản */}
                    <div className="pjm-section">
                        <div className="pjm-section-title">
                            <span className="material-symbols-outlined">info</span> 📌 Thông tin cơ bản
                        </div>
                        
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Vị trí tuyển dụng *</label>
                                <select 
                                    className="pjm-select" 
                                    value={initialData ? initialData.jobId : selectedJobId} 
                                    onChange={handleJobChange} 
                                    disabled={!!initialData}
                                >
                                    <option value="">-- Chọn công việc --</option>
                                    {jobs.map(job => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pjm-field">
                                <label>Ứng viên *</label>
                                <select 
                                    className="pjm-select"
                                    value={formData.applicationId} 
                                    onChange={(e) => handleChange('applicationId', e.target.value)}
                                    disabled={!selectedJobId && !initialData}
                                >
                                    <option value="">-- {selectedJobId || initialData ? 'Chọn ứng viên' : 'Chọn công việc trước'} --</option>
                                    {applications.filter(app => initialData ? app.jobId === initialData.jobId : app.jobId === parseInt(selectedJobId)).map(app => (
                                        <option key={app.id} value={app.id}>{app.studentName} ({formatStatus(app.status)})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Thời gian phỏng vấn *</label>
                                <input 
                                    type="datetime-local" 
                                    className="pjm-input"
                                    value={formData.interviewDate}
                                    onChange={(e) => handleChange('interviewDate', e.target.value)}
                                    min={getLocalISOString()}
                                />
                            </div>
                            <div className="pjm-field">
                                <label>Loại phỏng vấn (Stage) *</label>
                                <select 
                                    className="pjm-select"
                                    value={formData.stageType}
                                    onChange={(e) => handleChange('stageType', e.target.value)}
                                >
                                    <option value="HR">HR Screening</option>
                                    <option value="Technical">Technical Interview</option>
                                    <option value="Final">Final Interview</option>
                                </select>
                            </div>
                        </div>

                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Hình thức *</label>
                                <select 
                                    className="pjm-select"
                                    value={formData.interviewFormat}
                                    onChange={(e) => handleChange('interviewFormat', e.target.value)}
                                >
                                    <option value="Trực tuyến">💻 Trực tuyến (Online)</option>
                                    <option value="Trực tiếp">📍 Trực tiếp (Offline)</option>
                                </select>
                            </div>
                            <div className="pjm-field">
                                <label>Thời lượng (phút)</label>
                                <input 
                                    type="number" 
                                    className="pjm-input"
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                />
                            </div>
                        </div>

                        {formData.interviewFormat === 'Trực tuyến' ? (
                            <div className="pjm-field">
                                <label>Link họp Online (Google Meet, Zoom...) *</label>
                                <input 
                                    type="url"
                                    className="pjm-input"
                                    placeholder="https://meet.google.com/..."
                                    value={formData.meetingLink}
                                    onChange={(e) => handleChange('meetingLink', e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="pjm-field">
                                <label>Địa điểm phỏng vấn *</label>
                                <input 
                                    type="text"
                                    className="pjm-input"
                                    placeholder="Văn phòng, tầng, phòng họp..."
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                />
                            </div>
                        )}

                        <div className="pjm-field">
                            <label>Người phỏng vấn chính</label>
                            <input 
                                type="text" 
                                className="pjm-input"
                                placeholder="Họ tên người phỏng vấn..."
                                value={formData.interviewerInfo}
                                onChange={(e) => handleChange('interviewerInfo', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Section 2: Thông tin bổ sung */}
                    <div className="pjm-section">
                        <div className="pjm-section-title">
                            <span className="material-symbols-outlined">description</span> 📝 Thông tin bổ sung
                        </div>
                        
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Yêu cầu chuẩn bị (Optional)</label>
                                <input 
                                    type="text" 
                                    className="pjm-input"
                                    placeholder="VD: CV, Portfolio, Laptop..."
                                    value={formData.requiredDocuments}
                                    onChange={(e) => handleChange('requiredDocuments', e.target.value)}
                                />
                            </div>
                            {initialData && (
                                <div className="pjm-field">
                                    <label>Trạng thái</label>
                                    <select 
                                        className="pjm-select"
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                    >
                                        <option value="scheduled">Sắp diễn ra</option>
                                        <option value="completed">Đã hoàn thành</option>
                                        <option value="cancelled">Đã hủy</option>
                                        <option value="no_show">No-show</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="pjm-field">
                            <label>Nội dung sơ lược (Gửi ứng viên)</label>
                            <textarea 
                                className="pjm-input"
                                rows="2"
                                placeholder="Mô tả ngắn gọn nội dung buổi phỏng vấn..."
                                value={formData.preliminaryContent}
                                onChange={(e) => handleChange('preliminaryContent', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pjm-footer">
                    <button type="button" className="pjm-btn-cancel" onClick={onClose}>Hủy</button>
                    <button 
                        type="button" 
                        className="pjm-btn-submit" 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Xác nhận đặt lịch')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBookingModal;
