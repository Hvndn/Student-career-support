import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/admin/AdminSidebar.css';

const AdminSidebar = () => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Tổng quan' },
        { path: '/admin/jobs', icon: 'work', label: 'Quản lý việc làm' },
        { path: '/admin/companies/pending', icon: 'domain_verification', label: 'Duyệt doanh nghiệp' },
        { path: '/admin/skills', icon: 'settings_suggest', label: 'Quản lý kỹ năng' },
        { path: '/admin/password-requests', icon: 'lock_reset', label: 'Cấp lại mật khẩu' },
        { path: '/admin/users', icon: 'group', label: 'Quản lý người dùng' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-logo">
                <Link to="/admin/dashboard" className="logo-text">
                    Nexus <span className="highlight">Talent</span>
                </Link>
                <div className="logo-badge">ADMIN</div>
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
                <button onClick={handleLogout} className="admin-logout-btn">
                    <span className="material-symbols-outlined">logout</span>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
