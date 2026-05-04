import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/common/ConfirmModal';
import '../../assets/css/admin/AdminDashboard.css';

const SkillManagement = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingCategory, setEditingCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.paddingTop = '0';
        loadSkills();
        return () => {
            document.body.style.paddingTop = '';
        };
    }, []);

    const loadSkills = async () => {
        try {
            const res = await adminApi.getSkills();
            setSkills(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        if (e) e.preventDefault();
        if (!newSkill.trim()) return;
        try {
            await adminApi.addSkill(newSkill, newCategory || 'General');
            setNewSkill('');
            setNewCategory('');
            setShowAddModal(false);
            loadSkills();
        } catch (err) {
            alert('Thêm ngành nghề thất bại!');
        }
    };

    const handleDelete = (skill) => {
        setSkillToDelete(skill);
        setShowDeleteModal(true);
    };

    const confirmDeleteSkill = async () => {
        if (!skillToDelete) return;
        try {
            await adminApi.deleteSkill(skillToDelete.id);
            setShowDeleteModal(false);
            setSkillToDelete(null);
            loadSkills();
        } catch (err) {
            alert('Xóa thất bại!');
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        if (!editingName.trim()) return;
        try {
            await adminApi.updateSkill(editingId, editingName, editingCategory || 'General');
            setEditingId(null);
            setEditingName('');
            setEditingCategory('');
            loadSkills();
        } catch (err) {
            alert('Cập nhật thất bại!');
        }
    };

    const getIndustryIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('công nghệ') || lowerName.includes('it') || lowerName.includes('phần mềm')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                </div>
            );
        }
        if (lowerName.includes('tài chính') || lowerName.includes('ngân hàng') || lowerName.includes('kinh doanh')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"></path><path d="M3 10h18"></path><path d="M5 6l7-3 7 3"></path><path d="M4 10v11"></path><path d="M20 10v11"></path><path d="M8 14v3"></path><path d="M12 14v3"></path><path d="M16 14v3"></path></svg>
                </div>
            );
        }
        if (lowerName.includes('y tế') || lowerName.includes('dược') || lowerName.includes('bác sĩ')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
            );
        }
        if (lowerName.includes('thiết kế') || lowerName.includes('đồ họa') || lowerName.includes('art')) {
            return (
                <div className="industry-icon-wrapper" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.5 1.5"></path><path d="M7 11l5-5"></path></svg>
                </div>
            );
        }
        return (
            <div className="industry-icon-wrapper" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
        );
    };

    const filteredSkills = skills.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="loading-spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Đang tải dữ liệu...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );

    return (
        <>
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý Ngành nghề" />
                <main className="admin-management-container">
                    <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 className="management-title">Quản lý Ngành nghề</h2>
                            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                                Hệ thống phân loại và cập nhật xu hướng nghề nghiệp Fivecore.
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            style={{ background: '#0d5cda', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 12px rgba(13, 92, 218, 0.25)' }}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Thêm ngành nghề mới
                        </button>
                    </div>

                    <div className="industry-stats-row">
                        <div className="industry-stat-card">
                            <div className="industry-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="11" y2="17"></line></svg>
                            </div>
                            <div className="industry-stat-info">
                                <div className="label">Tổng số ngành nghề</div>
                                <div className="value">{skills.length}</div>
                            </div>
                        </div>
                        <div className="industry-stat-card">
                            <div className="industry-stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><polyline points="17 6 23 6 23 12"></polyline></svg>
                            </div>
                            <div className="industry-stat-info">
                                <div className="label">Ngành hot nhất</div>
                                <div className="value">Công nghệ thông tin</div>
                            </div>
                        </div>
                        <div className="industry-stat-card">
                            <div className="industry-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div className="industry-stat-info">
                                <div className="label">Việc làm mới nhất</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span className="value">120</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>+12%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="industry-table-card">
                        <div className="industry-table-header">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Danh sách ngành nghề</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                    Bộ lọc
                                </button>
                                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Xuất báo cáo
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.8fr', padding: '1rem 2rem', background: '#fafbfc', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <div>Tên ngành nghề</div>
                            <div>Số lượng việc làm</div>
                            <div>Trạng thái</div>
                            <div>Ngày cập nhật</div>
                            <div style={{ textAlign: 'right' }}>Thao tác</div>
                        </div>

                        <div style={{ minHeight: '300px' }}>
                            {filteredSkills.length > 0 ? filteredSkills.map((skill) => (
                                <div key={skill.id} className="industry-row">
                                    <div className="industry-info-cell">
                                        {getIndustryIcon(skill.name)}
                                        <div>
                                            <div className="industry-name-text">{skill.name}</div>
                                            <div className="industry-code-text">Mã: {skill.category?.substring(0, 3).toUpperCase() || 'GEN'}-{String(skill.id).padStart(3, '0')}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>
                                        {Math.floor(Math.random() * 1000) + 100} tin
                                    </div>
                                    <div>
                                        <span className="badge-status badge-active">Đang hoạt động</span>
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        20/10/2023
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => { setEditingId(skill.id); setEditingName(skill.name); setEditingCategory(skill.category || ''); }}
                                            className="action-btn edit"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(skill)}
                                            className="action-btn delete"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                    <p>Không tìm thấy ngành nghề nào phù hợp.</p>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                Hiển thị 1-{filteredSkills.length} của {skills.length} ngành nghề
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>&lt;</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#0d5cda', color: '#fff', fontWeight: 700 }}>1</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>2</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#94a3b8' }}>...</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>5</button>
                                <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>&gt;</button>
                            </div>
                        </div>
                    </div>
                </main>

                {showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal-content-premium">
                            <h2 className="modal-title-premium">Thêm ngành nghề mới</h2>
                            <form onSubmit={handleAdd}>
                                <div className="form-group-premium">
                                    <label className="form-label-premium">Tên ngành nghề</label>
                                    <input 
                                        className="form-input-premium" 
                                        placeholder="Ví dụ: Công nghệ thông tin..."
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label className="form-label-premium">Lĩnh vực (Phân loại)</label>
                                    <input 
                                        className="form-input-premium" 
                                        placeholder="Ví dụ: Kỹ thuật, Kinh doanh.."
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                </div>
                                <div className="modal-actions-premium">
                                    <button type="button" className="btn-premium-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
                                    <button type="submit" className="btn-premium-submit">Thêm ngay</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {editingId && (
                    <div className="modal-overlay">
                        <div className="modal-content-premium">
                            <h2 className="modal-title-premium">Chỉnh sửa ngành nghề</h2>
                            <form onSubmit={handleUpdate}>
                                <div className="form-group-premium">
                                    <label className="form-label-premium">Tên ngành nghề</label>
                                    <input 
                                        className="form-input-premium" 
                                        placeholder="Ví dụ: Công nghệ thông tin..."
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label className="form-label-premium">Lĩnh vực (Phân loại)</label>
                                    <input 
                                        className="form-input-premium" 
                                        placeholder="Ví dụ: Kỹ thuật, Kinh doanh.."
                                        value={editingCategory}
                                        onChange={(e) => setEditingCategory(e.target.value)}
                                    />
                                </div>
                                <div className="modal-actions-premium">
                                    <button type="button" className="btn-premium-cancel" onClick={() => setEditingId(null)}>Hủy</button>
                                    <button type="submit" className="btn-premium-submit">Lưu thay đổi</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>

            <ConfirmModal
                show={showDeleteModal}
                title="Xác nhận xóa ngành nghề"
                message={`Bạn có chắc chắn muốn xóa ngành nghề "${skillToDelete?.name}" không?`}
                onConfirm={confirmDeleteSkill}
                onCancel={() => setShowDeleteModal(false)}
                confirmText="Xác nhận xóa"
                cancelText="Hủy"
                type="danger"
            />
        </>
    );
};

export default SkillManagement;