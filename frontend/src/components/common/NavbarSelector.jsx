import React from 'react';
import { useLocation } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import StudentNavbar from '../student/StudentNavbar';

const NavbarSelector = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    // Bỏ qua Navbar cho các trang auth, company, admin và student dashboard (dùng sidebar mới)
    if (location.pathname === '/login' || 
        location.pathname === '/register' ||
        location.pathname.startsWith('/company/') || 
        location.pathname.startsWith('/admin/') ||
        location.pathname === '/student/dashboard' ||
        location.pathname === '/student/cv-template' ||
        location.pathname.startsWith('/student/cv-builder/')) {
        return null;
    }

    if (user?.role === 'ROLE_STUDENT') {
        return <StudentNavbar />;
    }
    
    return <PublicNavbar />;
};

export default NavbarSelector;
