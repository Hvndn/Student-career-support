import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminManagement.css';
import '../../assets/css/admin/ManageCategories.css';

const ManageCategories = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Cảnh quan', description: 'Thiết kế cảnh quan sân vườn...', slug: 'canh-quan', jobsCount: 3, status: 'Active', icon: 'window' },
        { id: 2, name: 'Dự toán / QS', description: 'Lập dự toán, kiểm soát khối l...', slug: 'du-toan-qs', jobsCount: 0, status: 'Active', icon: 'verified' },
        { id: 3, name: 'Giám sát thi công', description: 'Giám sát chất lượng và an to...', slug: 'giam-sat', jobsCount: 0, status: 'Active', icon: 'domain' },
        { id: 4, name: 'Họa viên / BIM', description: 'Triển khai bản vẽ, mô hình th...', slug: 'hoa-vien-bim', jobsCount: 0, status: 'Active', icon: 'palette' },
        { id: 5, name: 'Kiến trúc sư', description: 'Thiết kế kiến trúc công trình...', slug: 'kien-truc-su', jobsCount: 0, status: 'Active', icon: 'account_balance' }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slug: '',
        status: 'Active',
        icon: 'category'
    });

    const iconsList = [
        'category', 'window', 'verified', 'domain', 'palette', 'account_balance', 
        'engineering', 'architecture', 'construction', 'design_services', 'home_work', 'layers'
    ];

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ ...category });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                slug: '',
                status: 'Active',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData, id: c.id, jobsCount: c.jobsCount } : c));
        } else {
            setCategories([...categories, { ...formData, id: Date.now(), jobsCount: 0 }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Tổng danh mục', value: categories.length, icon: 'inventory_2', color: 'blue' },
        { label: 'Đang hoạt động', value: categories.filter(c => c.status === 'Active').length, icon: 'verified', color: 'green' },
        { label: 'Tổng việc làm', value: categories.reduce((sum, c) => sum + (c.jobsCount || 0), 0), icon: 'work', color: 'yellow' }
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý Danh mục" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <h2 className="management-title">Quản lý Danh mục</h2>
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
                            <div>TÊN DANH MỤC</div>
                            <div>SLUG</div>
                            <div style={{ textAlign: 'center' }}>VIỆC LÀM</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {filteredCategories.length > 0 ? (
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
                                            <span className="material-symbols-outlined" style={{ color: '#84cc16', fontSize: '20px' }}>verified</span>
                                            <span style={{ color: '#84cc16', fontWeight: 700, fontSize: '0.85rem' }}>Hoạt động</span>
                                        </div>
                                    </div>
                                    <div className="actions-cell" style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                        <button className="action-link-flat">
                                            <span className="material-symbols-outlined">visibility</span>
                                            Xem
                                        </button>
                                        <button className="action-link-flat" onClick={() => handleOpenModal(cat)}>
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
                                Không tìm thấy danh mục nào
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
                            <h3>{editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Tên danh mục</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            placeholder="Vd: Kiến trúc sư..."
                                            required 
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Đường dẫn (Slug)</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="slug" 
                                            value={formData.slug} 
                                            onChange={handleInputChange} 
                                            placeholder="kien-truc-su"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Mô tả ngắn</label>
                                        <textarea 
                                            className="form-control" 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleInputChange} 
                                            rows="2"
                                            placeholder="Mô tả tóm tắt về danh mục này..."
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Trạng thái</label>
                                        <select 
                                            className="form-control" 
                                            name="status" 
                                            value={formData.status} 
                                            onChange={handleInputChange}
                                        >
                                            <option value="Active">Hoạt động</option>
                                            <option value="Inactive">Tạm dừng</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Chọn biểu tượng</label>
                                        <div className="category-select-icon">
                                            {iconsList.map(icon => (
                                                <div 
                                                    key={icon} 
                                                    className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                                                    onClick={() => setFormData({ ...formData, icon })}
                                                >
                                                    <span className="material-symbols-outlined">{icon}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
