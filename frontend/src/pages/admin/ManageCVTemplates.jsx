import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import toast from 'react-hot-toast';
import '../../assets/css/admin/AdminManagement.css';
import '../../assets/css/admin/ManageCVTemplates.css';

const ManageCVTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('Tất cả');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Hiện đại',
        layoutKey: '',
        description: '',
        isActive: true
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);

    const categories = ['Tất cả', 'Hiện đại', 'Chuyên nghiệp', 'Đơn giản', 'Ấn tượng', 'Harvard', 'ATS'];
    const layoutKeys = [
        'MODERN_1', 'MODERN_2', 'PRO_1', 'PRO_2', 'CLASSIC_1', 'CREATIVE_1', 'HARVARD_1', 'ATS_1'
    ];

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await adminApi.getCvTemplates();
            if (res.data && res.data.success) {
                setTemplates(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách mẫu CV:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, template = null) => {
        setModalMode(mode);
        if (template) {
            setSelectedTemplate(template);
            setFormData({
                name: template.name,
                category: template.category,
                layoutKey: template.layoutKey,
                description: template.description || '',
                isActive: template.active
            });
        } else {
            setFormData({
                name: '',
                category: 'Hiện đại',
                layoutKey: '',
                description: '',
                isActive: true
            });
        }
        setThumbnailFile(null);
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('template', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
        if (thumbnailFile) {
            data.append('thumbnail', thumbnailFile);
        }

        try {
            if (modalMode === 'add') {
                await adminApi.createCvTemplate(data);
                toast.success('Đã tạo mẫu CV mới thành công!');
            } else {
                await adminApi.updateCvTemplate(selectedTemplate.id, data);
                toast.success('Đã cập nhật mẫu CV thành công!');
            }
            fetchTemplates();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Lỗi khi lưu mẫu CV: ' + (error.response?.data?.message || 'Vui lòng kiểm tra lại dữ liệu'));
            console.error(error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await adminApi.toggleCvTemplateStatus(id);
            fetchTemplates();
        } catch (error) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mẫu CV này?')) {
            try {
                await adminApi.deleteCvTemplate(id);
                fetchTemplates();
            } catch (error) {
                alert('Lỗi khi xóa');
            }
        }
    };

    const filteredTemplates = templates.filter(t => 
        categoryFilter === 'Tất cả' || t.category === categoryFilter
    );

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý Mẫu CV" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <div className="breadcrumb-dau">
                            DAU Connect <span className="separator">›</span> Quản lý mẫu CV
                        </div>
                        <h2 className="management-title">Danh sách Mẫu CV</h2>
                    </div>

                    <div className="cv-management-top">
                        <div className="category-tabs">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    className={`category-tab ${categoryFilter === cat ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter(cat)}
                                >
                                    {cat.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <button className="btn-add-main" onClick={() => handleOpenModal('add')}>
                            <span className="material-symbols-outlined">add</span>
                            Thêm mẫu mới
                        </button>
                    </div>

                    {loading ? (
                        <div className="loader-container"><div className="loader"></div></div>
                    ) : (
                        <div className="cv-template-grid">
                            {filteredTemplates.map(t => (
                                <div key={t.id} className="cv-template-card">
                                    <div className="template-preview">
                                        {t.thumbnailUrl && t.thumbnailUrl.startsWith('/') ? (
                                            <img src={t.thumbnailUrl} alt={t.name} />
                                        ) : (
                                            <div className="preview-placeholder">
                                                <span className="material-symbols-outlined">description</span>
                                                <p>{t.name}</p>
                                            </div>
                                        )}
                                        <div className="template-overlay">
                                            <button className="action-circle edit" onClick={() => handleOpenModal('edit', t)}>
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="action-circle delete" onClick={() => handleDelete(t.id)}>
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                        <div className={`status-badge ${t.active ? 'active' : 'inactive'}`}>
                                            {t.active ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                                        </div>
                                    </div>
                                    <div className="template-info">
                                        <div className="template-main-info">
                                            <h4>{t.name}</h4>
                                            <span className="template-cat-tag">{t.category}</span>
                                        </div>
                                        <div className="template-footer">
                                            <code>{t.layoutKey}</code>
                                            <label className="switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={t.active} 
                                                    onChange={() => handleToggleStatus(t.id)} 
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="premium-modal cv-template-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modalMode === 'add' ? 'Thêm Mẫu Mới' : 'Cập Nhật Mẫu CV'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group col-full">
                                        <label>Tên mẫu CV</label>
                                        <input 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            placeholder="Vd: CV Sinh viên IT Hiện đại"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Danh mục</label>
                                        <select name="category" value={formData.category} onChange={handleFormChange}>
                                            {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Layout Key (Component Gốc)</label>
                                        <select name="layoutKey" value={formData.layoutKey} onChange={handleFormChange} required>
                                            <option value="">Chọn một layout...</option>
                                            {layoutKeys.map(k => <option key={k} value={k}>{k}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Ảnh Xem Trước (Thumbnail)</label>
                                    <div className="thumbnail-upload-box">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => setThumbnailFile(e.target.files[0])}
                                            id="thumb-upload"
                                            hidden
                                        />
                                        <label htmlFor="thumb-upload" className="upload-label">
                                            {thumbnailFile ? (
                                                <div className="upload-preview">
                                                    <p>{thumbnailFile.name}</p>
                                                    <span>Bấm để thay đổi</span>
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <span className="material-symbols-outlined">image</span>
                                                    <p>Tải Thumbnail thủ công</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Mô tả (Ghi chú)</label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">
                                    {modalMode === 'add' ? 'Lưu Mẫu CV' : 'Cập Nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCVTemplates;
