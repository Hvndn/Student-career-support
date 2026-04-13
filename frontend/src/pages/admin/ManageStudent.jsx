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
        academicYear: '',
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
                academicYear: detail.student?.academicYear || '',
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
            academicYear: '',
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
                        <div className="breadcrumb-dau">
                            DAU Connect <span className="separator">›</span> Quản lý sinh viên
                        </div>
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
                            <div>NĂM HỌC</div>
                            <div>EMAIL</div>
                            <div>TRẠNG THÁI</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="loader" style={{margin: '0 auto'}}></div>
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
                                    <div className="text-cell">{s.student?.academicYear || 'N/A'}</div>
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
                    <div className="premium-modal" onClick={e => e.stopPropagation()}>
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
                                <div className="detail-view">
                                    <div className="form-grid">
                                        <div className="detail-item">
                                            <div className="detail-label">Họ và tên</div>
                                            <div className="detail-value">{selectedStudent?.fullName}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">MSSV</div>
                                            <div className="detail-value">{selectedStudent?.studentProfile?.studentIdStr || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Email</div>
                                            <div className="detail-value">{selectedStudent?.email}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">SĐT</div>
                                            <div className="detail-value">{selectedStudent?.studentProfile?.phone || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Chuyên ngành</div>
                                            <div className="detail-value">{selectedStudent?.studentProfile?.major || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Niên khóa</div>
                                            <div className="detail-value">{selectedStudent?.studentProfile?.academicYear || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">GPA / Tín chỉ</div>
                                            <div className="detail-value">
                                                {selectedStudent?.studentProfile?.gpa || '---'} / 
                                                {selectedStudent?.studentProfile?.earnedCredits || '---'} ({selectedStudent?.studentProfile?.totalCredits || '---'})
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Mạng xã hội</div>
                                            <div className="social-links-row">
                                                {selectedStudent?.studentProfile?.linkedinUrl && (
                                                    <a href={selectedStudent.studentProfile.linkedinUrl} target="_blank" rel="noreferrer" className="social-btn linkedin">
                                                        LinkedIn
                                                    </a>
                                                )}
                                                {selectedStudent?.studentProfile?.githubUrl && (
                                                    <a href={selectedStudent.studentProfile.githubUrl} target="_blank" rel="noreferrer" className="social-btn github">
                                                        Github
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="detail-item full-width">
                                            <div className="detail-label">Giới thiệu</div>
                                            <div className="detail-value" style={{ lineHeight: 1.6 }}>{selectedStudent?.studentProfile?.bio || 'Chưa có thông tin'}</div>
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    {selectedStudent?.studentProfile?.skills?.length > 0 && (
                                        <div className="modal-detail-section">
                                            <div className="section-title">
                                                <span className="material-symbols-outlined">psychology</span>
                                                Kỹ năng chuyên môn
                                            </div>
                                            <div className="tags-container">
                                                {selectedStudent.studentProfile.skills.map(s => (
                                                    <span key={s.id} className="pill-tag skill-tag">
                                                        {s.name} <span className="level">({s.level})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education section */}
                                    {selectedStudent?.studentProfile?.educations?.length > 0 && (
                                        <div className="modal-detail-section">
                                            <div className="section-title">
                                                <span className="material-symbols-outlined">school</span>
                                                Lịch sử Học vấn
                                            </div>
                                            <div className="detail-list">
                                                {selectedStudent.studentProfile.educations.map(e => (
                                                    <div key={e.id} className="detail-card">
                                                        <h5>{e.schoolName}</h5>
                                                        <div className="sub-info">
                                                            <span className="timeline-date">{formatDate(e.startDate)} - {e.endDate ? formatDate(e.endDate) : 'Hiện tại'}</span>
                                                            <span>{e.major} ({e.degree})</span>
                                                        </div>
                                                        {e.description && <p className="description">{e.description}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience section */}
                                    {selectedStudent?.studentProfile?.experiences?.length > 0 && (
                                        <div className="modal-detail-section">
                                            <div className="section-title">
                                                <span className="material-symbols-outlined">work</span>
                                                Kinh nghiệm làm việc
                                            </div>
                                            <div className="detail-list">
                                                {selectedStudent.studentProfile.experiences.map(exp => (
                                                    <div key={exp.id} className="detail-card">
                                                        <h5>{exp.jobTitle} - {exp.companyName}</h5>
                                                        <div className="sub-info">
                                                            <span className="timeline-date">{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Hiện tại'}</span>
                                                        </div>
                                                        {exp.description && <p className="description">{exp.description}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Projects section */}
                                    {selectedStudent?.studentProfile?.projects?.length > 0 && (
                                        <div className="modal-detail-section">
                                            <div className="section-title">
                                                <span className="material-symbols-outlined">assignment</span>
                                                Dự án thực hiện
                                            </div>
                                            <div className="detail-list">
                                                {selectedStudent.studentProfile.projects.map(p => (
                                                    <div key={p.id} className="detail-card">
                                                        <h5>{p.name}</h5>
                                                        <div className="sub-info">
                                                            <span>Vai trò: {p.role}</span>
                                                            {p.techStack && <span>Công nghệ: {p.techStack}</span>}
                                                        </div>
                                                        <p className="description">{p.description}</p>
                                                        <div className="social-links-row">
                                                            {p.repositoryUrl && <a href={p.repositoryUrl} className="social-btn github">Repo</a>}
                                                            {p.demoUrl && <a href={p.demoUrl} className="social-btn linkedin">Demo</a>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Languages, Certs, Awards as minor sections */}
                                    <div className="form-grid" style={{ marginTop: '2rem' }}>
                                        {selectedStudent?.studentProfile?.languages?.length > 0 && (
                                            <div className="modal-detail-section" style={{ gridColumn: 'span 1' }}>
                                                <div className="section-title">
                                                    <span className="material-symbols-outlined">language</span>
                                                    Ngoại ngữ
                                                </div>
                                                <div className="tags-container">
                                                    {selectedStudent.studentProfile.languages.map(l => (
                                                        <span key={l.id} className="pill-tag">
                                                            {l.languageName} <span className="level">({l.proficiency})</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedStudent?.studentProfile?.interests?.length > 0 && (
                                            <div className="modal-detail-section" style={{ gridColumn: 'span 1' }}>
                                                <div className="section-title">
                                                    <span className="material-symbols-outlined">favorite</span>
                                                    Sở thích
                                                </div>
                                                <div className="tags-container">
                                                    {selectedStudent.studentProfile.interests.map(i => (
                                                        <span key={i.id} className="pill-tag">{i.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {selectedStudent?.studentProfile?.certifications?.length > 0 && (
                                        <div className="modal-detail-section">
                                            <div className="section-title">
                                                <span className="material-symbols-outlined">verified</span>
                                                Chứng chỉ & Giải thưởng
                                            </div>
                                            <div className="detail-list">
                                                {selectedStudent.studentProfile.certifications.map(c => (
                                                    <div key={c.id} className="detail-card">
                                                        <h5>{c.name}</h5>
                                                        <div className="sub-info">
                                                            <span>Hãng: {c.issuer}</span>
                                                            <span>Ngày cấp: {c.issueDate}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (modalMode === 'edit' || modalMode === 'add') ? (
                                <form id="student-form" onSubmit={modalMode === 'add' ? handleAddSubmit : handleUpdateSubmit}>
                                    <div className="form-grid">
                                        {modalMode === 'add' && (
                                            <>
                                                <div className="form-group">
                                                    <label>Email đăng nhập <span style={{color: 'red'}}>*</span></label>
                                                    <input 
                                                        type="email" 
                                                        className="form-control" 
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleFormChange}
                                                        placeholder="Vd: student@dau.edu.vn"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Mật khẩu <span style={{color: 'red'}}>*</span></label>
                                                    <input 
                                                        type="password" 
                                                        className="form-control" 
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleFormChange}
                                                        placeholder="Tối thiểu 6 ký tự"
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="form-group">
                                            <label>Họ và tên <span style={{color: 'red'}}>*</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>MSSV</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="studentIdStr"
                                                value={formData.studentIdStr}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Chuyên ngành</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="major"
                                                value={formData.major}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Niên khóa</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="academicYear"
                                                value={formData.academicYear}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        {modalMode === 'edit' && (
                                            <>
                                                <div className="form-group">
                                                    <label>SĐT</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleFormChange}
                                                    />
                                                </div>
                                                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        id="active-status"
                                                        name="active"
                                                        checked={formData.active}
                                                        onChange={handleFormChange}
                                                    />
                                                    <label htmlFor="active-status">Đang hoạt động</label>
                                                </div>
                                            </>
                                        )}
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
