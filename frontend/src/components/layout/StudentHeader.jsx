import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api';
import ChangePasswordModal from '../../components/student/ChangePasswordModal';
import '../../assets/css/student/StudentHeader.css';

const StudentHeader = () => {
    const [profile, setProfile] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await studentApi.getProfile();
                setProfile(res.data.data);
            } catch (error) {
                console.error('Error fetching profile for header:', error);
            }
        };
        fetchProfile();
    }, []);

    // Breadcrumb Label Mapping
    const getBreadcrumbLabel = (pathname) => {
        if (pathname.includes('/student/dashboard')) return 'Tổng quan';
        if (pathname.includes('/student/profile')) return 'Hồ sơ cá nhân';
        if (pathname.includes('/student/cv-management')) return 'Quản lý CV';
        if (pathname.includes('/student/cv-builder')) return 'Tạo CV / Resume';
        if (pathname.includes('/student/cv-template')) return 'Mẫu CV';
        if (pathname.includes('/student/applications')) return 'Đơn ứng tuyển';
        if (pathname.includes('/student/saved-jobs')) return 'Việc làm yêu thích';
        if (pathname.includes('/student/internships')) return 'Thực tập tốt nghiệp';
        if (pathname.includes('/student/challenges')) return 'Thử thách dự án';
        if (pathname.includes('/student/mentors')) return 'Cố vấn';
        if (pathname.includes('/student/chat')) return 'Trò chuyện';
        if (pathname.includes('/jobs')) return 'Tìm việc làm';
        if (pathname.includes('/companies')) return 'Danh sách công ty';
        return 'DAU Connect';
    };

    const displayName = profile?.fullName || 'Sinh viên';
    const currentLabel = getBreadcrumbLabel(location.pathname);

    return (
        <>
            <header className="dau-top-header">
                <div className="dau-breadcrumb">
                    <Link to="/student/dashboard" className="dau-breadcrumb-prev">DAU Connect</Link>
                    <span className="dau-breadcrumb-sep">›</span>
                    <span className="dau-breadcrumb-current">{currentLabel}</span>
                </div>

                <div className="dau-header-actions">
                    <button className="dau-notif-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        <span className="dau-notif-dot"></span>
                    </button>
                    
                    <div className="dau-user-menu-container" ref={menuRef}>
                        <div 
                            className={`dau-user-avatar ${showUserMenu ? 'active' : ''}`}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <img src={profile?.avatar || "https://ui-avatars.com/api/?name=" + displayName} alt="User" />
                        </div>

                        {showUserMenu && (
                            <div className="dau-user-dropdown-premium fade-in-down">
                                <div className="dau-dropdown-header-premium">
                                    <div className="dau-dropdown-user-info">
                                        <span className="dau-dropdown-name">{displayName}</span>
                                        <span className="dau-dropdown-role">Sinh viên</span>
                                    </div>
                                </div>
                                
                                <div className="dau-dropdown-body-premium">
                                    <Link to="/student/profile" className="dau-dropdown-item-premium" onClick={() => setShowUserMenu(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        Hồ sơ
                                    </Link>
                                    <button 
                                        className="dau-dropdown-item-premium" 
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            setShowPasswordModal(true);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        Đổi mật khẩu
                                    </button>
                                    
                                    <div className="dau-dropdown-divider-premium"></div>
                                    
                                    <button className="dau-dropdown-item-premium dau-logout" onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <ChangePasswordModal 
                show={showPasswordModal} 
                onClose={() => setShowPasswordModal(false)} 
            />
        </>
    );
};

export default StudentHeader;
