import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import '../../assets/css/admin/AdminManagement.css';
import '../../assets/css/admin/ManageCategories.css';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slug: '',
        status: 'ACTIVE',
        icon: 'category'
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getCategories();
            if (response.data.status === 'success') {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const iconsList = [
        'category', 'window', 'verified', 'domain', 'palette', 'account_balance',
        'engineering', 'architecture', 'construction', 'design_services', 'home_work', 'layers'
    ];

    const handleOpenModal = (category = null, forView = false) => {
        setIsViewMode(forView);
        if (category) {
            setEditingCategory(category);
            setFormData({ ...category });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                slug: '',
                status: 'ACTIVE',
                icon: 'category'
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'name' && !editingCategory) {
                newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const response = await adminApi.updateCategory(editingCategory.id, formData);
                if (response.data.status === 'success') {
                    toast.success('Cập nhật lĩnh vực thành công');
                    fetchCategories();
                }
            } else {
                const response = await adminApi.addCategory(formData);
                if (response.data.status === 'success') {
                    toast.success('Thêm lĩnh vực mới thành công');
                    fetchCategories();
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lĩnh vực này?')) {
            try {
                const response = await adminApi.deleteCategory(id);
                if (response.data.status === 'success') {
                    toast.success('Xóa lĩnh vực thành công');
                    fetchCategories();
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Tổng lĩnh vực', value: categories.length, icon: 'inventory_2', color: 'blue' },
        { label: 'Đang hoạt động', value: categories.filter(c => c.status === 'ACTIVE').length, icon: 'verified', color: 'green' },
        { label: 'Tổng việc làm', value: categories.reduce((sum, c) => sum + (c.jobsCount || 0), 0), icon: 'work', color: 'yellow' }
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý lĩnh vực" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <h2 className="management-title">Quản lý các Lĩnh vực Nghề nghiệp</h2>
                    </div>

                    <div className="stats-grid-categories">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card-premium">
                                <div className={`stat-icon-box ${stat.color}`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <div className="stat-content-premium">
                                    <h3 className="stat-value-large">{stat.value}</h3>
                                    <p className="stat-label-sub">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="management-controls" style={{ marginTop: '2.5rem' }}>
                        <div className="controls-left">
                            <button className="btn-add-main" style={{ borderRadius: '6px', padding: '0.7rem 1.5rem' }} onClick={() => handleOpenModal()}>
                                <span className="material-symbols-outlined">add</span>
                                Thêm mới
                            </button>
                        </div>
                        <div className="controls-right">
                            <div className="search-wrapper-premium" style={{ width: '300px' }}>
                                <input
                                    type="text"
                                    className="search-input-premium"
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    style={{ borderRadius: '8px', paddingRight: '40px' }}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '20px' }}>search</span>
                            </div>
                        </div>
                    </div>

                    <div className="management-table-container" style={{ marginTop: '1.5rem' }}>
                        <div className="management-table-header category-table-grid" style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, padding: '1rem 1.5rem', textTransform: 'uppercase', background: 'transparent', border: 'none' }}>
                            <div>ICON</div>
                            <div>TÊN LĨNH VỰC</div>
                            <div>SLUG</div>
                            <div style={{ textAlign: 'center' }}>VIỆC LÀM</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                                <div className="loading-spinner-simple" style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#0652dd', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <div key={cat.id} className="management-card-row category-table-grid" style={{ marginBottom: '0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                    <div>
                                        <div className="category-icon-cell-small">
                                            <span className="material-symbols-outlined">{cat.icon}</span>
                                        </div>
                                    </div>
                                    <div className="category-name-cell">
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cat.name}</h4>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{cat.description}</p>
                                    </div>
                                    <div className="slug-cell" style={{ color: '#64748b', fontStyle: 'italic' }}>{cat.slug}</div>
                                    <div className="jobs-count-cell" style={{ textAlign: 'center', fontWeight: 700 }}>{cat.jobsCount}</div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className="material-symbols-outlined" style={{ color: cat.status === 'ACTIVE' ? '#84cc16' : '#94a3b8', fontSize: '20px' }}>
                                                {cat.status === 'ACTIVE' ? 'verified' : 'cancel'}
                                            </span>
                                            <span style={{ color: cat.status === 'ACTIVE' ? '#84cc16' : '#94a3b8', fontWeight: 700, fontSize: '0.85rem' }}>
                                                {cat.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="actions-cell" style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                        <button className="action-link-flat" onClick={() => handleOpenModal(cat, true)}>
                                            <span className="material-symbols-outlined">visibility</span>
                                            Xem
                                        </button>
                                        <button className="action-link-flat" onClick={() => handleOpenModal(cat, false)}>
                                            <span className="material-symbols-outlined">edit</span>
                                            Sửa
                                        </button>
                                        <button className="action-link-flat delete-text" onClick={() => handleDelete(cat.id)}>
                                            <span className="material-symbols-outlined">delete</span>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                Không tìm thấy lĩnh vực nào
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="premium-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {isViewMode ? 'Chi tiết lĩnh vực' : (editingCategory ? 'Chỉnh sửa lĩnh vực' : 'Thêm lĩnh vực mới')}
                            </h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group-premium full-width">
                                        <label>
                                            <span className="material-symbols-outlined">category</span>
                                            Tên lĩnh vực <span className="required">*</span>
                                        </label>
                                        <div className="input-with-icon">
                                            <input
                                                type="text"
                                                className="premium-input"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Vd: Công nghệ thông tin..."
                                                required
                                                disabled={isViewMode}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group-premium full-width">
                                        <label>
                                            <span className="material-symbols-outlined">link</span>
                                            Đường dẫn (Slug) <span className="required">*</span>
                                        </label>
                                        <div className="input-with-icon">
                                            <input
                                                type="text"
                                                className="premium-input"
                                                name="slug"
                                                value={formData.slug}
                                                onChange={handleInputChange}
                                                placeholder="cong-nghe-thong-tin"
                                                required
                                                disabled={isViewMode}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group-premium full-width">
                                        <label>
                                            <span className="material-symbols-outlined">description</span>
                                            Mô tả ngắn
                                        </label>
                                        <textarea
                                            className="premium-input"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Mô tả tóm tắt về lĩnh vực này..."
                                            disabled={isViewMode}
                                        ></textarea>
                                    </div>
                                    <div className="form-group-premium">
                                        <label>
                                            <span className="material-symbols-outlined">toggle_on</span>
                                            Trạng thái
                                        </label>
                                        <select
                                            className="premium-input"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            disabled={isViewMode}
                                        >
                                            <option value="ACTIVE">Hoạt động</option>
                                            <option value="INACTIVE">Tạm dừng</option>
                                        </select>
                                    </div>
                                    <div className="form-group-premium">
                                        <label>
                                            <span className="material-symbols-outlined">grid_view</span>
                                            Chọn biểu tượng
                                        </label>
                                        <div className="category-select-icon-premium">
                                            {iconsList.map(icon => (
                                                <div
                                                    key={icon}
                                                    className={`icon-option-premium ${formData.icon === icon ? 'selected' : ''}`}
                                                    onClick={() => !isViewMode && setFormData({ ...formData, icon })}
                                                    style={{ cursor: isViewMode ? 'default' : 'pointer' }}
                                                >
                                                    <span className="material-symbols-outlined">{icon}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {isViewMode && (
                                        <div className="form-group full-width" style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ngày tạo</label>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                                    {formData.createdAt ? new Date(formData.createdAt).toLocaleString('vi-VN') : '---'}
                                                </p>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cập nhật lần cuối</label>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                                    {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString('vi-VN') : '---'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    {isViewMode ? 'Đóng' : 'Hủy'}
                                </button>
                                {!isViewMode && (
                                    <button type="submit" className="btn-primary">
                                        {editingCategory ? 'Lưu thay đổi' : 'Tạo lĩnh vực'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
