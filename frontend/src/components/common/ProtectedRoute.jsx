import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Hợp phần bảo vệ Route (Người gác cổng).
 * Kiểm tra xem người dùng đã đăng nhập chưa từ localStorage.
 * Nếu chưa, chuyển hướng về trang /login.
 * Nếu đã đăng nhập nhưng sai vai trò (role), chuyển về trang chủ.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Chưa đăng nhập -> Chuyển đến trang login
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Đã đăng nhập nhưng không đủ quyền hạn -> Chuyển về trang chủ (hoặc trang báo lỗi)
        console.warn(`Truy cập bị từ chối: Yêu cầu ${requiredRole}, nhưng người dùng có ${user.role}`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
