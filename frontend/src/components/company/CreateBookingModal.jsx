import React, { useState, useEffect } from 'react';
import { recruitmentApi, companyApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/company/PostJobModal.css'; // Sử dụng chung CSS của Đăng tin

const CreateBookingModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        applicationId: '',
        interviewDate: '',
        location: '',
        notes: '',
        status: 'scheduled',
        interviewerInfo: '',
        requiredDocuments: '',
        interviewFormat: 'Trực tiếp',
        preliminaryContent: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchApplications();
            if (initialData) {
                // Chế độ chỉnh sửa
                setFormData({
                    applicationId: initialData.applicationId,
                    interviewDate: initialData.interviewDate ? initialData.interviewDate.substring(0, 16) : '',
                    location: initialData.location || '',
                    notes: initialData.notes || '',
                    status: initialData.status || 'scheduled',
                    interviewerInfo: initialData.interviewerInfo || '',
                    requiredDocuments: initialData.requiredDocuments || '',
                    interviewFormat: initialData.interviewFormat || 'Trực tiếp',
                    preliminaryContent: initialData.preliminaryContent || ''
                });
                // Khi sửa thì không cho đổi ứng viên/công việc để tránh rắc rối logic
            } else {
                // Chế độ tạo mới
                setFormData({ applicationId: '', interviewDate: '', location: '', notes: '', status: 'scheduled', interviewerInfo: '', requiredDocuments: '', interviewFormat: 'Trực tiếp', preliminaryContent: '' });
                setSelectedJobId('');
            }
        }
    }, [isOpen, initialData]);

    const fetchApplications = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                companyApi.getJobs(),
                recruitmentApi.getApplications()
            ]);

            if (jobsRes.data.status === 'success' && appsRes.data.status === 'success') {
                const allJobs = jobsRes.data.data || [];
                const allApps = appsRes.data.data || [];
                
                // Lọc ứng viên phù hợp/chờ phỏng vấn
                const candidatesForBooking = allApps.filter(app => 
                    ['suitable', 'interview'].includes(app.status.toLowerCase()) || 
                    (initialData && app.id === initialData.applicationId)
                );
                
                setJobs(allJobs);
                setApplications(candidatesForBooking);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Không thể tải dữ liệu công việc và ứng viên');
        }
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleJobChange = (e) => {
        const jobId = e.target.value;
        setSelectedJobId(jobId);
        setFormData(prev => ({ ...prev, applicationId: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.applicationId || !formData.interviewDate || !formData.location) {
            toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
            return;
        }

        // Chỉ kiểm tra quá khứ khi tạo mới hoặc đổi ngày
        if (!initialData || formData.interviewDate !== initialData.interviewDate) {
            if (new Date(formData.interviewDate) < new Date()) {
                toast.error('Không thể đặt lịch phỏng vấn trong quá khứ');
                return;
            }
        }

        setIsLoading(true);
        try {
            let response;
            if (initialData) {
                // Cập nhật
                response = await recruitmentApi.updateInterview(initialData.id, {
                    applicationId: parseInt(formData.applicationId),
                    interviewDate: formData.interviewDate,
                    location: formData.location,
                    notes: formData.notes,
                    status: formData.status,
                    interviewerInfo: formData.interviewerInfo,
                    requiredDocuments: formData.requiredDocuments,
                    interviewFormat: formData.interviewFormat,
                    preliminaryContent: formData.preliminaryContent
                });
            } else {
                // Tạo mới
                response = await recruitmentApi.scheduleInterview({
                    applicationId: parseInt(formData.applicationId),
                    interviewDate: formData.interviewDate,
                    location: formData.location,
                    notes: formData.notes,
                    interviewerInfo: formData.interviewerInfo,
                    requiredDocuments: formData.requiredDocuments,
                    interviewFormat: formData.interviewFormat,
                    preliminaryContent: formData.preliminaryContent
                });
            }

            if (response.data.status === 'success') {
                toast.success(initialData ? 'Cập nhật lịch phỏng vấn thành công!' : 'Đặt lịch phỏng vấn thành công!');
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
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>
                            {initialData ? 'edit_calendar' : 'calendar_add_on'}
                        </span> 
                        {initialData ? 'Chỉnh sửa lịch phỏng vấn' : 'Đặt lịch phỏng vấn'}
                    </h2>
                    <button className="btn-close-modal" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="pjm-body">
                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">person</span> Thông tin ứng viên
                        </div>
                        
                        <div className="pjm-field" style={{ marginBottom: '1.25rem' }}>
                            <label>Công việc tuyển dụng *</label>
                            <select 
                                className="pjm-select" 
                                value={initialData ? initialData.jobId : selectedJobId} 
                                onChange={handleJobChange} 
                                disabled={!!initialData}
                                required
                            >
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
                                disabled={!selectedJobId && !initialData}
                                required
                            >
                                <option value="">-- {selectedJobId || initialData ? 'Chọn ứng viên' : 'Vui lòng chọn công việc trước'} --</option>
                                {applications.filter(app => initialData ? app.jobId === initialData.jobId : app.jobId === parseInt(selectedJobId)).map(app => (
                                    <option key={app.id} value={app.id}>{app.studentName} ({formatStatus(app.status)})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">schedule</span> Thời gian & Địa điểm
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
                            <div className="pjm-field">
                                <label>Hình thức phỏng vấn *</label>
                                <select 
                                    className="pjm-select"
                                    value={formData.interviewFormat}
                                    onChange={(e) => handleChange('interviewFormat', e.target.value)}
                                >
                                    <option value="Trực tiếp">📍 Trực tiếp (Offline)</option>
                                    <option value="Trực tuyến">💻 Trực tuyến (Online)</option>
                                </select>
                            </div>
                        </div>

                        <div className="pjm-field">
                            <label>
                                {formData.interviewFormat === 'Trực tuyến'
                                    ? '🔗 Link họp *'
                                    : '📍 Địa chỉ văn phòng *'}
                            </label>
                            <input 
                                type={formData.interviewFormat === 'Trực tuyến' ? 'url' : 'text'}
                                className="pjm-input"
                                placeholder={formData.interviewFormat === 'Trực tuyến'
                                    ? 'https://meet.google.com/... hoặc link Zoom/Teams'
                                    : 'Số nhà, tên đường, tòa nhà, tầng...'}
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                required
                            />
                        </div>

                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Người phỏng vấn</label>
                                <input 
                                    type="text" 
                                    className="pjm-input"
                                    placeholder="Tên, chức vụ người phỏng vấn..."
                                    value={formData.interviewerInfo}
                                    onChange={(e) => handleChange('interviewerInfo', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pjm-field">
                            <label>Yêu cầu hồ sơ đính kèm</label>
                            <input 
                                type="text" 
                                className="pjm-input"
                                placeholder="VD: CV bản cứng, Portfolio, Chứng chỉ..."
                                value={formData.requiredDocuments}
                                onChange={(e) => handleChange('requiredDocuments', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pjm-section">
                        <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="material-symbols-outlined">assignment</span> Nội dung & Ghi chú
                        </div>
                        <div className="pjm-field" style={{ marginBottom: '1rem' }}>
                            <label>Nội dung buổi phỏng vấn</label>
                            <textarea 
                                className="pjm-input"
                                rows="2"
                                placeholder="VD: Phỏng vấn kỹ thuật 30p, Trao đổi văn hóa 15p..."
                                value={formData.preliminaryContent}
                                onChange={(e) => handleChange('preliminaryContent', e.target.value)}
                            ></textarea>
                        </div>
                        <div className="pjm-field">
                            <label>Ghi chú cho ứng viên</label>
                            <textarea 
                                className="pjm-input"
                                rows="2"
                                placeholder="Dặn dò ứng viên (VD: Trang phục lịch sự, đến sớm 5-10 phút...)"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                            ></textarea>
                        </div>
                    </div>


                    {initialData && (
                        <div className="pjm-section">
                            <div className="pjm-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="material-symbols-outlined">flag</span> Trạng thái buổi hẹn
                            </div>
                            <div className="pjm-field">
                                <select 
                                    className="pjm-select"
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                >
                                    <option value="scheduled">Sắp diễn ra</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                            </div>
                        </div>
                    )}
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
                        {isLoading ? 'Đang xử lý...' : (initialData ? 'Cập nhật thay đổi' : 'Xác nhận đặt lịch')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBookingModal;
