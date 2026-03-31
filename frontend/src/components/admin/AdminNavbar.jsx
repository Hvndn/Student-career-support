import React from 'react';
import '../../assets/css/admin/AdminNavbar.css';

const AdminNavbar = ({ title }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <header className="admin-navbar">
            <div className="admin-navbar-left">
                <h2 className="admin-page-title">{title || 'Admin Dashboard'}</h2>
            </div>
            
            <div className="admin-navbar-right">
                <div className="admin-user-info">
                    <div className="admin-user-details">
                        <span className="admin-username">{user?.fullName || 'Administrator'}</span>
                        <span className="admin-role">System Admin</span>
                    </div>
                    <div className="admin-avatar">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff" alt="Admin" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
