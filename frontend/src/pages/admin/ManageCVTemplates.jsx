import React, { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { getTemplateComponent } from '../../components/student/templates/TemplateRegistry';
import '../../assets/css/admin/AdminManagement.css';
import '../../assets/css/admin/ManageCVTemplates.css';

const ManageCVTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('Tất cả');
    const fileInputRef = useRef(null);
    const snapshotRef = useRef(null);
    const [isRendering, setIsRendering] = useState(false);

    // Dữ liệu mẫu chuyên nghiệp để render ảnh bìa
    const MOCK_CV_DATA = {
        fullName: 'NGUYỄN VĂN A',
        major: 'SOFTWARE ENGINEER',
        phone: '0987 654 321',
        email: 'nguyenvana@gmail.com',
        address: 'Quận 1, TP. Hồ Chí Minh',
        dob: '01/01/1990',
        website: 'linkedin.com/in/nguyenvana',
        bio: 'Kỹ sư phần mềm với hơn 5 năm kinh nghiệm phát triển Web. Chuyên gia về các công nghệ Modern JavaScript, React và Node.js. Đam mê xây dựng các sản phẩm chất lượng cao, có trải nghiệm người dùng tốt và khả năng mở rộng mạnh mẽ.',
        skills: [
            { name: 'JavaScript / ES6+', level: 'Chuyên gia' },
            { name: 'React.js / Redux', level: 'Chuyên gia' },
            { name: 'Node.js / Express', level: 'Nâng cao' },
            { name: 'TypeScript', level: 'Nâng cao' },
            { name: 'SQL & NoSQL', level: 'Nâng cao' }
        ],
        educations: [
            {
                schoolName: 'Đại học Bách Khoa TP.HCM',
                major: 'Kỹ thuật Phần mềm',
                startDate: '2008',
                endDate: '2012',
                description: 'Tốt nghiệp loại Giỏi. Tham gia nghiên cứu khoa học cấp trường.'
            }
        ],
        experiences: [
            {
                companyName: 'FPT Software',
                jobTitle: 'Senior Web Developer',
                startDate: '2015',
                endDate: 'Hiện tại',
                description: 'Dẫn dắt team 5 người phát triển hệ thống quản lý giao dịch lớn.\nTối ưu hóa hiệu năng ứng dụng giảm 30% thời gian tải trang.\nXây dựng kiến trúc frontend có thể tái sử dụng cao.'
            },
            {
                companyName: 'VNG Corporation',
                jobTitle: 'Frontend Developer',
                startDate: '2012',
                endDate: '2015',
                description: 'Phát triển các tính năng mới cho mạng xã hội Zalo.\nLàm việc chặt chẽ với team UI/UX để hiện thực hóa thiết kế.'
            }
        ],
        interests: ['Đọc sách công nghệ', 'Du lịch', 'Chạy bộ'],
        certifications: [
            { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2022' }
        ],
        awards: [
            { name: 'Nhân viên xuất sắc năm 2021', time: '2021', description: 'Ghi nhận những đóng góp vượt bậc cho sự phát triển của dự án A.' }
        ]
    };

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Hiện đại',
        layoutKey: '',
        description: '',
        isActive: true,
        isFeatured: false
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const categories = ['Tất cả', 'Công nghệ thông tin', 'Sáng tạo', 'Kinh doanh', 'Marketing', 'Hiện đại', 'Chuyên nghiệp', 'Đơn giản', 'Ấn tượng', 'Harvard', 'ATS'];
    const layoutKeys = [
        'ARTISTIC_1', 'PRO_1', 'CLASSIC_1', 'CREATIVE_1', 'MODERN_1', 
        'PREMIUM_IT', 'MINIMAL_1', 'MODERN_3', 'CHRONO_1',
        'TECH_STACK_1', 'ELEGANT_1', 'COLORED_TOP_1'
    ];

    const LAYOUT_LABELS = {
        'ARTISTIC_1': 'Nghệ thuật Sáng tạo',
        'PRO_1': 'Chuyên nghiệp Cơ bản',
        'CLASSIC_1': 'Cổ điển Truyền thống',
        'CREATIVE_1': 'Sáng tạo Năng động',
        'MODERN_1': 'Hiện đại Tối giản',
        'PREMIUM_IT': 'IT Cao cấp (Sidebar)',
        'MINIMAL_1': 'Tối giản Tinh tế',
        'MODERN_3': 'Hiện đại (Header Đậm)',
        'CHRONO_1': 'Dòng thời gian (Timeline)',
        'TECH_STACK_1': 'Kỹ thuật Chuyên sâu (Dark)',
        'ELEGANT_1': 'Thanh lịch & Sang trọng',
        'COLORED_TOP_1': 'Header Màu nổi bật'
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (!thumbnailFile) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(thumbnailFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [thumbnailFile]);

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
                isActive: template.active ?? template.isActive,
                isFeatured: template.isFeatured || false
            });
            // Hiển thị preview ảnh cũ từ backend
            if (template.thumbnailUrl) {
                setPreviewUrl(`http://localhost:8080${template.thumbnailUrl}`);
            } else {
                setPreviewUrl(null);
            }
        } else {
            setFormData({
                name: '',
                category: 'Hiện đại',
                layoutKey: '',
                description: '',
                isActive: true,
                isFeatured: false
            });
            setPreviewUrl(null);
        }
        setThumbnailFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAutoRenderThumbnail = async () => {
        if (isRendering) return;

        const Template = getTemplateComponent(formData.layoutKey);
        if (!Template) {
            toast.error('Không tìm thấy Component cho Layout này');
            return;
        }

        setIsRendering(true);
        const loadingToast = toast.loading('Đang chuẩn bị render...');

        try {
            // Đợi một chút để React render component ra vùng ẩn hoàn toàn
            await new Promise(resolve => setTimeout(resolve, 800));

            if (!snapshotRef.current) {
                throw new Error('Không tìm thấy vùng snapshot');
            }

            toast.loading('Đang chụp ảnh preview...', { id: loadingToast });

            const canvas = await html2canvas(snapshotRef.current, {
                useCORS: true,
                scale: 1.5, // Tăng chất lượng một chút nhưng không quá nặng
                logging: false,
                backgroundColor: '#ffffff'
            });

            toast.loading('Đang nén ảnh...', { id: loadingToast });

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
            const file = new File([blob], 'captured-thumb.jpg', { type: 'image/jpeg' });

            // Xóa preview cũ nếu có
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            const preview = URL.createObjectURL(blob);
            setPreviewUrl(preview);
            setThumbnailFile(file);

            toast.success('Đã tự động render ảnh bìa thành công!', { id: loadingToast });
        } catch (error) {
            console.error('Render error:', error);
            toast.error('Lỗi khi render: ' + error.message, { id: loadingToast });
        } finally {
            setIsRendering(false);
        }
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
                            Fivecore <span className="separator">›</span> Quản lý mẫu CV
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
                                        {(t.thumbnailUrl || t.thumbnail) ? (
                                            <img
                                                src={t.thumbnailUrl?.startsWith('/uploads')
                                                    ? `http://localhost:8080${t.thumbnailUrl}`
                                                    : t.thumbnailUrl}
                                                alt={t.name}
                                            />
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
                                        <div className={`status-badge ${(t.active ?? t.isActive) ? 'active' : 'inactive'}`}>
                                            {(t.active ?? t.isActive) ? 'ĐANG BẬT' : 'ĐANG TẮT'}
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
                                                    checked={t.active ?? t.isActive}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStatus(t.id);
                                                    }}
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
                                            className="form-control"
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
                                        <select
                                            name="category"
                                            className="form-control"
                                            value={formData.category}
                                            onChange={handleFormChange}
                                        >
                                            {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Layout Key (Component Gốc)</label>
                                        <select
                                            name="layoutKey"
                                            className="form-control"
                                            value={formData.layoutKey}
                                            onChange={(e) => setFormData({ ...formData, layoutKey: e.target.value })}
                                            required
                                        >
                                            <option value="">Chọn một layout...</option>
                                            {layoutKeys.map(key => (
                                                <option key={key} value={key}>{LAYOUT_LABELS[key] || key}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Ảnh Xem Trước (Thumbnail)</label>
                                    <div className="thumbnail-upload-wrapper">
                                        <div className="thumbnail-upload-box" onClick={() => fileInputRef.current?.click()}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={(e) => setThumbnailFile(e.target.files[0])}
                                                id="thumb-upload"
                                                hidden
                                            />
                                            {previewUrl ? (
                                                <div className="upload-preview-container">
                                                    <img src={previewUrl} alt="Preview" className="thumbnail-img-preview" />
                                                    <div className="preview-overlay">
                                                        <span className="material-symbols-outlined">sync</span>
                                                        <p>Bấm để thay đổi</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <span className="material-symbols-outlined">image</span>
                                                    <p>Tải Thumbnail thủ công</p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="btn-auto-render"
                                            onClick={handleAutoRenderThumbnail}
                                            disabled={isRendering || !formData.layoutKey}
                                        >
                                            <span className={`material-symbols-outlined ${isRendering ? 'spinning' : ''}`}>
                                                {isRendering ? 'sync' : 'auto_fix'}
                                            </span>
                                            {isRendering ? 'ĐANG RENDER...' : 'TỰ ĐỘNG RENDER ẢNH BÌA'}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group featured-toggle">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={handleFormChange}
                                        />
                                        <span className="checkmark"></span>
                                        Đánh dấu đây là Mẫu Nổi Bật ⭐
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Mô tả (Ghi chú)</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows="3"
                                        placeholder="Nhập mô tả chi tiết về mẫu CV này..."
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
            {/* Vùng Render Ảnh Bìa Ẩn (Snapshot Container) */}
            <div className="cv-snapshot-outer">
                <div ref={snapshotRef} className="cv-snapshot-inner">
                    {formData.layoutKey && (
                        React.createElement(getTemplateComponent(formData.layoutKey), {
                            cvData: MOCK_CV_DATA
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCVTemplates;
