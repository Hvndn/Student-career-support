import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/common/Navbar.css';

const PublicNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate(`/#${id}`);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar-light">
            <div className="navbar-container">
                <Link to="/" className="brand-logo" onClick={() => scrollToSection('home')}>
                    Fivecore
                </Link>
                <div className="nav-links-container">
                    <button onClick={() => scrollToSection('home')} className="nav-link-btn">Trang chủ</button>
                    <button onClick={() => scrollToSection('categories')} className="nav-link-btn">Danh mục</button>
                    <button onClick={() => scrollToSection('events')} className="nav-link-btn">Sự kiện</button>
                    <button onClick={() => scrollToSection('news')} className="nav-link-btn">Tin tức</button>
                    <button onClick={() => scrollToSection('testimonials')} className="nav-link-btn">Cảm nhận</button>
                    <button onClick={() => scrollToSection('support')} className="nav-link-btn">Hỗ trợ</button>
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
