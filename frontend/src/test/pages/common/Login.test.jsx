import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from '../../../pages/common/Login';
import { authApi } from '../../../api';
import { vi } from 'vitest';

// Giả lập (Mock) module api
vi.mock('../../../api', () => ({
    authApi: {
        login: vi.fn(),
    },
}));

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderLogin = () => {
        return render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/company/dashboard" element={<div>Company Dashboard</div>} />
                    <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    test('should render email and password inputs', () => {
        renderLogin();
        expect(screen.getByText(/Email của bạn/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
    });

    test('should show error message on failed login', async () => {
        authApi.login.mockRejectedValueOnce(new Error('Network Error'));

        renderLogin();
        
        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'wrong@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        await waitFor(() => {
            expect(screen.getByText('Sai email hoặc mật khẩu!')).toBeInTheDocument();
        });
    });

    test('should display API error message if status is not success', async () => {
        authApi.login.mockResolvedValueOnce({
            data: { status: 'error', message: 'Tài khoản không tồn tại' }
        });

        renderLogin();
        
        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'notfound@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        await waitFor(() => {
            expect(screen.getByText('Tài khoản không tồn tại')).toBeInTheDocument();
        });
    });

    test('should navigate to home on STUDENT login', async () => {
        authApi.login.mockResolvedValueOnce({
            data: { status: 'success', data: { email: 'st@test.com', role: 'ROLE_STUDENT' } }
        });

        renderLogin();
        
        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'st@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });
        expect(localStorage.getItem('user')).toBeTruthy();
    });

    test('should navigate to company dashboard on COMPANY login', async () => {
        authApi.login.mockResolvedValueOnce({
            data: { status: 'success', data: { email: 'hr@test.com', role: 'ROLE_COMPANY' } }
        });

        renderLogin();
        
        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'hr@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        await waitFor(() => {
            expect(screen.getByText('Company Dashboard')).toBeInTheDocument();
        });
    });
});
