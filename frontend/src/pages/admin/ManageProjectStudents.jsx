import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminManagement.css';
import '../../assets/css/admin/ManageProjects.css';

const ManageProjectStudents = () => {
    const [submissions, setSubmissions] = useState([
        {
            id: 1,
            studentName: 'Nguyễn Lê Trường',
            studentId: '19KT123',
            projectTitle: 'Tính toán Kết cấu Nhà 2 tầng',
            projectCategory: 'Cảnh quan',
            submissionTitle: 'Bài nộp của 234222222222...',
            status: 'Đã nộp',
            score: null,
            submissionDate: '09:28 02/02/2026'
        }
    ]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [projectFilter, setProjectFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({
        score: '',
        comment: ''
    });

    const handleOpenGradeModal = (submission) => {
        setSelectedSubmission(submission);
        setGradeData({
            score: submission.score || '',
            comment: submission.comment || ''
        });
        setIsGradeModalOpen(true);
    };

    const handleGradeSubmit = (e) => {
        e.preventDefault();
        setSubmissions(submissions.map(s => 
            s.id === selectedSubmission.id 
            ? { ...s, score: gradeData.score, comment: gradeData.comment, status: 'Đã đánh giá' } 
            : s
        ));
        setIsGradeModalOpen(false);
    };

    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProject = projectFilter === 'all' || s.projectTitle === projectFilter;
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesSearch && matchesProject && matchesStatus;
    });

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Sinh viên tham gia dự án" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <div className="breadcrumb-dau">
                            Fivecore <span className="separator">›</span> Thử thách dự án
                        </div>
                        <h2 className="management-title">Sinh viên tham gia dự án</h2>
                    </div>

                    <div className="management-controls" style={{ justifyContent: 'flex-end' }}>
                        <div className="controls-right" style={{ flexWrap: 'wrap' }}>
                            <div className="filter-group">
                                <select 
                                    className="management-select"
                                    value={projectFilter}
                                    onChange={(e) => setProjectFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả dự án</option>
                                    <option value="Tính toán Kết cấu Nhà 2 tầng">Tính toán Kết cấu Nhà 2 tầng</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <select 
                                    className="management-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="Đã nộp">Đã nộp</option>
                                    <option value="Đã đánh giá">Đã đánh giá</option>
                                </select>
                            </div>
                            <div className="search-wrapper-premium">
                                <input 
                                    type="text" 
                                    className="search-input-premium" 
                                    placeholder="Tìm kiếm theo tên, MSSV..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-symbols-outlined">search</span>
                            </div>
                        </div>
                    </div>

                    <div className="management-table-container">
                        <div className="management-table-header project-students-grid">
                            <div>SINH VIÊN</div>
                            <div>DỰ ÁN</div>
                            <div>TIÊU ĐỀ</div>
                            <div>TRẠNG THÁI</div>
                            <div>ĐIỂM</div>
                            <div>NGÀY NỘP</div>
                            <div style={{ textAlign: 'right' }}>THAO TÁC</div>
                        </div>

                        {filteredSubmissions.length > 0 ? (
                            filteredSubmissions.map((s) => (
                                <div key={s.id} className="management-card-row project-students-grid">
                                    <div className="info-cell">
                                        <h4 style={{ fontWeight: 700 }}>{s.studentName}</h4>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.studentId}</p>
                                    </div>
                                    <div className="info-cell">
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{s.projectTitle}</h4>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.projectCategory}</p>
                                    </div>
                                    <div className="text-cell" style={{ fontSize: '0.85rem' }}>{s.submissionTitle}</div>
                                    <div className="text-cell">
                                        <span className="badge" style={{ backgroundColor: s.status === 'Đã nộp' ? '#dbeafe' : '#ecfdf5', color: s.status === 'Đã nộp' ? '#1e40af' : '#065f46' }}>
                                            {s.status}
                                        </span>
                                    </div>
                                    <div className="text-cell" style={{ fontWeight: 700, textAlign: 'center' }}>
                                        {s.score !== null ? s.score : '-'}
                                    </div>
                                    <div className="text-cell" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                        {s.submissionDate}
                                    </div>
                                    <div className="actions-cell">
                                        <button className="action-link" style={{ color: '#a31919' }}>
                                            <span className="material-symbols-outlined">download</span>
                                            Tải file
                                        </button>
                                        <button className="action-link edit" onClick={() => handleOpenGradeModal(s)}>
                                            <span className="material-symbols-outlined">visibility</span>
                                            Đánh giá
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                Không tìm thấy sinh viên nào tham gia
                            </div>
                        )}
                    </div>
                    
                    <div className="management-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            Hiển thị 1 đến {filteredSubmissions.length} của {filteredSubmissions.length} mục
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

            {/* Modal Đánh giá */}
            {isGradeModalOpen && (
                <div className="modal-overlay" onClick={() => setIsGradeModalOpen(false)}>
                    <div className="premium-modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Đánh giá bài nộp</h3>
                            <button className="close-btn" onClick={() => setIsGradeModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleGradeSubmit}>
                            <div className="modal-body">
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{selectedSubmission?.studentName}</span>
                                        <span style={{ color: '#64748b' }}>MSSV: {selectedSubmission?.studentId}</span>
                                    </div>
                                    <div style={{ color: '#475569', fontSize: '0.9rem' }}>
                                        Dự án: {selectedSubmission?.projectTitle}
                                    </div>
                                </div>
                                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                    <div className="form-group">
                                        <label>Điểm số (0-10)</label>
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            min="0" 
                                            max="10" 
                                            className="form-control" 
                                            name="score" 
                                            value={gradeData.score} 
                                            onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })} 
                                            placeholder="Nhập điểm..."
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Nhận xét</label>
                                        <textarea 
                                            className="form-control" 
                                            name="comment" 
                                            value={gradeData.comment} 
                                            onChange={(e) => setGradeData({ ...gradeData, comment: e.target.value })} 
                                            rows="4"
                                            placeholder="Nhập nhận xét cho sinh viên..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsGradeModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">Lưu đánh giá</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProjectStudents;
