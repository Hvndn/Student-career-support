import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../../assets/css/common/Navbar.css';

const PublicNavbar = () => {
    return (
        <nav className="navbar-light">
            <div className="navbar-container">
                <Link to="/" className="brand-logo">
                    Nexus Talent
                </Link>
                <div className="nav-links-container">
                    <NavLink to="/" end className={({ isActive }) => `nav-link-item ${isActive ? 'nav-link-primary active' : 'nav-link-secondary'}`}>Trang chủ</NavLink>
                    <NavLink to="/jobs" className={({ isActive }) => `nav-link-item ${isActive ? 'nav-link-primary active' : 'nav-link-secondary'}`}>Việc làm</NavLink>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="login-link">Đăng nhập</Link>
                    <Link to="/register" className="register-btn-primary">Đăng ký</Link>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
