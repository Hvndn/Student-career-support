import React from 'react';
import { useLocation } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import StudentNavbar from '../student/StudentNavbar';

const NavbarSelector = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    // Bỏ qua Navbar hoàn toàn cho sinh viên (vừa xóa Navbar vừa dùng Sidebar mới)
    if (user?.role === 'ROLE_STUDENT') {
        return null;
    }

    // Bỏ qua Navbar cho các trang auth, company và admin
    if (location.pathname === '/login' || 
        location.pathname === '/register' ||
        location.pathname.startsWith('/company/') || 
        location.pathname.startsWith('/admin/')) {
        return null;
    }

    return <PublicNavbar />;
};

export default NavbarSelector;
