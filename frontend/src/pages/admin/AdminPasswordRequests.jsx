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
            await adminApi.approvePasswordRequest(id);
            toast.success("Đã cấp lại mật khẩu và gửi email thành công!");
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
                    <div className="admin-header-section fade-in" style={{ marginBottom: '3rem' }}>
                        <div className="header-text">
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Cấp lại Mật khẩu
                            </h1>
                            <p style={{ fontSize: '1.1rem', marginTop: '8px' }}>Trung tâm xử lý yêu cầu khôi phục tài khoản hệ thống.</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-secondary ultra-glass" onClick={fetchData} style={{ borderRadius: '14px', padding: '12px 24px' }}>
                                <span className="material-symbols-outlined">refresh</span>
                                Làm mới dữ liệu
                            </button>
                        </div>
                    </div>

                    <div className="metrics-grid fade-in">
                        <div className="metric-card ultra-glass" style={{ borderLeft: '6px solid #f59e0b' }}>
                            <div className="metric-header">
                                <div className="metric-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                                    <span className="material-symbols-outlined">pending_actions</span>
                                </div>
                                <div className="metric-trend stability">Đang chờ</div>
                            </div>
                            <div className="metric-info">
                                <div className="metric-label">Số yêu cầu chưa xử lý</div>
                                <div className="metric-value">{stats.pendingCount}</div>
                            </div>
                        </div>

                        <div className="metric-card ultra-glass" style={{ borderLeft: '6px solid #10b981' }}>
                            <div className="metric-header">
                                <div className="metric-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                                    <span className="material-symbols-outlined">task_alt</span>
                                </div>
                                <div className="metric-trend up">Thành công</div>
                            </div>
                            <div className="metric-info">
                                <div className="metric-label">Đã cấp lại mật khẩu</div>
                                <div className="metric-value">{stats.completedCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="data-panel ultra-glass fade-in" style={{ marginTop: '2rem' }}>
                        <div className="table-header-bar">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                    <span className="material-symbols-outlined">list_alt</span>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Danh sách yêu cầu</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Cập nhật tự động theo thời gian thực</p>
                                </div>
                            </div>
                            <div className="badge count-badge ultra-glass" style={{ background: 'white', fontWeight: 800 }}>
                                {requests.length} ĐƠN CHỜ DUYỆT
                            </div>
                        </div>
                        {loading ? (
                            <div className="loading-spinner">Đang tải dữ liệu...</div>
                        ) : requests.length === 0 ? (
                            <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#94a3b8', marginBottom: '1rem' }}>lock_open</span>
                                <h3 style={{ color: '#1e293b' }}>Không có yêu cầu nào</h3>
                                <p style={{ color: '#64748b' }}>Hiện không có yêu cầu cấp lại mật khẩu nào đang chờ xử lý.</p>
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: '500' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>mail</span>
                                                    {request.user.email}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge role-${request.user.role.toLowerCase()}`} style={{
                                                    textTransform: 'capitalize',
                                                    padding: '6px 14px',
                                                    fontWeight: '700'
                                                }}>
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
                                                    className="btn-primary btn-hero pulse-primary ultra-glass"
                                                    onClick={() => handleApproveClick(request)}
                                                    disabled={processingId === request.id}
                                                    style={{ 
                                                        margin: '0 auto', 
                                                        padding: '12px 28px', 
                                                        borderRadius: '16px',
                                                        transition: 'all 0.3s'
                                                    }}
                                                >
                                                    {processingId === request.id ? (
                                                        <span className="loader-small"></span>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>verified_user</span>
                                                            PHÊ DUYỆT NGAY
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
