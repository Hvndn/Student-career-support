import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/common/ConfirmModal';
import '../../assets/css/admin/AdminLayout.css';
import '../../assets/css/admin/AdminDashboard.css';

const AdminPasswordRequests = () => {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ pendingCount: 0, completedCount: 0 });
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        document.body.style.paddingTop = '0';
        fetchData();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchRequests(), fetchStats()]);
        setLoading(false);
    };

    const fetchRequests = async () => {
        try {
            const response = await adminApi.getPasswordRequests();
            setRequests(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách yêu cầu:", error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminApi.getPasswordRequestStats();
            setStats(response.data.data || { pendingCount: 0, completedCount: 0 });
        } catch (error) {
            console.error("Lỗi khi lấy thống kê:", error);
        }
    };

    const handleApproveClick = (request) => {
        setSelectedRequest(request);
        setShowConfirmModal(true);
    };

    const handleConfirmApprove = async () => {
        if (!selectedRequest) return;
        
        const id = selectedRequest.id;
        try {
            setShowConfirmModal(false);
            setProcessingId(id);
            const response = await adminApi.approvePasswordRequest(id);
            toast.success(response.data.message || "Đã cấp lại mật khẩu thành công!");
            fetchData(); 
        } catch (error) {
            console.error("Lỗi khi phê duyệt:", error);
            toast.error("Có lỗi xảy ra khi cấp lại mật khẩu.");
        } finally {
            setProcessingId(null);
            setSelectedRequest(null);
        }
    };

    return (
        <div className="admin-layout mesh-gradient-bg">
            <AdminSidebar />
            
            <div className="admin-main-content">
                <AdminNavbar title="Cấp lại mật khẩu" />
                
                <main className="admin-body">
                    <section className="dau-header-section fade-in">
                        <div className="dau-header-left">
                            <div className="status-badge-dau">
                                <span className="status-dot"></span>
                                PASSWORD RECOVERY
                            </div>
                            <h1>Cấp lại <span className="text-red">Mật khẩu</span> 🔑</h1>
                            <p>Trung tâm xử lý yêu cầu khôi phục tài khoản hệ thống</p>
                        </div>
                        <div className="dau-header-right">
                            <button className="btn-refresh" onClick={fetchData}>
                                <span className="material-symbols-outlined">refresh</span>
                                Làm mới dữ liệu
                            </button>
                        </div>
                    </section>

                    <section className="dau-metrics-grid fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: '800px' }}>
                        <div className="dau-metric-card">
                            <div className="dau-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                            <div className="dau-metric-content">
                                <h2 className="dau-metric-value">{stats.pendingCount}</h2>
                                <span className="dau-metric-label">Số yêu cầu chưa xử lý</span>
                            </div>
                        </div>

                        <div className="dau-metric-card">
                            <div className="dau-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                                <span className="material-symbols-outlined">task_alt</span>
                            </div>
                            <div className="dau-metric-content">
                                <h2 className="dau-metric-value">{stats.completedCount}</h2>
                                <span className="dau-metric-label">Đã cấp lại mật khẩu</span>
                            </div>
                        </div>
                    </section>

                    <div className="data-panel fade-in" style={{ marginTop: '2rem' }}>
                        <div className="table-header-bar">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                    <span className="material-symbols-outlined">list_alt</span>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0 }}>Danh sách yêu cầu</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Cập nhật tự động theo thời gian thực</p>
                                </div>
                            </div>
                            <div className="status-badge-dau" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                {requests.length} ĐƠN CHỜ DUYỆT
                            </div>
                        </div>
                        
                        {loading ? (
                            <div className="dau-empty-state">
                                <div className="loader-small" style={{ borderTopColor: '#2563eb' }}></div>
                                <p style={{ marginTop: '10px' }}>Đang tải dữ liệu...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="dau-empty-state">
                                <div className="empty-icon-wrapper">
                                    <span className="material-symbols-outlined success-icon">lock_open</span>
                                </div>
                                <h4>Không có yêu cầu nào</h4>
                                <p>Hiện không có yêu cầu cấp lại mật khẩu nào đang chờ xử lý.</p>
                            </div>
                        ) : (
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Người yêu cầu</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Thời gian gửi</th>
                                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, index) => (
                                        <tr key={request.id} className="stagger-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <td>
                                                <div className="user-info-cell">
                                                    <div className="avatar-round" style={{ 
                                                        background: request.user.role === 'student' ? '#7c3aed' : '#f59e0b'
                                                    }}>
                                                        {request.user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="user-details">
                                                        <h4>{request.user.fullName}</h4>
                                                        <p>ID: #{request.user.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>mail</span>
                                                    {request.user.email}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge role-${request.user.role.toLowerCase()}`}>
                                                    {request.user.role === 'student' ? 'Sinh viên' : 
                                                     request.user.role === 'company' ? 'Doanh nghiệp' : 'Admin'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '700', color: '#334155' }}>{new Date(request.requestDate).toLocaleDateString('vi-VN')}</span>
                                                    <span>{new Date(request.requestDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button 
                                                    className="btn-primary"
                                                    onClick={() => handleApproveClick(request)}
                                                    disabled={processingId === request.id}
                                                    style={{ 
                                                        padding: '8px 20px', 
                                                        borderRadius: '10px',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    {processingId === request.id ? (
                                                        <span className="loader-small"></span>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>verified_user</span>
                                                            PHÊ DUYỆT
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>

            <ConfirmModal 
                show={showConfirmModal}
                title="Cấp lại mật khẩu"
                message={`Bạn có chắc chắn muốn cấp mật khẩu mới cho ${selectedRequest?.user?.fullName}? Hệ thống sẽ tự động tạo mật khẩu mới và gửi email thông báo cho người dùng.`}
                confirmText="Xác nhận cấp"
                cancelText="Hủy bỏ"
                onConfirm={handleConfirmApprove}
                onCancel={() => setShowConfirmModal(false)}
                type="primary"
            />
        </div>
    );
};

export default AdminPasswordRequests;
