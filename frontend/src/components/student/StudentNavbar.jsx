import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../../assets/css/common/Navbar.css';

const StudentNavbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar-light">
            <div className="navbar-container">
                <Link to="/student/dashboard" className="brand-logo">
                    Fivecore
                </Link>
                <div className="nav-links-container">
                    <NavLink to="/student/dashboard" end className={({ isActive }) => `nav-link-item ${isActive ? 'nav-link-primary active' : 'nav-link-secondary'}`}>Trang chủ</NavLink>
                    <NavLink to="/jobs" className={({ isActive }) => `nav-link-item ${isActive ? 'nav-link-primary active' : 'nav-link-secondary'}`}>Việc làm</NavLink>
                    <NavLink to="/student/notifications" className={({ isActive }) => `nav-link-item ${isActive ? 'nav-link-primary active' : 'nav-link-secondary'}`}>Thông báo</NavLink>
                    <NavLink to="/student/applications" className={({ isActive }) => `nav-link-item ${isActive ? 'nav-link-primary active' : 'nav-link-secondary'}`}>Đơn tuyển</NavLink>
                    <NavLink to="/student/profile" className={({ isActive }) => `nav-link-item ${isActive ? 'nav-link-primary active' : 'nav-link-secondary'}`}>Hồ sơ</NavLink>
                </div>
                <div className="nav-actions">
                    <span className="user-name">{user?.fullName}</span>
                    <button onClick={handleLogout} className="logout-btn-outline">
                        Đăng xuất
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default StudentNavbar;
