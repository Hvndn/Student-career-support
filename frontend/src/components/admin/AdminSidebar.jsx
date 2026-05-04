import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/admin/AdminSidebar.css';

const AdminSidebar = () => {
    const location = useLocation();
    
    const [openMenus, setOpenMenus] = useState({
        doanhNghiep: false,
        coVan: false,
        website: false
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <div className="admin-logo-container">
                    <div className="admin-logo-icon">
                        <div className="diamond-logo">
                            <span className="diamond-text"></span>
                        </div>
                    </div>
                    <div className="admin-logo-text">
                        <span className="logo-main">DAU Connect</span>
                    </div>
                </div>
            </div>

            <nav className="admin-sidebar-nav">
                <Link to="/admin/dashboard" className={`admin-nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="item-label">Tổng quan</span>
                </Link>
                
                <Link to="/admin/students" className={`admin-nav-item ${location.pathname === '/admin/students' ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">group</span>
                    <span className="item-label">Sinh viên</span>
                </Link>

                <div className={`nav-group ${openMenus.doanhNghiep ? 'open' : ''}`}>
                    <div className="admin-nav-item parent-item" onClick={() => toggleMenu('doanhNghiep')}>
                        <span className="material-symbols-outlined">business</span>
                        <span className="item-label">Doanh nghiệp</span>
                        <span className="material-symbols-outlined chevron">expand_more</span>
                    </div>
                    <div className="nav-submenu">
                        <Link to="/admin/appointments" className={`admin-nav-item child-item ${location.pathname === '/admin/appointments' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">calendar_today</span>
                            <span className="item-label">Lịch hẹn</span>
                        </Link>
                        <Link to="/admin/companies" className={`admin-nav-item child-item ${location.pathname === '/admin/companies' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">view_list</span>
                            <span className="item-label">Danh sách</span>
                        </Link>
                    </div>
                </div>


                <div className={`nav-group ${openMenus.coVan ? 'open' : ''}`}>
                    <div className="admin-nav-item parent-item" onClick={() => toggleMenu('coVan')}>
                        <span className="material-symbols-outlined">explore</span>
                        <span className="item-label">Cố vấn</span>
                        <span className="material-symbols-outlined chevron">expand_more</span>
                    </div>
                    <div className="nav-submenu">
                        <Link to="/admin/mentors" className={`admin-nav-item child-item ${location.pathname === '/admin/mentors' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">group</span>
                            <span className="item-label">Danh sách cố vấn</span>
                        </Link>
                        <Link to="/admin/mentor-students" className={`admin-nav-item child-item ${location.pathname === '/admin/mentor-students' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">how_to_reg</span>
                            <span className="item-label">Sinh viên đăng ký</span>
                        </Link>
                    </div>
                </div>

                <Link to="/admin/cv-templates" className={`admin-nav-item ${location.pathname === '/admin/cv-templates' ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">grid_view</span>
                    <span className="item-label">Quản lý CV mẫu</span>
                </Link>

                <Link to="/admin/chat" className={`admin-nav-item ${location.pathname === '/admin/chat' ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">chat_bubble_outline</span>
                    <span className="item-label">Trò chuyện</span>
                </Link>

                <Link to="/admin/password-requests" className={`admin-nav-item ${location.pathname === '/admin/password-requests' ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">lock_reset</span>
                    <span className="item-label">Cấp lại mật khẩu</span>
                </Link>

                <div className={`nav-group ${openMenus.website ? 'open' : ''}`}>
                    <div className="admin-nav-item parent-item" onClick={() => toggleMenu('website')}>
                        <span className="material-symbols-outlined">home</span>
                        <span className="item-label">Quản lý Website</span>
                        <span className="material-symbols-outlined chevron">expand_more</span>
                    </div>
                    <div className="nav-submenu">
                        <Link to="/admin/website/slider" className={`admin-nav-item child-item ${location.pathname === '/admin/website/slider' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">image</span>
                            <span className="item-label">Slide trang chủ</span>
                        </Link>
                        <Link to="/admin/website/about" className={`admin-nav-item child-item ${location.pathname === '/admin/website/about' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">web_asset</span>
                            <span className="item-label">Giới thiệu chung</span>
                        </Link>
                        <Link to="/admin/website/news" className={`admin-nav-item child-item ${location.pathname === '/admin/website/news' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">article</span>
                            <span className="item-label">Quản lý tin tức</span>
                        </Link>
                        <Link to="/admin/website/testimonials" className={`admin-nav-item child-item ${location.pathname === '/admin/website/testimonials' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">format_quote</span>
                            <span className="item-label">Quản lý cảm nhận</span>
                        </Link>
                        <Link to="/admin/website/categories" className={`admin-nav-item child-item ${location.pathname === '/admin/website/categories' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">category</span>
                            <span className="item-label">Quản lý danh mục</span>
                        </Link>
                        <Link to="/admin/website/config" className={`admin-nav-item child-item ${location.pathname === '/admin/website/config' ? 'active' : ''}`}>
                            <span className="material-symbols-outlined">language</span>
                            <span className="item-label">Cấu hình</span>
                        </Link>
                    </div>
                </div>

                <Link to="/admin/accounts" className={`admin-nav-item ${location.pathname === '/admin/accounts' ? 'active' : ''}`}>
                    <span className="material-symbols-outlined">person_add</span>
                    <span className="item-label">Tài khoản quản trị</span>
                </Link>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
