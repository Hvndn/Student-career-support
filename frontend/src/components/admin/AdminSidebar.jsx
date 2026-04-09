import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/admin/AdminSidebar.css';

const AdminSidebar = () => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Bảng điều khiển' },
        { path: '/admin/users', icon: 'group', label: 'Quản lý người dùng' },
        { path: '/admin/jobs', icon: 'verified', label: 'Kiểm duyệt việc làm' },
        { path: '/admin/password-requests', icon: 'lock_reset', label: 'Cấp lại mật khẩu' },
        { path: '/admin/reports', icon: 'assessment', label: 'Báo cáo' },
        { path: '/admin/settings', icon: 'settings', label: 'Cài đặt' },
    ];

    const bottomItems = [
        { path: '/admin/status', icon: 'circle_notifications', label: 'Trạng thái hệ thống', status: 'Healthy' },
        { path: '/admin/help', icon: 'help_center', label: 'Trung tâm trợ giúp' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <div className="admin-logo-container">
                    <div className="admin-logo-icon">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div className="admin-logo-text">
                        <span className="logo-main">ScholarBridge</span>
                        <span className="logo-sub">BẢNG ĐIỀU KHIỂN QUẢN TRỊ</span>
                    </div>
                </div>
            </div>

            <nav className="admin-sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="item-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                <div className="admin-bottom-nav">
                    {bottomItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`admin-bottom-item ${item.status ? 'has-status' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <div className="bottom-item-content">
                                <span className="item-label">{item.label}</span>
                                {item.status && <span className="status-badge">Khỏe mạnh</span>}
                            </div>
                        </Link>
                    ))}
                </div>
                <button onClick={handleLogout} className="admin-logout-btn">
                    <span className="material-symbols-outlined">logout</span>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
