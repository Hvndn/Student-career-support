import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminManagement.css';

const ManageStudent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        studentIdStr: '',
        major: '',
        studentClass: '',
        phone: '',
        active: true
    });

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [statusFilter]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = {
                role: 'student',
                page: 0,
                size: 50 // Get more for management
            };
            if (statusFilter !== 'all') params.active = statusFilter === 'active';

            const res = await adminApi.getUsers(params);
            if (res.data && res.data.data) {
                setStudents(res.data.data.content || []);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách sinh viên:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setModalMode('delete');
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await adminApi.deleteUser(selectedStudent.id);
            alert('Xóa thành công'); // I'll change this to a better toast later if needed, but for now it's okay.
            closeModal();
            fetchStudents();
        } catch (error) {
            alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await adminApi.toggleUserStatus(id);
            fetchStudents();
        } catch (error) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const openModal = async (mode, student) => {
        setModalMode(mode);
        try {
            // Fetch fresh details for view/edit
            const res = await adminApi.getUserDetail(student.id);
            const detail = res.data.data;
            setSelectedStudent(detail);
            setFormData({
                fullName: detail.fullName || '',
                studentIdStr: detail.student?.studentIdStr || '',
                major: detail.student?.major || '',
                studentClass: detail.student?.studentClass || '',
                phone: detail.student?.phone || '',
                active: detail.active
            });
            setIsModalOpen(true);
        } catch (error) {
            alert('Không thể lấy thông tin chi tiết');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddClick = () => {
        setModalMode('add');
        setFormData({
            email: '',
            password: '',
            fullName: '',
            studentIdStr: '',
            major: '',
            studentClass: '',
            phone: '',
            active: true
        });
        setIsModalOpen(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createStudent(formData);
            alert('Thêm sinh viên mới thành công');
            closeModal();
            fetchStudents();
        } catch (error) {
            alert('Lỗi khi thêm: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminApi.updateStudent(selectedStudent.id, formData);
            alert('Cập nhật thành công');
            closeModal();
            fetchStudents();
        } catch (error) {
            alert('Lỗi khi cập nhật: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredStudents = students.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.student?.studentIdStr && s.student.studentIdStr.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý Sinh viên" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <h2 className="management-title">Danh sách Sinh viên</h2>
                    </div>

                    <div className="management-controls">
                        <div className="controls-left">
                            <button className="btn-add-main" onClick={handleAddClick}>
                                <span className="material-symbols-outlined">person_add</span>
                                Thêm sinh viên
                            </button>
                            <button className="btn-add-small">
                                <span className="material-symbols-outlined">file_upload</span>
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
                                    <option value="inactive">Đã khóa</option>
                                </select>
                            </div>
                            <div className="search-wrapper-premium">
                                <input
                                    type="text"
                                    className="search-input-premium"
                                    placeholder="Tìm theo tên, MSSV..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined">search</span>
                            </div>
                        </div>
                    </div>

                    <div className="management-table-container">
                        <div className="management-table-header student-grid">
                            <div>MSSV</div>
                            <div>HỌ VÀ TÊN</div>
                            <div>CHUYÊN NGÀNH</div>
                            <div>LỚP</div>
                            <div>EMAIL</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="loader" style={{ margin: '0 auto' }}></div>
                            </div>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((s) => (
                                <div key={s.id} className="management-card-row student-grid">
                                    <div className="text-cell" style={{ fontWeight: 700, color: '#a31919' }}>
                                        {s.student?.studentIdStr || 'N/A'}
                                    </div>
                                    <div className="info-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="circle-avatar" style={{ backgroundColor: s.active ? '#a31919' : '#94a3b8' }}>
                                            {s.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4>{s.fullName}</h4>
                                            <p>{s.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-cell">{s.student?.major || 'Chưa cập nhật'}</div>
                                    <div className="text-cell">{s.student?.studentClass || 'N/A'}</div>
                                    <div className="contact-cell">
                                        <p>{s.email}</p>
                                        <span>{s.student?.phone || 'Chưa có SĐT'}</span>
                                    </div>
                                    <div className="status-cell" style={{ color: s.active ? '#10b981' : '#ef4444' }}>
                                        <span className="material-symbols-outlined">
                                            {s.active ? 'check_circle' : 'cancel'}
                                        </span>
                                        {s.active ? 'Hoạt động' : 'Đã khóa'}
                                    </div>
                                    <div className="actions-cell">
                                        <button className="action-btn" title="Xem chi tiết" onClick={() => openModal('view', s)}>
                                            <span className="material-symbols-outlined">visibility</span>
                                            Xem
                                        </button>
                                        <button className="action-btn" title="Chỉnh sửa" onClick={() => openModal('edit', s)}>
                                            <span className="material-symbols-outlined">edit</span>
                                            Sửa
                                        </button>
                                        <button className="action-btn delete" title="Xóa" onClick={() => handleDeleteClick(s)}>
                                            <span className="material-symbols-outlined">delete_forever</span>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                Không tìm thấy sinh viên nào
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className={`premium-modal ${modalMode === 'view' ? 'large' : ''}`} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {modalMode === 'view' ? 'Chi tiết sinh viên' :
                                    modalMode === 'edit' ? 'Chỉnh sửa sinh viên' :
                                        modalMode === 'add' ? 'Thêm sinh viên mới' :
                                            'Xác nhận xóa'}
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
                                                    <div className="profile-avatar-large" style={{ backgroundColor: selectedStudent?.active ? '#a31919' : '#94a3b8' }}>
                                                        {selectedStudent?.studentProfile?.avatarUrl ? (
                                                            <img src={selectedStudent.studentProfile.avatarUrl} alt={selectedStudent.fullName} className="avatar-img-premium" />
                                                        ) : (
                                                            selectedStudent?.fullName?.charAt(0)
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`status-badge-under ${selectedStudent?.active ? 'active' : 'inactive'}`}>
                                                    {selectedStudent?.active ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                                                </div>
                                            </div>
                                            <div className="profile-text-info-premium">
                                                <h2 className="profile-name">{selectedStudent?.fullName}</h2>
                                                <p className="profile-email">
                                                    <span className="material-symbols-outlined">mail</span>
                                                    {selectedStudent?.email}
                                                </p>
                                                {selectedStudent?.studentProfile?.studentIdStr && (
                                                    <div className="profile-mssv-badge-premium">
                                                        MSSV: {selectedStudent.studentProfile.studentIdStr}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-content-grid">
                                        {/* Main Info Column */}
                                        <div className="detail-column">
                                            <div className="detail-section">
                                                <h4 className="detail-section-title">Thông tin cơ bản</h4>
                                                <div className="detail-info-list">
                                                    {selectedStudent?.studentProfile?.major && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">school</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Chuyên ngành</span>
                                                                <span className="info-value">{selectedStudent.studentProfile.major}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedStudent?.studentProfile?.studentClass && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">groups</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Lớp</span>
                                                                <span className="info-value">{selectedStudent.studentProfile.studentClass}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedStudent?.studentProfile?.phone && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">phone_iphone</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Số điện thoại</span>
                                                                <span className="info-value">{selectedStudent.studentProfile.phone}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedStudent?.studentProfile?.university && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">apartment</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Trường đại học</span>
                                                                <span className="info-value">{selectedStudent.studentProfile.university}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedStudent?.studentProfile?.gpa && (
                                                        <div className="info-row">
                                                            <span className="info-icon material-symbols-outlined">grade</span>
                                                            <div className="info-content">
                                                                <span className="info-label">Điểm GPA</span>
                                                                <span className="info-value-badge">{selectedStudent.studentProfile.gpa}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Social Links */}
                                            {(selectedStudent?.studentProfile?.linkedinUrl || selectedStudent?.studentProfile?.githubUrl) && (
                                                <div className="detail-section">
                                                    <h4 className="detail-section-title">Mạng xã hội</h4>
                                                    <div className="social-pills">
                                                        {selectedStudent.studentProfile.linkedinUrl && (
                                                            <a href={selectedStudent.studentProfile.linkedinUrl} target="_blank" rel="noreferrer" className="social-pill linkedin">
                                                                <i className="fa-brands fa-linkedin"></i> LinkedIn
                                                            </a>
                                                        )}
                                                        {selectedStudent.studentProfile.githubUrl && (
                                                            <a href={selectedStudent.studentProfile.githubUrl} target="_blank" rel="noreferrer" className="social-pill github">
                                                                <i className="fa-brands fa-github"></i> Github
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Additional Info Column */}
                                        <div className="detail-column">
                                            {selectedStudent?.studentProfile?.bio && (
                                                <div className="detail-section">
                                                    <h4 className="detail-section-title">Giới thiệu bản thân</h4>
                                                    <p className="detail-bio-text">{selectedStudent.studentProfile.bio}</p>
                                                </div>
                                            )}

                                            {selectedStudent?.studentProfile?.skills?.length > 0 && (
                                                <div className="detail-section">
                                                    <h4 className="detail-section-title">Kỹ năng</h4>
                                                    <div className="skill-tags-grid">
                                                        {selectedStudent.studentProfile.skills.map(s => (
                                                            <span key={s.id} className="skill-tag-premium">
                                                                {s.name} <small>({s.level})</small>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Education section */}
                                    {selectedStudent?.studentProfile?.educations?.length > 0 && (
                                        <div className="full-width-section">
                                            <h4 className="detail-section-title">Học vấn</h4>
                                            <div className="detail-timeline">
                                                {selectedStudent.studentProfile.educations.map(e => (
                                                    <div key={e.id} className="timeline-item">
                                                        <div className="timeline-dot"></div>
                                                        <div className="timeline-content">
                                                            <div className="timeline-header">
                                                                <h5>{e.schoolName}</h5>
                                                                <span className="timeline-date">{formatDate(e.startDate)} - {e.endDate ? formatDate(e.endDate) : 'Hiện tại'}</span>
                                                            </div>
                                                            <p className="timeline-sub">{e.major} • {e.degree}</p>
                                                            {e.description && <p className="timeline-desc">{e.description}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Certifications section */}
                                    {selectedStudent?.studentProfile?.certifications?.length > 0 && (
                                        <div className="full-width-section">
                                            <h4 className="detail-section-title">Chứng chỉ & Giải thưởng</h4>
                                            <div className="cert-grid">
                                                {selectedStudent.studentProfile.certifications.map(c => (
                                                    <div key={c.id} className="cert-card-premium">
                                                        <span className="material-symbols-outlined cert-icon">verified</span>
                                                        <div className="cert-info">
                                                            <h5>{c.name}</h5>
                                                            <p>{c.issuer} • {c.issueDate}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (modalMode === 'edit' || modalMode === 'add') ? (
                                <form id="student-form" className="premium-form-view" onSubmit={modalMode === 'add' ? handleAddSubmit : handleUpdateSubmit}>
                                    <div className="form-premium-grid">
                                        {modalMode === 'add' && (
                                            <>
                                                <div className="form-group-premium">
                                                    <label>
                                                        <span className="material-symbols-outlined">mail</span>
                                                        Email đăng nhập <span className="required">*</span>
                                                    </label>
                                                    <div className="input-with-icon">
                                                        <input
                                                            type="email"
                                                            className="premium-input"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleFormChange}
                                                            placeholder="Vd: student@dau.edu.vn"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group-premium">
                                                    <label>
                                                        <span className="material-symbols-outlined">lock</span>
                                                        Mật khẩu <span className="required">*</span>
                                                    </label>
                                                    <div className="input-with-icon">
                                                        <input
                                                            type="password"
                                                            className="premium-input"
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleFormChange}
                                                            placeholder="Tối thiểu 6 ký tự"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">person</span>
                                                Họ và tên <span className="required">*</span>
                                            </label>
                                            <div className="input-with-icon">
                                                <input
                                                    type="text"
                                                    className="premium-input"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleFormChange}
                                                    placeholder="Nhập họ và tên đầy đủ"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">badge</span>
                                                Mã số sinh viên (MSSV)
                                            </label>
                                            <div className="input-with-icon">
                                                <input
                                                    type="text"
                                                    className="premium-input"
                                                    name="studentIdStr"
                                                    value={formData.studentIdStr}
                                                    onChange={handleFormChange}
                                                    placeholder="Vd: SV823765"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">school</span>
                                                Chuyên ngành
                                            </label>
                                            <div className="input-with-icon">
                                                <input
                                                    type="text"
                                                    className="premium-input"
                                                    name="major"
                                                    value={formData.major}
                                                    onChange={handleFormChange}
                                                    placeholder="Vd: Công nghệ thông tin"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">groups</span>
                                                Lớp
                                            </label>
                                            <div className="input-with-icon">
                                                <input
                                                    type="text"
                                                    className="premium-input"
                                                    name="studentClass"
                                                    value={formData.studentClass}
                                                    onChange={handleFormChange}
                                                    placeholder="Vd: 26KT6"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-premium">
                                            <label>
                                                <span className="material-symbols-outlined">phone_iphone</span>
                                                Số điện thoại
                                            </label>
                                            <div className="input-with-icon">
                                                <input
                                                    type="text"
                                                    className="premium-input"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleFormChange}
                                                    placeholder="Vd: 0912345678"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-premium full-width">
                                            <label className="checkbox-label-premium">
                                                <input
                                                    type="checkbox"
                                                    name="active"
                                                    checked={formData.active}
                                                    onChange={handleFormChange}
                                                />
                                                <span className="checkbox-custom"></span>
                                                <div className="checkbox-text">
                                                    <span className="main-text">Tài khoản đang hoạt động</span>
                                                    <span className="sub-text">Cho phép sinh viên này đăng nhập và sử dụng hệ thống</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        backgroundColor: '#fee2e2',
                                        color: '#ef4444',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem'
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>delete_forever</span>
                                    </div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>Xác nhận xóa sinh viên</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                        Bạn có chắc chắn muốn xóa sinh viên <strong>{selectedStudent?.fullName}</strong> vĩnh viễn?
                                        Hành động này không thể hoàn tác.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModal}>Hủy</button>
                            {(modalMode === 'edit' || modalMode === 'add') && (
                                <button type="submit" form="student-form" className="btn-primary">
                                    {modalMode === 'add' ? 'Thêm sinh viên' : 'Lưu thay đổi'}
                                </button>
                            )}
                            {modalMode === 'delete' && (
                                <button onClick={confirmDelete} className="btn-primary" style={{ backgroundColor: '#ef4444' }}>
                                    Xác nhận xóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudent;
