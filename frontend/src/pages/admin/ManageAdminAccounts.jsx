import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AddAdminModal from '../../components/admin/AddAdminModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import '../../assets/css/admin/ManageAdminAccounts.css';

const ManageAdminAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);

    useEffect(() => {
        loadAccounts(page);
    }, [page, pageSize]);

    const loadAccounts = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const res = await adminApi.getUsers({
                page: pageNumber,
                size: pageSize,
                role: 'admin' // Filter for admins
            });
            const data = res.data.data;
            setAccounts(data.content || []);
            setTotalElements(data.totalElements || 0);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error('Lấy danh sách admin thất bại:', err);
            toast.error('Không thể tải danh sách tài khoản');
        } finally {
            setLoading(false);
        }
    };

    const handleEditAccount = (account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    const handleDeleteAccount = (account) => {
        setAccountToDelete(account);
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        if (!accountToDelete) return;
        try {
            await adminApi.deleteUser(accountToDelete.id);
            toast.success('Đã xóa tài khoản thành công');
            setShowDeleteModal(false);
            setAccountToDelete(null);
            loadAccounts(page);
        } catch (err) {
            console.error('Lỗi khi xóa admin:', err);
            toast.error('Không thể xóa tài khoản');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAccount(null);
    };

    const filteredAccounts = accounts.filter(acc =>
        acc.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAvatarUrl = (account) => {
        // Mock avatar logic, can be replaced with real data if available
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(account.fullName)}&background=random&color=fff&size=128`;
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar />
                <main className="admin-accounts-container">
                    <div className="breadcrumb">
                        <Link to="/admin/dashboard">Fivecore</Link>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span>Trang chủ</span>
                    </div>

                    <div className="admin-accounts-header">
                        <h1>Quản lý Tài khoản Quản trị</h1>
                        <div className="header-controls">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined search-icon">search</span>
                            </div>
                            <button className="btn-add-account" onClick={() => setIsModalOpen(true)}>
                                <span className="material-symbols-outlined">person_add</span>
                                Thêm tài khoản
                            </button>
                        </div>
                    </div>

                    <div className="accounts-table-header">
                        <div>HÌNH ẢNH</div>
                        <div>HỌ TÊN</div>
                        <div>EMAIL</div>
                        <div>TRẠNG THÁI</div>
                        <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                    </div>

                    <div className="accounts-list">
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                Đang tải dữ liệu...
                            </div>
                        ) : filteredAccounts.length > 0 ? (
                            filteredAccounts.map(account => (
                                <div key={account.id} className="account-card">
                                    <div className="account-avatar-wrapper">
                                        <img src={getAvatarUrl(account)} alt={account.fullName} className="account-avatar" />
                                    </div>
                                    <div className="account-name">{account.fullName}</div>
                                    <div className="account-email">{account.email}</div>
                                    <div>
                                        <span className={`admin-account-badge ${account.active ? 'admin-account-active' : 'admin-account-locked'}`}>
                                            <span className="admin-account-dot"></span>
                                            {account.active ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </div>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-edit-action"
                                            title="Sửa"
                                            onClick={() => handleEditAccount(account)}
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete-action"
                                            title="Xóa"
                                            onClick={() => handleDeleteAccount(account)}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: 'white', borderRadius: '16px' }}>
                                Không tìm thấy tài khoản nào phù hợp
                            </div>
                        )}
                    </div>

                    <div className="table-pagination">
                        <div className="pagination-pages">
                            <button
                                className="btn-page"
                                onClick={() => setPage(0)}
                                disabled={page === 0}
                            >
                                <span className="material-symbols-outlined">keyboard_double_arrow_left</span>
                            </button>
                            <button
                                className="btn-page"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`btn-page ${page === i ? 'active' : ''}`}
                                    onClick={() => setPage(i)}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3))}

                            <button
                                className="btn-page"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                            <button
                                className="btn-page"
                                onClick={() => setPage(totalPages - 1)}
                                disabled={page >= totalPages - 1}
                            >
                                <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
                            </button>
                        </div>

                        <div className="pagination-info">
                            Hiển thị {accounts.length > 0 ? (page * pageSize) + 1 : 0} đến {Math.min((page + 1) * pageSize, totalElements)} của {totalElements} tài khoản
                        </div>

                        <div className="page-size-selector">
                            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: '18px' }}>expand_more</span>
                        </div>
                    </div>
                </main>
            </div>

            <AddAdminModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={() => loadAccounts(page)}
                account={selectedAccount}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Xác nhận xóa tài khoản"
                message={`Bạn có chắc chắn muốn xóa tài khoản quản trị "${accountToDelete?.fullName}" không? Hành động này không thể hoàn tác.`}
                onConfirm={confirmDeleteAccount}
                onCancel={() => setShowDeleteModal(false)}
                confirmText="Xác nhận xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
};

export default ManageAdminAccounts;
