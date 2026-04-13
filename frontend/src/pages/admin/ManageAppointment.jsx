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

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý lịch hẹn" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <div className="breadcrumb-dau">
                            DAU Connect <span className="separator">›</span> Quản lý lịch hẹn
                        </div>
                        <h2 className="management-title">Quản lý Lịch hẹn</h2>
                    </div>

                    <div className="management-controls">
                        <div className="controls-left">
                            <button className="btn-add-main" style={{ backgroundColor: '#800000' }}>
                                <span className="material-symbols-outlined">menu</span>
                                QL Đơn vị
                            </button>
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
                                    placeholder="Tìm kiếm doanh nghiệp..." 
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
                            <div>PHÒNG BAN</div>
                            <div>THỜI GIAN</div>
                            <div>GHI CHÚ</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="loader" style={{margin: '0 auto'}}></div>
                            </div>
                        ) : appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <div key={apt.id} className="management-card-row appointment-grid">
                                    <div className="info-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="circle-avatar" style={{ backgroundColor: '#f1f5f9', color: '#64748b', flexShrink: 0 }}>
                                            {apt.companyLogo ? (
                                                <img src={apt.companyLogo} alt="Logo" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                            ) : (
                                                <span className="material-symbols-outlined">business</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.85rem' }}>{apt.companyName}</h4>
                                            <p style={{ fontSize: '0.75rem' }}>{apt.industry}</p>
                                        </div>
                                    </div>
                                    <div className="text-cell" style={{ fontWeight: 500 }}>
                                        {apt.department || '---'}
                                    </div>
                                    <div className="info-cell">
                                        <h4 style={{ fontSize: '0.85rem' }}>{formatDate(apt.interviewDate)}</h4>
                                        <p style={{ fontSize: '0.75rem' }}>{formatTime(apt.interviewDate)} - {formatTime(new Date(new Date(apt.interviewDate).getTime() + 2*60*60*1000).toISOString())}</p>
                                    </div>
                                    <div className="text-cell" style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#64748b' }}>
                                        {apt.notes ? `"${apt.notes}"` : '---'}
                                    </div>
                                    <div className="status-cell" style={{ color: apt.status === 'confirmed' || !apt.status ? '#10b981' : '#f59e0b' }}>
                                        <span className="material-symbols-outlined">check_circle</span>
                                        {apt.status === 'confirmed' || !apt.status ? 'Đã xác nhận' : 'Chờ xử lý'}
                                    </div>
                                    <div className="actions-cell">
                                        <button className="action-btn">
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
                            Hiển thị 1 đến {appointments.length} của {appointments.length} mục
                        </span>
                        <select className="management-select" style={{ minWidth: '70px', marginLeft: '1rem' }}>
                            <option>10</option>
                            <option>20</option>
                        </select>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageAppointment;
