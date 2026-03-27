import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
    const renderNavbar = (route = '/') => {
        return render(
            <MemoryRouter initialEntries={[route]}>
                <Navbar />
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        localStorage.clear();
    });

    test('should not render on /login page', () => {
        const { container } = renderNavbar('/login');
        expect(container).toBeEmptyDOMElement();
    });

    test('should show Login and Register buttons for guest', () => {
        renderNavbar('/');
        expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
        expect(screen.getByText('Đăng ký')).toBeInTheDocument();
    });

    test('should show Student links when ROLE_STUDENT is logged in', () => {
        localStorage.setItem('user', JSON.stringify({
            fullName: 'Nguyen Van Student',
            role: 'ROLE_STUDENT'
        }));
        renderNavbar('/student/profile');
        
        expect(screen.getByText('Nguyen Van Student')).toBeInTheDocument();
        expect(screen.getByText('Thông báo')).toBeInTheDocument();
        expect(screen.getByText('Đơn tuyển')).toBeInTheDocument();
        expect(screen.getByText('Đăng xuất')).toBeInTheDocument();
    });

    test('should show Company links when ROLE_COMPANY is logged in', () => {
        localStorage.setItem('user', JSON.stringify({
            fullName: 'HR Manager',
            role: 'ROLE_COMPANY'
        }));
        // We need to render on a page where the Navbar is visible for companies.
        // E.g., not /company/ as it might be blocked, let's pretend we are on homepage for testing dark glass nav.
        renderNavbar('/some-other-route');
        
        expect(screen.getByText('HR Manager')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Đăng tin')).toBeInTheDocument();
    });
});
