import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminManagement.css';

const ManageCompany = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete'
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        name: '',
        industry: '',
        website: '',
        phone: '',
        address: '',
        description: '',
        companySize: '',
        foundingYear: '',
        active: true,
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, [page, statusFilter]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const params = {
                role: 'company',
                page: page,
                size: 8
            };
            if (statusFilter !== 'all') params.active = statusFilter === 'active';
            
            const res = await adminApi.getUsers(params);
            if (res.data && res.data.data) {
                setCompanies(res.data.data.content || []);
                setTotalPages(res.data.data.totalPages || 0);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách doanh nghiệp:", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (mode, companyUser) => {
        setModalMode(mode);
        try {
            const res = await adminApi.getUserDetail(companyUser.id);
            const detail = res.data.data;
            setSelectedCompany(detail);
            
            if (mode === 'edit' || mode === 'view') {
                const profile = detail.companyProfile || {};
                setFormData({
                    fullName: detail.fullName || '',
                    name: profile.name || '',
                    industry: profile.industry || '',
                    website: profile.website || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    description: profile.description || '',
                    companySize: profile.companySize || '',
                    foundingYear: profile.foundingYear || '',
                    active: detail.active
                });
            }
            setIsModalOpen(true);
        } catch (error) {
            alert('Không thể lấy thông tin chi tiết');
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            fullName: '',
            name: '',
            industry: '',
            website: '',
            phone: '',
            address: '',
            description: '',
            companySize: '',
            foundingYear: '',
            active: true,
            email: '',
            password: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminApi.updateCompany(selectedCompany.id, formData);
            alert('Cập nhật thành công');
            closeModal();
            fetchCompanies();
        } catch (error) {
            alert('Lỗi cập nhật: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createCompany(formData);
            alert('Thêm doanh nghiệp thành công');
            closeModal();
            fetchCompanies();
        } catch (error) {
            alert('Lỗi khi thêm doanh nghiệp: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteClick = (company) => {
        setSelectedCompany(company);
        setModalMode('delete');
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await adminApi.deleteUser(selectedCompany.id);
            alert('Xóa doanh nghiệp thành công');
            closeModal();
            fetchCompanies();
        } catch (error) {
            alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredCompanies = companies.filter(c => 
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý doanh nghiệp" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <h2 className="management-title">Danh sách Doanh nghiệp</h2>
                    </div>

                    <div className="management-controls">
                        <div className="controls-left">
                            <button className="btn-add-main" onClick={openAddModal}>
                                <span className="material-symbols-outlined">add_business</span>
                                Thêm doanh nghiệp
                            </button>
                        </div>
                        <div className="controls-right">
                            <div className="filter-group">
                                <select 
                                    className="management-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="active">Đang hoạt động</option>
                                    <option value="locked">Bị khóa</option>
                                </select>
                            </div>
                            <div className="search-wrapper-premium">
                                <input 
                                    type="text" 
                                    className="search-input-premium" 
                                    placeholder="Tìm tên hoặc email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined">search</span>
                            </div>
                        </div>
                    </div>

                    <div className="management-table-container">
                        <div className="management-table-header company-grid">
                            <div>LOGO</div>
                            <div>DOANH NGHIỆP</div>
                            <div>LĨNH VỰC</div>
                            <div>WEBSITE</div>
                            <div>LIÊN HỆ</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="loader" style={{margin: '0 auto'}}></div>
                            </div>
                        ) : filteredCompanies.length > 0 ? (
                            filteredCompanies.map((c) => (
                                <div key={c.id} className="management-card-row company-grid">
                                    <div className="avatar-cell">
                                        <div className="circle-avatar" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
                                            {c.companyProfile?.logoUrl ? (
                                                <img src={c.companyProfile.logoUrl} alt="Logo" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                            ) : (
                                                <span className="material-symbols-outlined">business</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="info-cell">
                                        <h4>{c.fullName}</h4>
                                        <p>{c.email}</p>
                                    </div>
                                    <div className="text-cell">{c.companyProfile?.industry || '---'}</div>
                                    <div className="text-cell">
                                        {c.companyProfile?.website ? (
                                            <a href={c.companyProfile.website} target="_blank" rel="noreferrer" style={{color: '#a31919', fontWeight: 600}}>Xem Website</a>
                                        ) : '---'}
                                    </div>
                                    <div className="contact-cell">
                                        <p>{c.companyProfile?.phone || 'Chưa cập nhật'}</p>
                                    </div>
                                    <div className="status-cell" style={{ color: c.active ? '#10b981' : '#ef4444' }}>
                                        <span className="material-symbols-outlined">{c.active ? 'check_circle' : 'cancel'}</span>
                                        {c.active ? 'Hoạt động' : 'Đã khóa'}
                                    </div>
                                    <div className="actions-cell">
                                        <button className="action-btn" title="Xem chi tiết" onClick={() => openModal('view', c)}>
                                            <span className="material-symbols-outlined">visibility</span>
                                            Xem
                                        </button>
                                        <button className="action-btn" title="Chỉnh sửa" onClick={() => openModal('edit', c)}>
                                            <span className="material-symbols-outlined">edit</span>
                                            Sửa
                                        </button>
                                        <button className="action-btn delete" title="Xóa" onClick={() => handleDeleteClick(c)}>
                                            <span className="material-symbols-outlined">delete_forever</span>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                Không tìm thấy doanh nghiệp nào
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="management-pagination">
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i} 
                                    className={`page-link ${page === i ? 'active' : ''}`}
                                    onClick={() => setPage(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className={`premium-modal ${modalMode === 'view' ? 'large' : ''}`} style={{ maxWidth: modalMode === 'delete' ? '450px' : '' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {modalMode === 'view' ? 'Hồ sơ doanh nghiệp' : 
                                 modalMode === 'edit' ? 'Cập nhật doanh nghiệp' : 
                                 modalMode === 'add' ? 'Thêm doanh nghiệp mới' :
                                 'Xác nhận xóa doanh nghiệp'}
                            </h3>
                            <button className="close-btn" onClick={closeModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {modalMode === 'view' ? (
                                <div className="premium-detail-view">
                                    {/* Profile Header */}
                                    <div className="detail-profile-header">
                                        <div className="profile-banner"></div>
                                        <div className="profile-main-info">
                                            <div className="profile-left-col">
                                                <div className="profile-avatar-wrapper">
                                                    <div className="profile-avatar-large">
                                                        {selectedCompany?.companyProfile?.logoUrl ? (
                                                            <img src={selectedCompany.companyProfile.logoUrl} alt="Logo" className="avatar-img-premium" />
                                                        ) : (
                                                            <span className="material-symbols-outlined" style={{fontSize: '3rem'}}>business</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`status-badge-under ${selectedCompany?.active ? 'active' : 'inactive'}`}>
                                                    {selectedCompany?.active ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                                                </div>
                                            </div>
                                            <div className="profile-text-info-premium">
                                                <h2 className="profile-name">{selectedCompany?.fullName}</h2>
                                                <p className="profile-email">
                                                    <span className="material-symbols-outlined">mail</span>
                                                    {selectedCompany?.email}
                                                </p>
                                                {selectedCompany?.companyProfile?.website && (
                                                    <a href={selectedCompany.companyProfile.website} target="_blank" rel="noreferrer" className="profile-mssv-badge-premium">
                                                        <span className="material-symbols-outlined" style={{fontSize: '18px', verticalAlign: 'middle', marginRight: '6px'}}>language</span>
                                                        Xem Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-content-grid">
                                        <div className="detail-column">
                                            <div className="detail-section">
                                                <h4 className="detail-section-title">Thông tin doanh nghiệp</h4>
                                                <div className="detail-info-list">
                                                    {selectedCompany?.companyProfile?.name && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">domain</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Tên chính thức</span>
                                                                <span className="info-value">{selectedCompany.companyProfile.name}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedCompany?.companyProfile?.industry && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">category</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Lĩnh vực</span>
                                                                <span className="info-value">{selectedCompany.companyProfile.industry}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedCompany?.companyProfile?.companySize && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">groups</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Quy mô</span>
                                                                <span className="info-value">{selectedCompany.companyProfile.companySize}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedCompany?.companyProfile?.foundingYear && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">event</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Năm thành lập</span>
                                                                <span className="info-value">{selectedCompany.companyProfile.foundingYear}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedCompany?.companyProfile?.phone && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">call</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Số điện thoại</span>
                                                                <span className="info-value">{selectedCompany.companyProfile.phone}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-column">
                                            <div className="detail-section">
                                                <h4 className="detail-section-title">Địa chỉ trụ sở</h4>
                                                <div className="info-row" style={{alignItems: 'flex-start'}}>
                                                    <span className="info-icon material-symbols-outlined">location_on</span>
                                                    <div className="info-content">
                                                        <span className="info-value" style={{fontWeight: 500, lineHeight: 1.5}}>
                                                            {selectedCompany?.companyProfile?.address || 'Chưa cập nhật địa chỉ'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="detail-section">
                                                <h4 className="detail-section-title">Giới thiệu doanh nghiệp</h4>
                                                <p className="detail-bio-text">
                                                    {selectedCompany?.companyProfile?.description || 'Chưa có thông tin mô tả chi tiết cho doanh nghiệp này.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (modalMode === 'edit' || modalMode === 'add') ? (
                                <form id="company-form" className="premium-form-view" onSubmit={modalMode === 'edit' ? handleUpdateSubmit : handleAddSubmit}>
                                    <div className="form-premium-grid">
                                        {modalMode === 'add' && (
                                            <>
                                                <div className="form-group-premium">
                                                    <label>
                                                        <span className="material-symbols-outlined">mail</span>
                                                        Email đăng nhập <span className="required">*</span>
                                                    </label>
                                                    <div className="input-with-icon">
                                                        <input type="email" className="premium-input" name="email" value={formData.email} onChange={handleFormChange} placeholder="Vd: contact@company.com" required />
                                                    </div>
                                                </div>
                                                <div className="form-group-premium">
                                                    <label>
                                                        <span className="material-symbols-outlined">lock</span>
                                                        Mật khẩu <span className="required">*</span>
                                                    </label>
                                                    <div className="input-with-icon">
                                                        <input type="password" className="premium-input" name="password" value={formData.password} onChange={handleFormChange} placeholder="Nhập mật khẩu" required />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">person</span>
                                                Tên hiển thị <span className="required">*</span>
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="text" className="premium-input" name="fullName" value={formData.fullName} onChange={handleFormChange} placeholder="Tên hiển thị trên hệ thống" required />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">domain</span>
                                                Tên doanh nghiệp chính thức
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="text" className="premium-input" name="name" value={formData.name} onChange={handleFormChange} placeholder="Tên pháp lý công ty" />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">category</span>
                                                Lĩnh vực hoạt động
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="text" className="premium-input" name="industry" value={formData.industry} onChange={handleFormChange} placeholder="Vd: Công nghệ thông tin" />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">language</span>
                                                Website
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="text" className="premium-input" name="website" value={formData.website} onChange={handleFormChange} placeholder="https://example.com" />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">call</span>
                                                SĐT Liên hệ
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="text" className="premium-input" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Nhập số điện thoại" />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">groups</span>
                                                Quy mô nhân sự
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="text" className="premium-input" name="companySize" value={formData.companySize} onChange={handleFormChange} placeholder="Vd: 50-150 nhân viên" />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">event</span>
                                                Năm thành lập
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="number" className="premium-input" name="foundingYear" value={formData.foundingYear} onChange={handleFormChange} placeholder="Vd: 2010" />
                                            </div>
                                        </div>
                                        <div className="form-group-premium full-width">
                                            <label>
                                                <span className="material-symbols-outlined">location_on</span>
                                                Địa chỉ trụ sở
                                            </label>
                                            <div className="input-with-icon">
                                                <input type="text" className="premium-input" name="address" value={formData.address} onChange={handleFormChange} placeholder="Nhập địa chỉ chi tiết" />
                                            </div>
                                        </div>
                                        <div className="form-group-premium full-width">
                                            <label>
                                                <span className="material-symbols-outlined">description</span>
                                                Mô tả doanh nghiệp
                                            </label>
                                            <textarea className="premium-input" name="description" value={formData.description} onChange={handleFormChange} rows="4" placeholder="Giới thiệu ngắn gọn về doanh nghiệp..."></textarea>
                                        </div>
                                        <div className="form-group-premium full-width">
                                            <label className="checkbox-label-premium">
                                                <input type="checkbox" name="active" checked={formData.active} onChange={handleFormChange} />
                                                <span className="checkbox-custom"></span>
                                                <div className="checkbox-text">
                                                    <span className="main-text">Tài khoản đang hoạt động</span>
                                                    <span className="sub-text">Cho phép doanh nghiệp này đăng tuyển dụng và tìm kiếm ứng viên</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                    <div style={{ width: '64px', height: '64px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyInContent: 'center', margin: '0 auto 1.5rem', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>delete_forever</span>
                                    </div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Xác nhận xóa doanh nghiệp</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                        Bạn có chắc chắn muốn xóa doanh nghiệp <strong>{selectedCompany?.fullName}</strong> vĩnh viễn? 
                                        Dữ liệu bài đăng tuyển dụng và hồ sơ liên quan sẽ bị xóa sạch.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModal}>Hủy</button>
                            {modalMode === 'edit' && (
                                <button type="submit" form="company-form" className="btn-primary">Lưu thay đổi</button>
                            )}
                            {modalMode === 'add' && (
                                <button type="submit" form="company-form" className="btn-primary">Thêm mới</button>
                            )}
                            {modalMode === 'delete' && (
                                <button onClick={confirmDelete} className="btn-primary" style={{ backgroundColor: '#ef4444' }}>Xác nhận xóa</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCompany;
