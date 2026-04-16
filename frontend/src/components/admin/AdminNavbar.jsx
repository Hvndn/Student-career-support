import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/admin/AdminNavbar.css';
import ChangePasswordModal from './ChangePasswordModal';

const AdminNavbar = ({ title }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <header className="admin-navbar">
            <div className="navbar-content">
                <div className="admin-navbar-left">
                    <div className="breadcrumb">
                        <span className="breadcrumb-main">DAU Connect</span>
                        <span className="material-symbols-outlined separator">chevron_right</span>
                        <span className="breadcrumb-page">{title || 'Trang chủ'}</span>
                    </div>
                </div>
                
                <div className="admin-navbar-right">
                    <div className="admin-status-icons">
                        <button className="status-icon-btn">
                            <span className="material-symbols-outlined notification-icon">notifications_active</span>
                            <span className="notification-badge"></span>
                        </button>
                    </div>

                    <div className="admin-user-info" ref={dropdownRef}>
                        <div className="admin-avatar" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                            <img src="https://i.pravatar.cc/150?img=47" alt="Admin" style={{cursor: 'pointer'}} />
                        </div>

                        {showProfileDropdown && (
                            <div className="admin-profile-dropdown">
                                <div className="dropdown-header">
                                    <h4 className="dropdown-name">{user?.fullName || 'Admin'}</h4>
                                    <span className="dropdown-role">{user?.email || 'admin'}</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => {
                                        setIsPasswordModalOpen(true);
                                        setShowProfileDropdown(false);
                                    }}
                                >
                                    <span className="material-symbols-outlined">lock</span>
                                    Đổi mật khẩu
                                </button>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    <span className="material-symbols-outlined">toggle_off</span>
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isPasswordModalOpen && (
                <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
            )}
        </header>
    );
};

export default AdminNavbar;
