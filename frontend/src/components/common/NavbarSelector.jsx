import React from 'react';
import { useLocation } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import StudentNavbar from '../student/StudentNavbar';

const NavbarSelector = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    // Bỏ qua Navbar cho trang login, company và admin vì họ có nav riêng
    if (location.pathname === '/login' || 
        location.pathname.startsWith('/company/') || 
        location.pathname.startsWith('/admin/')) {
        return null;
    }

    if (user?.role === 'ROLE_STUDENT') {
        return <StudentNavbar />;
    }
    
    return <PublicNavbar />;
};

export default NavbarSelector;
