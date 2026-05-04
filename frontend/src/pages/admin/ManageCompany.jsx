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
                        <div className="breadcrumb-dau">
                            Fivecore <span className="separator">›</span> Quản lý doanh nghiệp
                        </div>
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
                    <div className="premium-modal" style={{ maxWidth: modalMode === 'delete' ? '450px' : '750px' }} onClick={e => e.stopPropagation()}>
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
                                <div className="detail-view">
                                    <div className="form-grid">
                                        <div className="detail-item">
                                            <div className="detail-label">Tên hiển thị</div>
                                            <div className="detail-value">{selectedCompany?.fullName}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Tên doanh nghiệp (Hợp đồng)</div>
                                            <div className="detail-value">{selectedCompany?.companyProfile?.name || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Email hệ thống</div>
                                            <div className="detail-value">{selectedCompany?.email}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Số điện thoại</div>
                                            <div className="detail-value">{selectedCompany?.companyProfile?.phone || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Lĩnh vực</div>
                                            <div className="detail-value">{selectedCompany?.companyProfile?.industry || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Website</div>
                                            <div className="detail-value">
                                                {selectedCompany?.companyProfile?.website ? (
                                                    <a href={selectedCompany.companyProfile.website} target="_blank" rel="noreferrer" style={{color: '#a31919'}}>
                                                        {selectedCompany.companyProfile.website}
                                                    </a>
                                                ) : 'N/A'}
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Quy mô</div>
                                            <div className="detail-value">{selectedCompany?.companyProfile?.companySize || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Năm thành lập</div>
                                            <div className="detail-value">{selectedCompany?.companyProfile?.foundingYear || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item full-width">
                                            <div className="detail-label">Địa chỉ trụ sở</div>
                                            <div className="detail-value">{selectedCompany?.companyProfile?.address || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item full-width">
                                            <div className="detail-label">Mô tả doanh nghiệp</div>
                                            <div className="detail-value" style={{lineHeight: 1.6}}>{selectedCompany?.companyProfile?.description || 'Chưa có mô tả'}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (modalMode === 'edit' || modalMode === 'add') ? (
                                <form id="company-form" onSubmit={modalMode === 'edit' ? handleUpdateSubmit : handleAddSubmit}>
                                    <div className="form-grid">
                                        {modalMode === 'add' && (
                                            <>
                                                <div className="form-group">
                                                    <label>Email đăng nhập <span style={{color: 'red'}}>*</span></label>
                                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleFormChange} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Mật khẩu <span style={{color: 'red'}}>*</span></label>
                                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleFormChange} required />
                                                </div>
                                            </>
                                        )}
                                        <div className="form-group">
                                            <label>Tên hiển thị (Tài khoản) <span style={{color: 'red'}}>*</span></label>
                                            <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleFormChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Tên doanh nghiệp chính thức</label>
                                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleFormChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Lĩnh vực</label>
                                            <input type="text" className="form-control" name="industry" value={formData.industry} onChange={handleFormChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Website</label>
                                            <input type="text" className="form-control" name="website" value={formData.website} onChange={handleFormChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>SĐT Liên hệ</label>
                                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleFormChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Quy mô</label>
                                            <input type="text" className="form-control" name="companySize" value={formData.companySize} onChange={handleFormChange} placeholder="Vd: 50-100 nhân viên" />
                                        </div>
                                        <div className="form-group">
                                            <label>Năm thành lập</label>
                                            <input type="number" className="form-control" name="foundingYear" value={formData.foundingYear} onChange={handleFormChange} />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Địa chỉ</label>
                                            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleFormChange} />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Mô tả ngắn</label>
                                            <textarea className="form-control" name="description" value={formData.description} onChange={handleFormChange} rows="3"></textarea>
                                        </div>
                                        {modalMode === 'edit' && (
                                            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                                <input type="checkbox" id="active-status-comp" name="active" checked={formData.active} onChange={handleFormChange} />
                                                <label htmlFor="active-status-comp">Tài khoản đang hoạt động</label>
                                            </div>
                                        )}
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
