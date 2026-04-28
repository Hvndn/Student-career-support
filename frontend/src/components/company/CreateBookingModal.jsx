import React, { useState, useEffect } from 'react';
import { recruitmentApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/company/CreateBookingModal.css';

const CreateBookingModal = ({ isOpen, onClose, onSuccess }) => {
    const [applications, setApplications] = useState([]);
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
                // Chỉ lấy những ứng viên có trạng thái cần đặt lịch
                const filtered = (response.data.data || []).filter(app => 
                    ['suitable', 'pending', 'interview', 'review'].includes(app.status.toLowerCase())
                );
                setApplications(filtered);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Không thể tải danh sách ứng viên');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.applicationId || !formData.interviewDate || !formData.location) {
            toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="booking-modal glass intro-y" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title">
                        <span className="material-symbols-outlined">event_available</span>
                        <h3>Đặt lịch phỏng vấn mới</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Chọn ứng viên <span className="required">*</span></label>
                        <div className="select-wrapper">
                            <span className="material-symbols-outlined icon">person</span>
                            <select 
                                name="applicationId" 
                                value={formData.applicationId} 
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn ứng viên --</option>
                                {applications.map(app => (
                                    <option key={app.id} value={app.id}>
                                        {app.studentName} | {app.jobTitle} ({formatStatus(app.status)})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Thời gian <span className="required">*</span></label>
                            <div className="input-wrapper">
                                <span className="material-symbols-outlined icon">schedule</span>
                                <input 
                                    type="datetime-local" 
                                    name="interviewDate"
                                    value={formData.interviewDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Địa điểm / Link họp <span className="required">*</span></label>
                        <div className="input-wrapper">
                            <span className="material-symbols-outlined icon">location_on</span>
                            <input 
                                type="text" 
                                name="location"
                                placeholder="Địa chỉ văn phòng hoặc link Zoom/Google Meet..."
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Ghi chú cho ứng viên</label>
                        <textarea 
                            name="notes"
                            rows="3"
                            placeholder="Hướng dẫn thêm cho ứng viên (VD: Mang theo laptop, chuẩn bị Portfolio...)"
                            value={formData.notes}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                            Hủy bỏ
                        </button>
                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? (
                                <><span className="loader-sm"></span> Đang xử lý...</>
                            ) : (
                                <><span className="material-symbols-outlined">send</span> Xác nhận đặt lịch</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingModal;
