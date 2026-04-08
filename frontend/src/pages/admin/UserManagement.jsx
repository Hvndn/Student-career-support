import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminDashboard.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers(page);
        loadStats();
    }, [page, roleFilter]);

    const loadStats = async () => {
        try {
            const res = await adminApi.getStats();
            setStats(res.data.data);
        } catch (err) {
            console.error('Lấy thống kê thất bại:', err);
        }
    };

    const loadUsers = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const params = { 
                page: pageNumber, 
                size: pageSize 
            };
            if (roleFilter !== 'all') params.role = roleFilter;
            
            const res = await adminApi.getUsers(params);
            const pageData = res.data.data;
            setUsers(pageData.content || []);
            setTotalElements(pageData.totalElements || 0);
            setTotalPages(pageData.totalPages || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        const action = user.active ? 'khóa' : 'mở khóa';
        if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản ${user.fullName}?`)) return;
        try {
            await adminApi.toggleUserStatus(user.id);
            loadUsers(page);
        } catch (err) {
            alert('Cập nhật trạng thái người dùng thất bại!');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminApi.updateUserRole(userId, newRole);
            loadUsers(page);
        } catch (err) {
            alert('Cập nhật vai trò thất bại!');
        }
    };

    const handleViewProfile = async (userId) => {
        setProfileLoading(true);
        try {
            const res = await adminApi.getUserDetail(userId);
            setSelectedUser(res.data.data);
            setShowProfile(true);
        } catch (err) {
            alert('Lấy thông tin chi tiết thất bại!');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await adminApi.deleteUser(userToDelete.id);
            alert('Đã xóa người dùng thành công!');
            loadUsers(page);
            if (selectedUser && selectedUser.id === userToDelete.id) {
                setShowProfile(false);
            }
        } catch (err) {
            console.error('Xóa người dùng thất bại:', err);
            alert('Có lỗi xảy ra khi xóa người dùng!');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
        const index = name ? name.length % colors.length : 0;
        return colors[index];
    };

    const filteredUsers = users.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar />
                <main className="admin-body">
                    <section className="admin-header-section">
                        <div className="header-text">
                            <h1>Quản trị Người dùng</h1>
                            <p>Quản lý quyền truy cập và giám sát hoạt động tài khoản ScholarBridge.</p>
                        </div>
                        <div className="header-actions">
                            <button className="btn-secondary">
                                <span className="material-symbols-outlined">download</span>
                                Xuất CSV
                            </button>
                            <button className="btn-primary">
                                <span className="material-symbols-outlined">person_add</span>
                                Thêm Admin
                            </button>
                        </div>
                    </section>

                    <section className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-header">
                                <div className="metric-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <div className="metric-trend up">
                                    <span className="material-symbols-outlined">trending_up</span>
                                    12.5%
                                </div>
                            </div>
                            <div className="metric-info">
                                <span className="metric-label">Tổng người dùng</span>
                                <h2 className="metric-value">{stats?.totalUsers?.toLocaleString() || '---'}</h2>
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-header">
                                <div className="metric-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                    <span className="material-symbols-outlined">how_to_reg</span>
                                </div>
                                <div className="metric-trend up">
                                    <span className="material-symbols-outlined">trending_up</span>
                                    8.2%
                                </div>
                            </div>
                            <div className="metric-info">
                                <span className="metric-label">Tài khoản hoạt động</span>
                                <h2 className="metric-value">{(stats?.totalUsers - stats?.totalReports || 0).toLocaleString()}</h2>
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-header">
                                <div className="metric-icon" style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
                                    <span className="material-symbols-outlined">report</span>
                                </div>
                                <div className="metric-trend new">
                                    <span className="new-dot"></span>
                                    {stats?.totalReports || 0} mới
                                </div>
                            </div>
                            <div className="metric-info">
                                <span className="metric-label">Bị báo cáo / Vi phạm</span>
                                <h2 className="metric-value">{stats?.totalReports || 0}</h2>
                            </div>
                        </div>
                    </section>

                    <div className="data-panel">
                        <div className="table-header-bar">
                            <h3>Tất cả người dùng</h3>
                            <div className="search-filter-group">
                                <div className="search-input-wrapper">
                                    <span className="material-symbols-outlined">search</span>
                                    <input 
                                        type="text" 
                                        className="search-input" 
                                        placeholder="Tìm tên hoặc email..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select 
                                    className="filter-select"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả vai trò</option>
                                    <option value="student">Sinh viên</option>
                                    <option value="company">Doanh nghiệp</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Người dùng</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tham gia</th>
                                        <th style={{ textAlign: 'right' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>
                                                <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                                                <p style={{ color: '#64748b', fontWeight: 600 }}>Đang tải dữ liệu...</p>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div 
                                                        className="user-info-cell" 
                                                        onClick={() => handleViewProfile(user.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="avatar-round" style={{ backgroundColor: getAvatarColor(user.fullName) }}>
                                                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div className="user-details">
                                                            <h4 className="user-name-link">{user.fullName}</h4>
                                                            <p>{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className={`badge role-${user.role.toLowerCase()}`}
                                                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                                    >
                                                        <option value="student">STUDENT</option>
                                                        <option value="company">COMPANY</option>
                                                        <option value="admin">ADMIN</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.active ? 'status-active' : 'status-locked'}`}>
                                                        <span className={`dot ${user.active ? 'bg-success' : 'bg-danger'}`}></span>
                                                        {user.active ? 'Hoạt động' : 'Bị khóa'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-group">
                                                        <button 
                                                            className="btn-icon" 
                                                            title="Xem chi tiết"
                                                            onClick={() => handleViewProfile(user.id)}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>visibility</span>
                                                        </button>
                                                        <button 
                                                            className="btn-icon" 
                                                            title={user.active ? 'Khóa tài khoản' : 'Mở khóa'}
                                                            onClick={() => handleToggleStatus(user)}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                                                                {user.active ? 'lock' : 'lock_open'}
                                                            </span>
                                                        </button>
                                                        <button 
                                                            className="btn-icon delete" 
                                                            title="Xóa tài khoản"
                                                            onClick={() => handleDelete(user)}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                                Không tìm thấy người dùng phù hợp.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer">
                            <div className="pagination-info">
                                Hiển thị <b>{(page * pageSize) + 1}-{Math.min((page + 1) * pageSize, totalElements)}</b> của <b>{totalElements}</b> người dùng
                            </div>
                            <div className="pagination-controls">
                                <button 
                                    className={`page-link ${page === 0 ? 'disabled' : ''}`}
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i}
                                        className={`page-link ${page === i ? 'active' : ''}`}
                                        onClick={() => setPage(i)}
                                    >
                                        {i + 1}
                                    </button>
                                )).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3))}

                                <button 
                                    className={`page-link ${page >= totalPages - 1 ? 'disabled' : ''}`}
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <footer className="admin-footer">
                        <p>© 2024 ScholarBridge | Bảng quản trị v2.4.0</p>
                        <div className="footer-links">
                            <a href="#">Quyền riêng tư</a>
                            <a href="#">Điều khoản</a>
                            <a href="#">Trợ giúp</a>
                        </div>
                    </footer>
                </main>
            </div>

            {/* Profile Sidebar/Modal Placeholder */}
            {showProfile && selectedUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', width: '90%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
                        <button 
                            onClick={() => setShowProfile(false)} 
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: getAvatarColor(selectedUser.fullName), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
                                {selectedUser.fullName?.charAt(0)}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>{selectedUser.fullName}</h2>
                                <p style={{ color: '#64748b', fontWeight: 500 }}>{selectedUser.email}</p>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                    <span className={`badge role-${selectedUser.role?.toLowerCase()}`}>{selectedUser.role}</span>
                                    <span className={`badge ${selectedUser.active ? 'status-active' : 'status-locked'}`}>
                                        {selectedUser.active ? 'Hoạt động' : 'Đã khóa'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Mã định danh</label>
                                <p style={{ fontWeight: 700, color: '#1e293b' }}>#USR-{selectedUser.id}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Ngày tham gia</label>
                                <p style={{ fontWeight: 700, color: '#1e293b' }}>
                                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                                </p>
                            </div>
                        </div>

                        {/* Detailed Profile Info */}
                        <div className="modal-scroll-area" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px', marginBottom: '2rem' }}>
                            {selectedUser.role?.toLowerCase() === 'student' && selectedUser.studentProfile && (
                                <div className="student-details">
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '2px solid #eff6ff', paddingBottom: '8px' }}>Hồ sơ Học thuật</h4>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Mã sinh viên (MSSV)</label>
                                            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{selectedUser.studentProfile.studentIdStr || '---'}</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Trường Đại học</label>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedUser.studentProfile.university || '---'}</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Chuyên ngành</label>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedUser.studentProfile.major || '---'}</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>GPA / Xếp loại</label>
                                            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#059669' }}>
                                                {selectedUser.studentProfile.gpa || '---'} {selectedUser.studentProfile.classRank ? `• ${selectedUser.studentProfile.classRank}` : ''}
                                            </p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Tín chỉ (Đã đạt/Tổng)</label>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                {selectedUser.studentProfile.earnedCredits || '0'} / {selectedUser.studentProfile.totalCredits || '0'}
                                            </p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Học kỳ / Năm học</label>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                Kỳ {selectedUser.studentProfile.currentTerm || '?'} • Năm {selectedUser.studentProfile.academicYear || '?'}
                                            </p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Năm tốt nghiệp (Dự kiến)</label>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedUser.studentProfile.graduationYear || '---'}</p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {selectedUser.studentProfile.skills && selectedUser.studentProfile.skills.length > 0 && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Kỹ năng chuyên môn</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {selectedUser.studentProfile.skills.map(s => (
                                                    <span key={s.id} style={{ background: '#f5f3ff', color: '#7c3aed', padding: '5px 12px', border: '1px solid #ddd6fe', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        {s.name} {s.level ? `(${s.level})` : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education */}
                                    {selectedUser.studentProfile.educations && selectedUser.studentProfile.educations.length > 0 && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>Lịch sử Học tập</label>
                                            {selectedUser.studentProfile.educations.map(edu => (
                                                <div key={edu.id} style={{ background: 'white', border: '1px solid #f1f5f9', padding: '12px', borderRadius: '12px', marginBottom: '10px' }}>
                                                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{edu.schoolName}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                                        <span>{edu.degree} • {edu.major}</span>
                                                        <span style={{ fontWeight: 600 }}>{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {selectedUser.studentProfile.experiences && selectedUser.studentProfile.experiences.length > 0 && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>Kinh nghiệm làm việc</label>
                                            {selectedUser.studentProfile.experiences.map(exp => (
                                                <div key={exp.id} style={{ background: 'white', border: '1px solid #f1f5f9', padding: '12px', borderRadius: '12px', marginBottom: '10px' }}>
                                                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{exp.companyName}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                                        <span>{exp.jobTitle}</span>
                                                        <span style={{ fontWeight: 600 }}>{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bio */}
                                    {selectedUser.studentProfile.bio && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Giới thiệu chung</label>
                                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', border: '1px dashed #e2e8f0' }}>
                                                {selectedUser.studentProfile.bio}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedUser.role?.toLowerCase() === 'company' && selectedUser.companyProfile && (
                                <div className="company-details">
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '2px solid #eff6ff', paddingBottom: '8px' }}>Hồ sơ Doanh nghiệp</h4>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {selectedUser.companyProfile.logoUrl ? (
                                                <img src={selectedUser.companyProfile.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}>image</span>
                                            )}
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Số điện thoại liên hệ</label>
                                            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{selectedUser.companyProfile.phone || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Trang web chính thức</label>
                                            <a href={selectedUser.companyProfile.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>language</span>
                                                {selectedUser.companyProfile.website || '---'}
                                            </a>
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Địa chỉ trụ sở</label>
                                            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#64748b' }}>location_on</span>
                                                {selectedUser.companyProfile.address || '---'}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedUser.companyProfile.description && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Giới thiệu về doanh nghiệp</label>
                                            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', border: '1px solid #f1f5f9' }}>
                                                {selectedUser.companyProfile.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(!selectedUser.studentProfile && !selectedUser.companyProfile && selectedUser.role?.toLowerCase() !== 'admin') && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>person_off</span>
                                    <p>Người dùng này chưa cập nhật thông tin hồ sơ chi tiết.</p>
                                </div>
                            )}

                            {selectedUser.role?.toLowerCase() === 'admin' && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#4f46e5', background: '#eef2ff', borderRadius: '12px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>admin_panel_settings</span>
                                    <p style={{ fontWeight: 700 }}>Tài khoản Quản trị viên hệ thống</p>
                                    <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Có toàn quyền truy cập các tính năng quản lý.</p>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'stretch' }}>
                            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowProfile(false)}>Đóng</button>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 2, justifyContent: 'center', background: selectedUser.active ? '#ef4444' : '#2563eb' }}
                                onClick={() => { handleToggleStatus(selectedUser); setShowProfile(false); }}
                            >
                                <span className="material-symbols-outlined">{selectedUser.active ? 'lock' : 'lock_open'}</span>
                                {selectedUser.active ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Xóa người dùng (Premium Design) */}
            {showDeleteModal && (
                <div className="modal-overlay active">
                    <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header danger">
                            <h2>
                                <span className="material-symbols-outlined">warning</span> 
                                Xác nhận xóa
                            </h2>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body text-center" style={{ padding: '2rem' }}>
                            <div className="warning-icon-wrapper">
                                <div className="warning-icon-circle">
                                    <span className="material-symbols-outlined">person_remove</span>
                                </div>
                            </div>
                            
                            <p className="warning-text">Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản:</p>
                            
                            <div className="user-delete-info">
                                <h3 className="user-name-delete">{userToDelete?.fullName}</h3>
                                <p className="user-email-delete">{userToDelete?.email}</p>
                            </div>
                            
                            <div className="danger-alert-box">
                                <span className="material-symbols-outlined">info</span>
                                <span>
                                    Hành động này <strong>không thể hoàn tác</strong>. Toàn bộ dữ liệu hồ sơ, đơn ứng tuyển và tin nhắn sẽ bị xóa sạch khỏi hệ hệ thống.
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn-cancel" 
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>cancel</span>
                                Hủy bỏ
                            </button>
                            <button 
                                className="btn-confirm-delete" 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white' }}></div>
                                        Đang xóa...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">delete_forever</span>
                                        Xác nhận xóa
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
