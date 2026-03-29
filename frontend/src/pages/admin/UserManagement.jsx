import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await adminApi.getUsers();
            if (res.data.status === 'success') {
                setUsers(res.data.data || []);
            } else {
                console.error('API Business Error:', res.data.message);
            }
            setLoading(false);
        } catch (err) {
            console.error('Fetch users error:', err);
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const res = await adminApi.toggleUserStatus(userId);
            if (res.data.status === 'success') {
                loadUsers(); // Reload to get updated status
            } else {
                alert(res.data.message || 'Cập nhật trạng thái người dùng thất bại!');
            }
        } catch (err) {
            console.error('Toggle status error:', err);
            alert('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải danh sách người dùng...</div>;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý người dùng" />
                <main className="admin-body">
                    <div className="fade-in">
                        <div className="container">
                            <header style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.8rem' }}>
                                    Quản lý <span className="gradient-text">Người dùng</span>
                                </h1>
                                <p style={{ color: 'var(--text-muted)' }}>Kiểm soát và quản trị danh sách tài khoản toàn diện.</p>
                            </header>
                            
                            <div className="card glass" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ 
                                                background: 'rgba(255,255,255,0.03)', 
                                                color: 'var(--text-muted)', 
                                                fontSize: '0.85rem', 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '0.1em'
                                            }}>
                                                <th style={{ padding: '1.2rem 1.5rem' }}>Người dùng</th>
                                                <th style={{ padding: '1.2rem 1.5rem' }}>Email</th>
                                                <th style={{ padding: '1.2rem 1.5rem' }}>Vai trò</th>
                                                <th style={{ padding: '1.2rem 1.5rem' }}>Trạng thái</th>
                                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id} className="fade-in" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                                        <div style={{ fontWeight: '700', color: 'white', fontSize: '1rem' }}>{user.fullName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{user.id}</div>
                                                    </td>
                                                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                                        <span style={{ 
                                                            fontSize: '0.8rem', 
                                                            color: 'var(--primary)', 
                                                            fontWeight: '600',
                                                            background: 'rgba(59, 130, 246, 0.1)',
                                                            padding: '0.3rem 0.8rem',
                                                            borderRadius: '20px'
                                                        }}>{user.role}</span>
                                                    </td>
                                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                                        <span style={{ 
                                                            padding: '0.4rem 1rem', 
                                                            borderRadius: '8px', 
                                                            fontSize: '0.8rem',
                                                            fontWeight: '700',
                                                            background: user.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                            color: user.active ? 'var(--success)' : 'var(--error)',
                                                            border: `1px solid ${user.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                                        }}>
                                                            {user.active ? '● Hoạt động' : '○ Đã khóa'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(user.id)} 
                                                            className="btn glass" 
                                                            style={{ 
                                                                fontSize: '0.85rem', 
                                                                padding: '0.5rem 1.5rem',
                                                                color: user.active ? 'var(--error)' : 'var(--success)',
                                                                borderColor: user.active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'
                                                            }}
                                                        >
                                                            {user.active ? 'Khóa tài khoản' : 'Mở khóa'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {users.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                        Danh sách người dùng trống.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};


export default UserManagement;
