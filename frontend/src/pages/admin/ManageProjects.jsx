import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminManagement.css';
import '../../assets/css/admin/ManageProjects.css';

const ManageProjects = () => {
    const [projects, setProjects] = useState([
        {
            id: 1,
            title: 'Tính toán Kết cấu Nhà 2 tầng',
            category: 'Cảnh quan',
            difficulty: 'Nâng cao',
            status: 'Hoạt động',
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Cảnh quan',
        difficulty: 'Cơ bản',
        status: 'Hoạt động',
        description: '',
        image: ''
    });

    const handleOpenModal = (mode, project = null) => {
        setModalMode(mode);
        if (project) {
            setSelectedProject(project);
            setFormData({
                title: project.title,
                category: project.category,
                difficulty: project.difficulty,
                status: project.status,
                description: project.description || '',
                image: project.image
            });
        } else {
            setFormData({
                title: '',
                category: 'Cảnh quan',
                difficulty: 'Cơ bản',
                status: 'Hoạt động',
                description: '',
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            const newProject = {
                ...formData,
                id: projects.length + 1
            };
            setProjects([...projects, newProject]);
        } else {
            setProjects(projects.map(p => p.id === selectedProject.id ? { ...formData, id: p.id } : p));
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thử thách này?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'Hoạt động').length,
        hidden: projects.filter(p => p.status === 'Đã ẩn').length
    };

    const getDifficultyClass = (diff) => {
        switch (diff) {
            case 'Cơ bản': return 'easy';
            case 'Trung bình': return 'medium';
            case 'Nâng cao': return 'advanced';
            default: return '';
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý Thử thách Dự án" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <div className="breadcrumb-dau">
                            DAU Connect <span className="separator">›</span> Thử thách dự án
                        </div>
                        <h2 className="management-title">Quản lý Thử thách Dự án</h2>
                    </div>

                    <div className="projects-stats-grid">
                        <div className="stat-card">
                            <div className="stat-info">
                                <h3>Tổng thử thách</h3>
                                <div className="stat-value">{stats.total}</div>
                            </div>
                            <div className="stat-icon total">
                                <span className="material-symbols-outlined">track_changes</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <h3>Đang hoạt động</h3>
                                <div className="stat-value">{stats.active}</div>
                            </div>
                            <div className="stat-icon active">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <h3>Đã ẩn</h3>
                                <div className="stat-value">{stats.hidden}</div>
                            </div>
                            <div className="stat-icon hidden">
                                <span className="material-symbols-outlined">error</span>
                            </div>
                        </div>
                    </div>

                    <div className="management-controls">
                        <div className="controls-left">
                            <button className="btn-add-main" onClick={() => handleOpenModal('add')}>
                                <span className="material-symbols-outlined">add</span>
                                Thêm mới
                            </button>
                        </div>
                        <div className="controls-right">
                            <div className="search-wrapper-premium">
                                <input 
                                    type="text" 
                                    className="search-input-premium" 
                                    placeholder="Tìm kiếm thử thách..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined">search</span>
                            </div>
                        </div>
                    </div>

                    <div className="management-table-container">
                        <div className="management-table-header project-table-grid">
                            <div>HÌNH ẢNH</div>
                            <div>TÊN THỬ THÁCH</div>
                            <div>DANH MỤC</div>
                            <div>ĐỘ KHÓ</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((p) => (
                                <div key={p.id} className="management-card-row project-table-grid">
                                    <div className="project-img-cell">
                                        <img src={p.image || 'https://placehold.co/600x400?text=No+Image'} alt="Project" />
                                    </div>
                                    <div className="info-cell">
                                        <h4 style={{ fontWeight: 700 }}>{p.title}</h4>
                                    </div>
                                    <div className="text-cell">{p.category}</div>
                                    <div className="text-cell">
                                        <span className={`badge badge-difficulty ${getDifficultyClass(p.difficulty)}`}>
                                            {p.difficulty}
                                        </span>
                                    </div>
                                    <div className="status-cell">
                                        <span className={`material-symbols-outlined badge-status ${p.status === 'Hoạt động' ? 'active' : 'hidden'}`}>
                                            {p.status === 'Hoạt động' ? 'check_circle' : 'cancel'}
                                        </span>
                                        <span style={{ color: p.status === 'Hoạt động' ? '#10b981' : '#94a3b8' }}>{p.status}</span>
                                    </div>
                                    <div className="actions-cell">
                                        <button className="action-link" title="Xem">
                                            <span className="material-symbols-outlined">visibility</span>
                                            Xem
                                        </button>
                                        <button className="action-link edit" title="Sửa" onClick={() => handleOpenModal('edit', p)}>
                                            <span className="material-symbols-outlined">edit</span>
                                            Sửa
                                        </button>
                                        <button className="action-link delete" title="Xóa" onClick={() => handleDelete(p.id)}>
                                            <span className="material-symbols-outlined">delete</span>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                Không tìm thấy thử thách nào
                            </div>
                        )}
                    </div>
                    
                    <div className="management-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            Hiển thị 1 đến {filteredProjects.length} của {filteredProjects.length} mục
                         </div>
                         <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="btn-add-small" disabled><span className="material-symbols-outlined">keyboard_double_arrow_left</span></button>
                            <button className="btn-add-small" disabled><span className="material-symbols-outlined">chevron_left</span></button>
                            <button className="page-link active">1</button>
                            <button className="btn-add-small" disabled><span className="material-symbols-outlined">chevron_right</span></button>
                            <button className="btn-add-small" disabled><span className="material-symbols-outlined">keyboard_double_arrow_right</span></button>
                         </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="premium-modal project-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modalMode === 'add' ? 'Thêm Thử thách Mới' : 'Cập nhật Thử thách'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Tên thử thách dự án</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="title" 
                                            value={formData.title} 
                                            onChange={handleFormChange} 
                                            placeholder="Vd: Thiết kế hệ thống tưới tiêu tự động"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Danh mục</label>
                                        <select className="form-control" name="category" value={formData.category} onChange={handleFormChange}>
                                            <option value="Cảnh quan">Cảnh quan</option>
                                            <option value="Xây dựng">Xây dựng</option>
                                            <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                                            <option value="Môi trường">Môi trường</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Độ khó</label>
                                        <select className="form-control" name="difficulty" value={formData.difficulty} onChange={handleFormChange}>
                                            <option value="Cơ bản">Cơ bản</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Nâng cao">Nâng cao</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Trạng thái</label>
                                        <select className="form-control" name="status" value={formData.status} onChange={handleFormChange}>
                                            <option value="Hoạt động">Hoạt động</option>
                                            <option value="Đã ẩn">Đã ẩn</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>URL Hình ảnh</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="image" 
                                            value={formData.image} 
                                            onChange={handleFormChange} 
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Mô tả chi tiết</label>
                                        <textarea 
                                            className="form-control" 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleFormChange} 
                                            rows="4"
                                            placeholder="Nhập mô tả về thử thách dự án này..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">
                                    {modalMode === 'add' ? 'Tạo thử thách' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProjects;
