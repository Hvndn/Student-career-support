import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminManagement.css';

const ManageAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedApt, setSelectedApt] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getInterviews();
            if (res.data && res.data.data) {
                setAppointments(res.data.data || []);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách lịch hẹn:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "---";
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "00:00";
        const date = new Date(dateStr);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const handleViewDetail = (apt) => {
        setSelectedApt(apt);
        setIsModalOpen(true);
    };

    const filteredAppointments = appointments.filter(apt => {
        // Lọc theo trạng thái
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'confirmed' && (apt.status === 'confirmed' || !apt.status)) ||
            (statusFilter === 'pending' && apt.status === 'pending');

        // Lọc theo từ khóa (Công ty hoặc Sinh viên)
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' ||
            (apt.companyName && apt.companyName.toLowerCase().includes(searchLower)) ||
            (apt.studentName && apt.studentName.toLowerCase().includes(searchLower)) ||
            (apt.studentEmail && apt.studentEmail.toLowerCase().includes(searchLower)) ||
            (apt.studentIdStr && apt.studentIdStr.toLowerCase().includes(searchLower));

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý lịch hẹn" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <h2 className="management-title">Quản lý Lịch hẹn</h2>
                    </div>

                    <div className="management-controls">
                        <div className="controls-left">
                            {/* Nút QL Đơn vị đã được gỡ bỏ theo yêu cầu */}
                        </div>
                        <div className="controls-right">
                            <div className="filter-group">
                                <select
                                    className="management-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="pending">Chờ xử lý</option>
                                </select>
                            </div>
                            <div className="search-wrapper-premium">
                                <input
                                    type="text"
                                    className="search-input-premium"
                                    placeholder="Tìm doanh nghiệp, sinh viên..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined">search</span>
                            </div>
                        </div>
                    </div>

                    <div className="management-table-container">
                        <div className="management-table-header appointment-grid">
                            <div>DOANH NGHIỆP</div>
                            <div>SINH VIÊN</div>
                            <div>THỜI GIAN</div>
                            <div>GHI CHÚ</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="loader" style={{ margin: '0 auto' }}></div>
                            </div>
                        ) : filteredAppointments.length > 0 ? (
                            filteredAppointments.map((apt) => (
                                <div key={apt.id} className="management-card-row appointment-grid">
                                    <div className="info-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="circle-avatar" style={{ backgroundColor: '#f1f5f9', color: '#64748b', flexShrink: 0 }}>
                                            {apt.companyLogo ? (
                                                <img src={apt.companyLogo} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.companyName || 'C')}&background=e2e8f0&color=64748b`; }} />
                                            ) : (
                                                <span className="material-symbols-outlined">business</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.85rem' }}>{apt.companyName}</h4>
                                            <p style={{ fontSize: '0.75rem' }}>{apt.industry}</p>
                                        </div>
                                    </div>
                                    <div className="info-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="circle-avatar" style={{ backgroundColor: '#e0f2fe', color: '#0284c7', flexShrink: 0, width: '32px', height: '32px' }}>
                                            {apt.studentAvatar ? (
                                                <img src={apt.studentAvatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.studentName || 'S')}&background=e0f2fe&color=0284c7`; }} />
                                            ) : (
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.85rem' }}>{apt.studentName}</h4>
                                            <p style={{ fontSize: '0.75rem' }}>{apt.studentEmail}</p>
                                        </div>
                                    </div>
                                    <div className="info-cell">
                                        <h4 style={{ fontSize: '0.85rem' }}>{formatDate(apt.interviewDate)}</h4>
                                        <p style={{ fontSize: '0.75rem' }}>{formatTime(apt.interviewDate)}</p>
                                    </div>
                                    <div className="text-cell" style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {apt.notes ? `"${apt.notes}"` : '---'}
                                    </div>
                                    <div className="status-cell" style={{ color: apt.status === 'confirmed' || !apt.status ? '#10b981' : '#f59e0b' }}>
                                        {apt.status === 'confirmed' || !apt.status ? 'Đã xác nhận' : 'Chờ xử lý'}
                                    </div>
                                    <div className="actions-cell">
                                        <button className="action-btn" onClick={() => handleViewDetail(apt)}>
                                            <span className="material-symbols-outlined">visibility</span>
                                            Xem
                                        </button>
                                        <button className="action-btn delete">
                                            <span className="material-symbols-outlined">delete</span>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                Không có lịch hẹn nào
                            </div>
                        )}
                    </div>

                    <div className="management-pagination">
                        <button className="page-link active">1</button>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', alignSelf: 'center', marginLeft: 'auto' }}>
                            Hiển thị 1 đến {filteredAppointments.length} của {filteredAppointments.length} mục
                        </span>
                        <select className="management-select" style={{ minWidth: '70px', marginLeft: '1rem' }}>
                            <option>10</option>
                            <option>20</option>
                        </select>
                    </div>
                </main>
            </div>

            {/* Modal Chi tiết Cuộc hẹn */}
            {isModalOpen && selectedApt && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="premium-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết Cuộc hẹn</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div className="circle-avatar" style={{ width: '60px', height: '60px', backgroundColor: '#f1f5f9', color: '#64748b' }}>
                                    {selectedApt.companyLogo ? (
                                        <img src={selectedApt.companyLogo} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApt.companyName || 'C')}&background=e2e8f0&color=64748b`; }} />
                                    ) : (
                                        <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>business</span>
                                    )}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{selectedApt.companyName}</h4>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{selectedApt.industry}</p>
                                </div>
                            </div>

                            <div className="modal-detail-section" style={{ marginTop: '0', paddingTop: '1rem', borderTop: 'none', marginBottom: '1.5rem' }}>
                                <div className="section-title" style={{ fontSize: '0.95rem' }}>
                                    <span className="material-symbols-outlined">person</span>
                                    Thông tin Sinh viên
                                </div>
                                <div className="detail-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 1rem' }}>
                                    <div className="circle-avatar" style={{ width: '45px', height: '45px', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                                        {selectedApt.studentAvatar ? (
                                            <img src={selectedApt.studentAvatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApt.studentName || 'S')}&background=e0f2fe&color=0284c7`; }} />
                                        ) : (
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>{selectedApt.studentName}</h4>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{selectedApt.studentEmail}</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                                            <span className="pill-tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>MSSV: {selectedApt.studentIdStr || '---'}</span>
                                            <span className="pill-tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>Ngành: {selectedApt.major || '---'}</span>
                                            <span className="pill-tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>SĐT: {selectedApt.phone || '---'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="detail-item full-width">
                                    <div className="detail-label">ĐỊA ĐIỂM / LINK MEET</div>
                                    <div className="detail-value" style={{ color: '#0652dd', fontWeight: 600 }}>
                                        {selectedApt.location || '---'}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">TRẠNG THÁI</div>
                                    <div className="detail-value">
                                        <span className="pill-tag" style={{ backgroundColor: selectedApt.status === 'confirmed' || !selectedApt.status ? '#ecfdf5' : '#fef3c7', color: selectedApt.status === 'confirmed' || !selectedApt.status ? '#10b981' : '#f59e0b', display: 'inline-flex', padding: '4px 12px' }}>
                                            {selectedApt.status === 'confirmed' || !selectedApt.status ? 'Đã xác nhận' : 'Chờ xử lý'}
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">NGÀY HẸN</div>
                                    <div className="detail-value">{formatDate(selectedApt.interviewDate)}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">THỜI GIAN</div>
                                    <div className="detail-value">{formatTime(selectedApt.interviewDate)} - {formatTime(new Date(new Date(selectedApt.interviewDate).getTime() + 2 * 60 * 60 * 1000).toISOString())}</div>
                                </div>
                            </div>

                            <div className="modal-detail-section" style={{ marginTop: '1rem', paddingTop: '1rem' }}>
                                <div className="section-title">
                                    <span className="material-symbols-outlined">notes</span>
                                    Ghi chú từ doanh nghiệp
                                </div>
                                <div className="detail-card">
                                    <p className="description" style={{ margin: 0, fontStyle: 'italic' }}>
                                        {selectedApt.notes || "Không có ghi chú nào."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAppointment;
