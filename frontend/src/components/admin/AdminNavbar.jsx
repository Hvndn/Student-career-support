import React from 'react';
import '../../assets/css/admin/AdminNavbar.css';

const AdminNavbar = ({ title }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <header className="admin-navbar">
            <div className="navbar-content">
                <div className="admin-navbar-left">
                    <div className="admin-search-container">
                        <span className="material-symbols-outlined search-icon">search</span>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm ứng dụng, công ty..." 
                            className="admin-search-input"
                        />
                    </div>
                </div>
                
                <div className="admin-navbar-right">
                    <div className="admin-status-icons">
                        <button className="status-icon-btn">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="notification-badge"></span>
                        </button>
                        <button className="status-icon-btn">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>

                    <div className="admin-user-info">
                        <div className="admin-user-details">
                            <span className="admin-username">{user?.fullName || 'Alex Rivera'}</span>
                            <span className="admin-role">Quản trị viên cấp cao</span>
                        </div>
                        <div className="admin-avatar">
                            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
