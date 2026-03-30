import React, { useState, useEffect } from 'react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import { tagService } from '../../utils/tagService';
import toast from 'react-hot-toast';
import '../../assets/css/company/CompanyCandidateTags.css';

const CompanyCandidateTags = () => {
    const [tags, setTags] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#7c3aed');

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = () => {
        const allTags = tagService.getTags();
        // Cập nhật số lượng đếm thực tế từ mapping
        const tagsWithCounts = allTags.map(tag => ({
            ...tag,
            count: tagService.getTagUsageCount(tag.id)
        }));
        setTags(tagsWithCounts);
    };

    const handleAddTag = () => {
        if (!newTagName.trim()) {
            toast.error("Vui lòng nhập tên thẻ");
            return;
        }
        tagService.addTag({
            name: newTagName,
            color: newTagColor,
            auto: 'Thủ công',
            status: true
        });
        setNewTagName('');
        setShowAddModal(false);
        loadTags();
        toast.success("Đã thêm thẻ mới");
    };

    const handleDeleteTag = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này? Mọi liên kết với ứng viên sẽ bị gỡ bỏ.")) {
            tagService.deleteTag(id);
            loadTags();
            toast.success("Đã xóa thẻ");
        }
    };

    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyNavbar title="Ứng viên" />
                <main className="cd-main">
                    <div className="candidate-tags-page">
                        <div className="tags-header">
                            <h2 className="title-with-count">Quản lý thẻ ({tags.length})</h2>
                            <p className="subtitle">Sử dụng thẻ để phân loại và quản lý ứng viên hiệu quả hơn trong quá trình tuyển dụng.</p>
                        </div>

                        <div className="tags-list-card glass">
                            <table className="tags-table">
                                <thead>
                                    <tr>
                                        <th>Thẻ</th>
                                        <th>CV đã gắn</th>
                                        <th>Điều kiện gắn tự động</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tags.map(tag => (
                                        <tr key={tag.id}>
                                            <td>
                                                <span className="tag-badge" style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}40` }}>
                                                    <span className="dot" style={{ backgroundColor: tag.color }}></span>
                                                    {tag.name}
                                                </span>
                                            </td>
                                            <td><span className="count-display">{tag.count} hồ sơ</span></td>
                                            <td><span className="auto-cond">{tag.auto}</span></td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="btn-icon delete" onClick={() => handleDeleteTag(tag.id)} title="Xóa"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tags.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                                Chưa có thẻ nào được tạo.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="tags-actions">
                            <button className="btn-add-tag" onClick={() => setShowAddModal(true)}>
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Thêm thẻ mới
                            </button>
                        </div>

                        {showAddModal && (
                            <div className="tag-modal-overlay" onClick={() => setShowAddModal(false)}>
                                <div className="tag-modal-content glass" onClick={e => e.stopPropagation()}>
                                    <h3>Thêm thẻ mới</h3>
                                    <div className="form-group">
                                        <label>Tên thẻ</label>
                                        <input 
                                            type="text" 
                                            value={newTagName} 
                                            onChange={e => setNewTagName(e.target.value)}
                                            placeholder="Ví dụ: Phỏng vấn sơ loại"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Màu sắc</label>
                                        <div className="color-picker-simple">
                                            {['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#06b6d4'].map(color => (
                                                <div 
                                                    key={color}
                                                    className={`color-option ${newTagColor === color ? 'active' : ''}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setNewTagColor(color)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="modal-actions">
                                        <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
                                        <button className="btn-save" onClick={handleAddTag}>Lưu thẻ</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyCandidateTags;
