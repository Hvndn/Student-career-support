import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';
import '../../assets/css/admin/AdminDashboard.css';

const AdminPasswordRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        document.body.style.paddingTop = '0';
        fetchRequests();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getPasswordRequests();
            setRequests(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách yêu cầu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn cấp mật khẩu mới cho người dùng này? Hệ thống sẽ tự động gửi email thông báo.")) return;

        try {
            setProcessingId(id);
            await adminApi.approvePasswordRequest(id);
            toast.success("Đã cấp lại mật khẩu và gửi email thành công!");
            fetchRequests(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi khi phê duyệt:", error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            
            <div className="admin-main-content">
                <AdminNavbar title="Cấp lại mật khẩu" />
                
                <main className="admin-body">
                    <div className="admin-header-section">
                        <div>
                            <h1 className="admin-title">Yêu cầu Cấp lại Mật khẩu</h1>
                            <p className="admin-subtitle">Danh sách người dùng quên mật khẩu đang chờ quản trị viên phê duyệt.</p>
                        </div>
                    </div>

                    <div className="admin-table-container card fade-in">
                        {loading ? (
                            <div className="loading-spinner">Đang tải dữ liệu...</div>
                        ) : requests.length === 0 ? (
                            <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#94a3b8', marginBottom: '1rem' }}>lock_open</span>
                                <h3 style={{ color: '#1e293b' }}>Không có yêu cầu nào</h3>
                                <p style={{ color: '#64748b' }}>Hiện không có yêu cầu cấp lại mật khẩu nào đang chờ xử lý.</p>
                            </div>
                        ) : (
                            <table className="admin-table">
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
                                    {requests.map((request) => (
                                        <tr key={request.id}>
                                            <td>
                                                <div className="user-info-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="user-avatar-small" style={{ 
                                                        width: '32px', 
                                                        height: '32px', 
                                                        borderRadius: '50%', 
                                                        background: '#7c3aed', 
                                                        color: 'white', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        {request.user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="user-name-text" style={{ fontWeight: '600', color: '#1e293b' }}>{request.user.fullName}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: '#64748b' }}>{request.user.email}</td>
                                            <td>
                                                <span className={`role-badge role-${request.user.role.toLowerCase()}`} style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    backgroundColor: request.user.role === 'student' ? '#e0f2fe' : '#fef3c7',
                                                    color: request.user.role === 'student' ? '#0369a1' : '#92400e'
                                                }}>
                                                    {request.user.role === 'student' ? 'Sinh viên' : 
                                                     request.user.role === 'company' ? 'Doanh nghiệp' : 'Admin'}
                                                </span>
                                            </td>
                                            <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(request.requestDate).toLocaleString('vi-VN')}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button 
                                                    className="btn-action btn-approve"
                                                    onClick={() => handleApprove(request.id)}
                                                    disabled={processingId === request.id}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '8px 16px',
                                                        backgroundColor: '#2563eb',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>key</span>
                                                    {processingId === request.id ? 'Đang cấp...' : 'Cấp mật khẩu'}
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
        </div>
    );
};

export default AdminPasswordRequests;
