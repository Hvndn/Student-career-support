import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { studentApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/student/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Consolidated Edit State
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});

    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectForm, setProjectForm] = useState({ name: '', role: '', technologies: '', startDate: '', endDate: '', description: '', responsibilities: '', repositoryUrl: '', demoUrl: '' });
    const [skillName, setSkillName] = useState('');
    const [skillLevel, setSkillLevel] = useState('intermediate');

    const flash = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

    const reload = () => studentApi.getProfile().then(res => {
        setProfile(res.data.data);
    });

    useEffect(() => {
        studentApi.getProfile()
            .then(res => { 
                setProfile(res.data.data); 
                setLoading(false); 
            })
            .catch(() => setLoading(false));
    }, []);

    const openEdit = () => {
        setForm({ 
            fullName: profile.fullName || '', 
            studentIdStr: profile.studentIdStr || '',
            academicYear: profile.academicYear || '',
            major: profile.major || '', 
            bio: profile.bio || '',
            phone: profile.phone || '',
            email: profile.email || '',
            address: profile.address || '',
            gpa: profile.gpa || '',
            githubUrl: profile.githubUrl || '',
            linkedinUrl: profile.linkedinUrl || ''
        });
        setEditMode(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await studentApi.updateProfile(form);
            await reload();
            setEditMode(false);
            flash('✅ Cập nhật hồ sơ thành công!');
        } catch { flash('❌ Lỗi khi cập nhật.'); }
        setSaving(false);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatarFile', file);
        setIsUploading(true);
        try {
            await studentApi.updateAvatar(formData);
            await reload();
            flash('✅ Cập nhật ảnh đại diện thành công!');
        } catch { flash('❌ Lỗi khi tải ảnh lên.'); }
        setIsUploading(false);
    };

    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file size (e.g., max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            return flash('⚠️ Video quá lớn (Tối đa 50MB)');
        }

        const formData = new FormData();
        formData.append('videoFile', file);
        setIsUploading(true);
        try {
            await studentApi.updateVideo(formData);
            await reload();
            flash('✅ Cập nhật video giới thiệu thành công!');
        } catch { flash('❌ Lỗi khi tải video lên.'); }
        setIsUploading(false);
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') return flash('⚠️ Vui lòng tải lên file PDF');
        if (file.size > 10 * 1024 * 1024) return flash('⚠️ File quá lớn (Tối đa 10MB)');
        
        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        try {
            await studentApi.uploadResume(formData);
            await reload();
            flash('✅ Đính kèm CV thành công!');
        } catch { flash('❌ Lỗi khi đính kèm CV.'); }
        setIsUploading(false);
    };



    const handleAddSkill = async () => {
        if (!skillName) return flash('⚠️ Nhập tên kỹ năng');
        setSaving(true);
        try {
            await studentApi.addSkill(skillName, skillLevel);
            await reload();
            setShowSkillForm(false);
            setSkillName('');
            flash('✅ Đã thêm kỹ năng!');
        } catch { flash('❌ Lỗi khi thêm.'); }
        setSaving(false);
    };

    const handleDeleteSkill = async (id) => {
        if (!window.confirm('Xóa kỹ năng này?')) return;
        try {
            await studentApi.deleteSkill(id);
            await reload();
            flash('✅ Đã xóa kỹ năng.');
        } catch { flash('❌ Lỗi khi xóa.'); }
    };

    const handleAddProject = async () => {
        if (!projectForm.name) return flash('⚠️ Tên dự án là bắt buộc');
        setSaving(true);
        try {
            await studentApi.addProject(projectForm);
            await reload();
            setShowProjectForm(false);
            setProjectForm({ name: '', role: '', technologies: '', startDate: '', endDate: '', description: '', responsibilities: '', repositoryUrl: '', demoUrl: '' });
            flash('✅ Đã thêm dự án!');
        } catch { flash('❌ Lỗi khi thêm.'); }
        setSaving(false);
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Xóa dự án này?')) return;
        try {
            await studentApi.deleteProject(id);
            await reload();
            flash('✅ Đã xóa dự án.');
        } catch { flash('❌ Lỗi khi xóa.'); }
    };

    if (loading) return <div className="pf-loading">Đang tải hồ sơ...</div>;
    if (!profile) return <div className="pf-error">Không tìm thấy hồ sơ!</div>;

    const QUILL_MODULES = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <div className="pf-profile-wrapper">
            {/* Toast Notification */}
                {message && (
                    <div className={`pf-toast ${message.startsWith('✅') ? 'is-success' : 'is-error'}`}>
                        {message}
                    </div>
                )}

                {/* Premium Banner */}

                {/* Premium Banner */}
                <div className="pf-premium-banner">
                    <div className="pf-banner-overlay"></div>
                    {profile.coverImageUrl ? (
                        <img src={getImageUrl(profile.coverImageUrl)} alt="Banner" className="pf-banner-img" />
                    ) : (
                        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" alt="Banner" className="pf-banner-img" />
                    )}
                    <button className="pf-btn-banner-edit" onClick={openEdit}>
                        <span className="material-symbols-outlined">edit_note</span>
                        Chỉnh sửa hồ sơ
                    </button>
                </div>

                {/* Header Info Card */}
                <div className="pf-modern-header">
                    <div className="pf-header-left">
                        <div className="pf-header-avatar">
                            <img 
                                src={profile.avatarUrl ? getImageUrl(profile.avatarUrl) : `https://ui-avatars.com/api/?name=${profile.fullName}&size=200`} 
                                alt="Avatar" 
                                className="pf-avatar-img"
                            />
                        </div>
                        <div className="pf-user-id">
                            <span className="pf-major-tag">{profile.major || 'Kiến Trúc'}</span>
                            <h2>{profile.fullName}</h2>
                            <div className="pf-class-info">
                                Lớp: {profile.academicYear || '26kt6'} &nbsp; - &nbsp; MSSV: {profile.studentIdStr || '19KT123'}
                            </div>
                        </div>
                    </div>

                    <div className="pf-header-center">
                        <h4>Thông tin liên lạc</h4>
                        <div className="pf-contact-grid">
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">mail</span></div>
                                <span>{profile.email || 'n/a'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">call</span></div>
                                <span>{profile.phone || 'n/a'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">location_on</span></div>
                                <span>{profile.address || 'Hòa Xuân, Cẩm Lệ'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">globe</span></div>
                                <span>{profile.githubUrl || 'dau.edu.vn'}</span>
                            </div>
                            <div className="pf-contact-item">
                                <div className="pf-contact-icon"><span className="material-symbols-outlined">person</span></div>
                                <span>{profile.linkedinUrl || 'nl_truong'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pf-header-right">
                        <div className="pf-stat-box">
                            <span className="pf-stat-val">{profile.gpa || '0.00'}</span>
                            <span className="pf-stat-lbl">GPA</span>
                        </div>
                        <div className="pf-stat-box">
                            <span className="pf-stat-val">{profile.projects?.length || 0}</span>
                            <span className="pf-stat-lbl">DỰ ÁN</span>
                        </div>
                        <div className="pf-stat-box">
                            <span className="pf-stat-val">{ (profile.cvData || profile.resumeUrl) ? 1 : 0 }</span>
                            <span className="pf-stat-lbl">BẢN CV</span>
                        </div>
                    </div>
                </div>

                <div className="pf-content-grid">
                    <div className="pf-main-col">
                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">badge</span>
                                    Thông tin chung
                                </h3>
                                <button className="pf-btn-text" onClick={openEdit}>Sửa</button>
                            </div>
                            <div className="pf-bio-box">
                                <div dangerouslySetInnerHTML={{ __html: profile.bio || 'Chưa có thông tin giới thiệu.' }} />
                            </div>
                        </div>

                        {/* Projects Management Section */}
                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">rocket_launch</span>
                                    Dự án cá nhân ({profile.projects?.length || 0})
                                </h3>
                                <button className="pf-btn-text" onClick={() => setShowProjectForm(true)}>+ Thêm dự án</button>
                            </div>
                            <div className="pf-projects-list">
                                {profile.projects?.length > 0 ? profile.projects.map((proj, idx) => (
                                    <div key={idx} className="pf-project-item">
                                        <div className="pf-project-info">
                                            <h4>{proj.name}</h4>
                                            {(proj.role || proj.startDate) && (
                                                <div className="pf-project-meta" style={{fontSize: '0.8125rem', color: 'var(--dau-primary)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', gap: '1rem'}}>
                                                    {proj.role && <span><span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'text-bottom'}}>person</span> {proj.role}</span>}
                                                    {(proj.startDate || proj.endDate) && <span><span className="material-symbols-outlined" style={{fontSize: '14px', verticalAlign: 'text-bottom'}}>calendar_month</span> {proj.startDate ? new Date(proj.startDate).toLocaleDateString('vi-VN') : ''} - {proj.endDate ? new Date(proj.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'}</span>}
                                                </div>
                                            )}
                                            {proj.technologies && (
                                                <div className="pf-project-tech" style={{fontSize: '0.75rem', color: 'var(--dau-text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>build</span> {proj.technologies}
                                                </div>
                                            )}
                                            {proj.description && <p>{proj.description}</p>}
                                            {proj.responsibilities && (
                                                <div className="pf-project-resp" style={{fontSize: '0.8125rem', color: 'var(--dau-text-main)', marginTop: '0.5rem', whiteSpace: 'pre-line', lineHeight: '1.6'}}>
                                                    {proj.responsibilities}
                                                </div>
                                            )}
                                            <div className="pf-project-links" style={{marginTop: '1rem'}}>
                                                {proj.repositoryUrl && <a href={proj.repositoryUrl} target="_blank" rel="noreferrer">Tài liệu đính kèm</a>}
                                                {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer">Sản phẩm / Demo</a>}
                                            </div>
                                        </div>
                                        <button className="pf-btn-icon-delete" onClick={() => handleDeleteProject(proj.id)}>
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                )) : <p className="pf-text-muted">Chưa có dự án nào được thêm.</p>}
                            </div>
                        </div>
                    </div>

                    <aside className="pf-sidebar-col" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">videocam</span>
                                    Video giới thiệu
                                </h3>
                            </div>
                            <div className="pf-video-window">
                                {profile.videoUrl ? (
                                    <video src={getImageUrl(profile.videoUrl)} controls className="pf-video-obj" />
                                ) : (
                                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400" alt="Video Placeholder" className="pf-video-obj" />
                                )}
                                {isUploading && <div className="pf-upload-overlay">Đang tải...</div>}
                            </div>
                            <label className="pf-btn-dau" style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined">upload</span>
                                {profile.videoUrl ? 'Đổi Video' : 'Thêm Video'}
                                <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
                            </label>
                        </div>

                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">psychology</span>
                                    Kỹ năng chuyên môn
                                </h3>
                                <button className="pf-btn-text" onClick={() => setShowSkillForm(true)}>+ Thêm</button>
                            </div>
                            <div className="pf-skill-tags">
                                {profile.skills?.length > 0 ? profile.skills.map((skill, idx) => (
                                    <div key={idx} className="pf-tag" onDoubleClick={() => handleDeleteSkill(skill.name)}>
                                        {skill.name}
                                    </div>
                                )) : <p className="pf-text-muted">Chưa cập nhật kỹ năng.</p>}
                            </div>
                        </div>

                        <div className="pf-card">
                            <div className="pf-card-header">
                                <h3 className="pf-card-title">
                                    <span className="material-symbols-outlined">description</span>
                                    Hồ sơ năng lực (CV)
                                </h3>
                            </div>
                            <div className="pf-cv-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {/* Bản trực tuyến của hệ thống */}
                                <div className="pf-cv-item" style={{ border: '1px dashed var(--dau-primary)', background: 'rgba(var(--dau-primary-rgb), 0.03)' }}>
                                    <div className="pf-cv-left">
                                        <div className="pf-cv-icon" style={{ color: 'var(--dau-primary)' }}><span className="material-symbols-outlined">auto_stories</span></div>
                                        <div className="pf-cv-info">
                                            <span className="pf-cv-title">Bản trực tuyến (Hệ thống)</span>
                                            <span className="pf-cv-meta" style={{fontSize: '0.75rem', opacity: 0.7}}>Dùng mẫu thiết kế của hệ thống</span>
                                        </div>
                                    </div>
                                    <Link to="/student/cv-management" className="pf-cv-btn" title="Chỉnh sửa bản thiết kế">
                                        <span className="material-symbols-outlined">edit_note</span>
                                    </Link>
                                </div>

                                <div style={{ height: '1px', background: '#eee', margin: '2px 0' }}></div>

                                {/* File đính kèm */}
                                {profile.resumeUrl ? (
                                    <div className="pf-cv-item">
                                        <div className="pf-cv-left">
                                            <div className="pf-cv-icon" style={{color: '#e74c3c'}}><span className="material-symbols-outlined">picture_as_pdf</span></div>
                                            <div className="pf-cv-info">
                                                <span className="pf-cv-title">File hồ sơ đính kèm</span>
                                            </div>
                                        </div>
                                        <div style={{display: 'flex', gap: '0.5rem'}}>
                                            <a href={getImageUrl(profile.resumeUrl)} target="_blank" rel="noreferrer" className="pf-cv-btn" title="Xem file">
                                                <span className="material-symbols-outlined">visibility</span>
                                            </a>
                                            <label className="pf-cv-btn" style={{cursor: 'pointer', margin: 0}} title="Đổi file khác">
                                                <span className="material-symbols-outlined">upload</span>
                                                <input type="file" accept="application/pdf" hidden onChange={handleResumeUpload} disabled={isUploading} />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="pf-btn-dau" style={{ cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', border: '1px solid #ddd', color: '#555', margin: 0, padding: '0.75rem' }}>
                                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>attach_file</span>
                                        {isUploading ? 'Đang tải lên...' : 'Đính kèm file PDF'}
                                        <input type="file" accept="application/pdf" hidden onChange={handleResumeUpload} disabled={isUploading} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* --- CONSOLIDATED EDIT MODAL --- */}
                {editMode && (
                    <div className="pf-modal-overlay">
                        <div className="pf-modal-container">
                            <div className="pf-modal-header">
                                <h3>Chỉnh sửa hồ sơ</h3>
                                <button className="pf-modal-close" onClick={() => setEditMode(false)}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="pf-modal-body">
                                {/* Avatar Edit Section */}
                                <div className="pf-modal-avatar-section">
                                    <div className="pf-modal-avatar-box">
                                        <img 
                                            src={profile.avatarUrl ? getImageUrl(profile.avatarUrl) : `https://ui-avatars.com/api/?name=${profile.fullName}&size=200`} 
                                            alt="Preview" 
                                        />
                                        <label htmlFor="modal-avatar-input" className="pf-avatar-overlay">
                                            <span className="material-symbols-outlined">photo_camera</span>
                                        </label>
                                        <input type="file" id="modal-avatar-input" hidden onChange={handleAvatarChange} />
                                    </div>
                                    <p className="pf-avatar-hint">Nhấn để thay đổi ảnh đại diện</p>
                                </div>

                                <div className="pf-modal-grid">
                                    <div className="pf-modal-field">
                                        <label>Họ và tên</label>
                                        <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="Nguyễn Lê Trường" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Mã sinh viên</label>
                                        <input type="text" value={form.studentIdStr} onChange={e => setForm({...form, studentIdStr: e.target.value})} placeholder="19KT123" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Lớp</label>
                                        <input type="text" value={form.academicYear} onChange={e => setForm({...form, academicYear: e.target.value})} placeholder="26kt6" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Chuyên ngành</label>
                                        <input type="text" value={form.major} onChange={e => setForm({...form, major: e.target.value})} placeholder="Kiến trúc" />
                                    </div>
                                </div>

                                <div className="pf-modal-field full-width">
                                    <label>Giới thiệu bản thân</label>
                                    <div className="pf-quill-wrapper">
                                        <ReactQuill 
                                            theme="snow" 
                                            value={form.bio} 
                                            onChange={val => setForm({...form, bio: val})} 
                                            modules={QUILL_MODULES}
                                        />
                                    </div>
                                </div>

                                <div className="pf-modal-grid">
                                    <div className="pf-modal-field">
                                        <label>Email</label>
                                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="example@gmail.com" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Số điện thoại</label>
                                        <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0901234567" />
                                    </div>
                                </div>

                                <div className="pf-modal-field full-width">
                                    <label>Địa chỉ</label>
                                    <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Số nhà, Tên đường, Quận/Huyện..." />
                                </div>

                                <div className="pf-modal-grid-3">
                                    <div className="pf-modal-field">
                                        <label>GPA</label>
                                        <input type="number" step="0.1" value={form.gpa} onChange={e => setForm({...form, gpa: e.target.value})} placeholder="4.0" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Website / Portfolio URL</label>
                                        <input type="text" value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} placeholder="dau.edu.vn" />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Facebook / LinkedIn</label>
                                        <input type="text" value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})} placeholder="linkedin.com/in/user" />
                                    </div>
                                </div>
                            </div>

                            <div className="pf-modal-footer">
                                <button className="pf-btn-save-all" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showSkillForm && (
                    <div className="pf-modal-overlay">
                        <div className="pf-modal-container small">
                            <div className="pf-modal-header">
                                <h3>Thêm kỹ năng chuyên môn</h3>
                                <button className="pf-modal-close" onClick={() => setShowSkillForm(false)}>&times;</button>
                            </div>
                            <div className="pf-modal-body">
                                <div className="pf-modal-field">
                                    <label>Tên kỹ năng</label>
                                    <input 
                                        type="text" 
                                        className="pf-input" 
                                        value={skillName} 
                                        onChange={e => setSkillName(e.target.value)} 
                                        placeholder="Nhập tên kỹ năng (vd: AutoCAD, Thuyết trình...)" 
                                    />
                                </div>
                            </div>
                            <div className="pf-modal-footer">
                                <button className="pf-btn-save-all" onClick={handleAddSkill} disabled={saving}>Thêm kỹ năng</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PROJECT FORM MODAL --- */}
                {showProjectForm && (
                    <div className="pf-modal-overlay">
                        <div className="pf-modal-container">
                            <div className="pf-modal-header">
                                <h3>Thêm dự án mới</h3>
                                <button className="pf-modal-close" onClick={() => setShowProjectForm(false)}>&times;</button>
                            </div>
                            <div className="pf-modal-body">
                                <div className="pf-modal-field">
                                    <label>Tên dự án</label>
                                    <input type="text" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} placeholder="Tên dự án, Đồ án, Công trình..." />
                                </div>
                                <div className="pf-modal-grid">
                                    <div className="pf-modal-field">
                                        <label>Vai trò / Vị trí</label>
                                        <input type="text" value={projectForm.role} onChange={e => setProjectForm({...projectForm, role: e.target.value})} placeholder="Kiến trúc sư, Quản lý dự án, Developer..." />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Công cụ / Kỹ năng sử dụng</label>
                                        <input type="text" value={projectForm.technologies} onChange={e => setProjectForm({...projectForm, technologies: e.target.value})} placeholder="AutoCAD, React, Excel, Photoshop..." />
                                    </div>
                                </div>
                                <div className="pf-modal-grid">
                                    <div className="pf-modal-field">
                                        <label>Ngày bắt đầu</label>
                                        <input type="date" value={projectForm.startDate} onChange={e => setProjectForm({...projectForm, startDate: e.target.value})} />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Ngày kết thúc (Để trống nếu đang làm)</label>
                                        <input type="date" value={projectForm.endDate} onChange={e => setProjectForm({...projectForm, endDate: e.target.value})} />
                                    </div>
                                </div>
                                <div className="pf-modal-field">
                                    <label>Mô tả ngắn</label>
                                    <textarea rows="2" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="Mô tả tóm tắt về dự án..."></textarea>
                                </div>
                                <div className="pf-modal-field" style={{marginBottom: '1.5rem'}}>
                                    <label>Chi tiết công việc / Thành tựu</label>
                                    <textarea rows="4" value={projectForm.responsibilities} onChange={e => setProjectForm({...projectForm, responsibilities: e.target.value})} placeholder="- Thiết kế bản vẽ 3D&#10;- Phân tích dữ liệu tài chính&#10;- Phát triển tính năng..."></textarea>
                                </div>
                                <div className="pf-modal-grid">
                                    <div className="pf-modal-field">
                                        <label>Link tài liệu / Mã nguồn (Tùy chọn)</label>
                                        <input type="text" value={projectForm.repositoryUrl} onChange={e => setProjectForm({...projectForm, repositoryUrl: e.target.value})} placeholder="Google Drive, GitHub..." />
                                    </div>
                                    <div className="pf-modal-field">
                                        <label>Link sản phẩm / Demo (Tùy chọn)</label>
                                        <input type="text" value={projectForm.demoUrl} onChange={e => setProjectForm({...projectForm, demoUrl: e.target.value})} placeholder="Behance, YouTube, Website..." />
                                    </div>
                                </div>
                            </div>
                            <div className="pf-modal-footer">
                                <button className="pf-btn-save-all" onClick={handleAddProject} disabled={saving}>Lưu dự án</button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Profile;
