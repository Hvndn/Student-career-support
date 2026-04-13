import React from 'react';
import '../../assets/css/admin/AdminNavbar.css';

const AdminNavbar = ({ title }) => {
    // const user = JSON.parse(localStorage.getItem('user'));

    return (
        <header className="admin-navbar">
            <div className="navbar-content">
                <div className="admin-navbar-left">
                    <div className="breadcrumb">
                        <span className="breadcrumb-main">DAU Connect</span>
                        <span className="material-symbols-outlined separator">chevron_right</span>
                        <span className="breadcrumb-page">Trang chủ</span>
                    </div>
                </div>
                
                <div className="admin-navbar-right">
                    <div className="admin-status-icons">
                        <button className="status-icon-btn">
                            <span className="material-symbols-outlined notification-icon">notifications_active</span>
                            <span className="notification-badge"></span>
                        </button>
                    </div>

                    <div className="admin-user-info">
                        <div className="admin-avatar">
                            <img src="https://i.pravatar.cc/150?img=47" alt="Admin" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
