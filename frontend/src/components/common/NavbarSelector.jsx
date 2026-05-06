import React from 'react';
import { useLocation } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import StudentNavbar from '../student/StudentNavbar';

const NavbarSelector = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    // Bỏ qua Navbar cho sinh viên khi đang ở trong các trang có Sidebar (Dashboard, Jobs, Companies, ...)
    // Chỉ hiển thị Navbar ở trang chủ công khai (/)
    if (user?.role === 'ROLE_STUDENT' && location.pathname !== '/') {
        return null;
    }

    // Bỏ qua Navbar cho các trang auth, company và admin
    if (location.pathname === '/login' || 
        location.pathname === '/register' ||
        location.pathname.startsWith('/cv/view/') ||
        location.pathname.startsWith('/company/') || 
        location.pathname.startsWith('/admin/')) {
        return null;
    }

    return <PublicNavbar />;
};

export default NavbarSelector;
